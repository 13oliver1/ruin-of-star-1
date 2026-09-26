// main.js - 完整版，包含批量添加功能
const { Plugin, MarkdownRenderChild, Notice, Modal } = require('obsidian');

const DEFAULT_DATA = {
    person: "",
    domains: {}
};

function clampValue(v) {
    let num = Number(v);
    if (isNaN(num)) return 0;
    return Math.min(3, Math.max(-3, Math.round(num)));
}

function getDescription(value) {
    const v = clampValue(value);
    if (v === 0) return "中立";
    const intensity = (Math.abs(v) === 3 ? "极度" : (Math.abs(v) === 2 ? "比较" : "轻微"));
    const direction = v > 0 ? "右倾" : "左倾";
    return intensity + direction;
}

function generateSummary(data, personName) {
    const summaries = [];
    for (const domain in data.domains) {
        for (const [trait, val] of Object.entries(data.domains[domain])) {
            const v = clampValue(val);
            if (v !== 0) {
                const intensity = (Math.abs(v) === 3 ? "非常" : (Math.abs(v) === 2 ? "比较" : "稍微"));
                const direction = v > 0 ? "右倾" : "左倾";
                summaries.push(`在「${domain}」的「${trait}」上，${intensity}${direction}`);
            } else {
                summaries.push(`在「${domain}」的「${trait}」上，表现中立`);
            }
        }
    }
    if (summaries.length === 0) return "暂无倾向数据。";
    return `**${personName}** 的倾向总结：` + summaries.join("；") + "。";
}

// 可点击圆圈评分组件
class ClickableCircles {
    constructor(container, initialValue, onChange) {
        this.container = container;
        this.value = clampValue(initialValue);
        this.onChange = onChange;
        this.render();
    }

    render() {
        this.container.empty();
        this.container.addClass("circle-rating");
        for (let i = 0; i <= 6; i++) {
            const circleVal = i - 3;
            const circle = this.container.createSpan({ cls: "rating-circle" });
            this.updateCircleStyle(circle, circleVal);
            circle.addEventListener("click", (e) => {
                e.stopPropagation();
                if (this.value === circleVal) return;
                this.value = circleVal;
                const circles = this.container.querySelectorAll(".rating-circle");
                circles.forEach((c, idx) => {
                    const val = idx - 3;
                    this.updateCircleStyle(c, val);
                });
                if (this.onChange) this.onChange(this.value);
            });
        }
    }

    updateCircleStyle(circle, circleVal) {
        circle.removeClass("filled-left", "filled-right", "filled-center", "active");
        if (circleVal < 0) {
            if (this.value < 0 && Math.abs(circleVal) <= Math.abs(this.value)) {
                circle.addClass("filled-left");
            }
        } else if (circleVal > 0) {
            if (this.value > 0 && circleVal <= this.value) {
                circle.addClass("filled-right");
            }
        } else {
            if (this.value === 0) circle.addClass("filled-center");
        }
        if (circleVal === this.value) {
            circle.addClass("active");
        }
        circle.setText("");
    }

    setValue(newVal, trigger = true) {
        const nv = clampValue(newVal);
        if (nv === this.value) return;
        this.value = nv;
        const circles = this.container.querySelectorAll(".rating-circle");
        circles.forEach((c, idx) => {
            const val = idx - 3;
            this.updateCircleStyle(c, val);
        });
        if (trigger && this.onChange) this.onChange(this.value);
    }
}

class TendencyCodeBlock extends MarkdownRenderChild {
    constructor(containerEl, sourceCode, plugin, filePath) {
        super(containerEl);
        this.containerEl = containerEl;
        this.sourceCode = sourceCode;
        this.plugin = plugin;
        this.filePath = filePath;
        this.data = this.parseData(sourceCode);
    }

    parseData(source) {
        try {
            const parsed = JSON.parse(source);
            if (!parsed.person) parsed.person = "";
            if (!parsed.domains) parsed.domains = {};
            for (const domain in parsed.domains) {
                for (const trait in parsed.domains[domain]) {
                    parsed.domains[domain][trait] = clampValue(parsed.domains[domain][trait]);
                }
            }
            return parsed;
        } catch (e) {
            return JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
    }

    serializeData() {
        return JSON.stringify(this.data, null, 2);
    }

    async saveToFile() {
        if (!this.filePath) return;
        const newContent = this.serializeData();
        if (newContent === this.sourceCode) return;
        this.sourceCode = newContent;
        const file = this.plugin.app.vault.getAbstractFileByPath(this.filePath);
        if (!file) return;
        const originalText = await this.plugin.app.vault.read(file);
        const codeBlockRegex = /```tendency\n([\s\S]*?)\n```/;
        const match = originalText.match(codeBlockRegex);
        if (match) {
            const newText = originalText.replace(match[1], newContent);
            await this.plugin.app.vault.modify(file, newText);
        }
    }

    onload() {
        this.render();
    }

    // 单个添加
    async addNewTrait(domain, trait) {
        if (!domain || !trait) {
            new Notice("领域和维度都不能为空");
            return false;
        }
        domain = domain.trim();
        trait = trait.trim();
        if (domain === "" || trait === "") {
            new Notice("领域和维度不能为空");
            return false;
        }
        if (!this.data.domains[domain]) {
            this.data.domains[domain] = {};
        }
        if (this.data.domains[domain].hasOwnProperty(trait)) {
            new Notice(`维度“${trait}”在领域“${domain}”中已存在`);
            return false;
        }
        this.data.domains[domain][trait] = 0;
        await this.saveToFile();
        this.render();
        return true;
    }

    // 批量添加
    async batchAddTraits(lines) {
        let addedCount = 0;
        let errorCount = 0;
        const errors = [];
        for (const line of lines) {
            if (line.trim() === "") continue;
            // 支持分隔符：空格、冒号、逗号、制表符
            let separator = null;
            if (line.includes(":")) separator = ":";
            else if (line.includes(" ")) separator = " ";
            else if (line.includes(",")) separator = ",";
            else if (line.includes("\t")) separator = "\t";
            if (!separator) {
                errorCount++;
                errors.push(`无法解析行: "${line}"`);
                continue;
            }
            const parts = line.split(separator);
            if (parts.length < 2) {
                errorCount++;
                errors.push(`格式错误: "${line}"`);
                continue;
            }
            const domain = parts[0].trim();
            const trait = parts[1].trim();
            if (domain === "" || trait === "") {
                errorCount++;
                errors.push(`领域或维度为空: "${line}"`);
                continue;
            }
            if (!this.data.domains[domain]) {
                this.data.domains[domain] = {};
            }
            if (this.data.domains[domain].hasOwnProperty(trait)) {
                errorCount++;
                errors.push(`已存在: ${domain} -> ${trait}`);
                continue;
            }
            this.data.domains[domain][trait] = 0;
            addedCount++;
        }
        if (addedCount > 0) {
            await this.saveToFile();
            this.render();
            new Notice(`成功添加 ${addedCount} 个维度，失败 ${errorCount} 个`);
            if (errors.length > 0 && errors.length <= 5) {
                // 显示部分错误
                new Notice(errors.slice(0,3).join("; "));
            } else if (errors.length > 5) {
                new Notice(`${errors.length} 个错误，请检查输入格式`);
            }
        } else {
            new Notice("没有成功添加任何维度，请检查格式");
        }
        return { addedCount, errorCount, errors };
    }

    render() {
        this.containerEl.empty();
        const container = this.containerEl.createDiv({ cls: "tendency-block" });

        // 总结区域
        const summaryDiv = container.createDiv({ cls: "tendency-summary" });
        const personName = this.data.person || this.plugin.getCurrentFileNameWithoutExt(this.filePath);
        summaryDiv.innerHTML = generateSummary(this.data, personName);

        // 工具栏区域（外部按钮）
        const toolbar = container.createDiv({ cls: "tendency-toolbar" });
        const addBtn = toolbar.createEl("button", { cls: "add-trait-btn", text: "+ 添加新维度" });
        addBtn.addEventListener("click", () => {
            new AddTraitModal(this.plugin.app, this).open();
        });
        const batchBtn = toolbar.createEl("button", { cls: "add-trait-btn batch-btn", text: "📦 批量添加" });
        batchBtn.addEventListener("click", () => {
            new BatchAddModal(this.plugin.app, this).open();
        });

        // 表格
        const table = container.createEl("table", { cls: "tendency-table" });
        const thead = table.createEl("thead");
        const headerRow = thead.createEl("tr");
        headerRow.createEl("th", { text: "领域" });
        headerRow.createEl("th", { text: "维度" });
        headerRow.createEl("th", { text: "评分" });
        headerRow.createEl("th", { text: "描述" });

        const tbody = table.createEl("tbody");

        for (const domainName in this.data.domains) {
            const traits = this.data.domains[domainName];
            for (const [traitName, rawValue] of Object.entries(traits)) {
                const safeValue = clampValue(rawValue);
                if (safeValue !== rawValue) {
                    this.data.domains[domainName][traitName] = safeValue;
                    this.saveToFile();
                }
                const row = tbody.createEl("tr");
                row.createEl("td", { text: domainName, cls: "td-center" });
                row.createEl("td", { text: traitName, cls: "td-center" });

                const ratingCell = row.createEl("td", { cls: "td-center" });
                const circlesContainer = ratingCell.createDiv();
                const circles = new ClickableCircles(circlesContainer, safeValue, async (newVal) => {
                    this.data.domains[domainName][traitName] = newVal;
                    descCell.setText(getDescription(newVal));
                    summaryDiv.innerHTML = generateSummary(this.data, personName);
                    await this.saveToFile();
                });

                const descCell = row.createEl("td", { text: getDescription(safeValue), cls: "td-center" });
            }
        }

        if (Object.keys(this.data.domains).length === 0) {
            const emptyRow = tbody.createEl("tr");
            const emptyCell = emptyRow.createEl("td", { colspan: "4", cls: "tendency-empty td-center" });
            emptyCell.setText("暂无数据。请点击上方按钮添加领域和维度。");
        }

        // 编辑原始数据按钮
        const editBtn = container.createEl("button", { cls: "tendency-edit-btn", text: "✏️ 编辑原始数据" });
        editBtn.addEventListener("click", () => {
            new EditJSONModal(this.plugin.app, this).open();
        });
    }
}

// 单个添加模态框
class AddTraitModal extends Modal {
    constructor(app, block) {
        super(app);
        this.block = block;
    }

    onOpen() {
        const { contentEl } = this;
        this.titleEl.setText("添加新维度");

        const domainInput = contentEl.createEl("input", {
            type: "text",
            placeholder: "领域 (例如: 性格)",
            cls: "add-domain-input"
        });
        domainInput.style.width = "100%";
        domainInput.style.marginBottom = "12px";

        const traitInput = contentEl.createEl("input", {
            type: "text",
            placeholder: "维度 (例如: 冒险精神)",
            cls: "add-trait-input"
        });
        traitInput.style.width = "100%";
        traitInput.style.marginBottom = "20px";

        const buttonDiv = contentEl.createDiv({ cls: "modal-buttons" });
        const confirmBtn = buttonDiv.createEl("button", { text: "添加" });
        const cancelBtn = buttonDiv.createEl("button", { text: "取消" });

        confirmBtn.addEventListener("click", async () => {
            const domain = domainInput.value;
            const trait = traitInput.value;
            const success = await this.block.addNewTrait(domain, trait);
            if (success) this.close();
        });
        cancelBtn.addEventListener("click", () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// 批量添加模态框
class BatchAddModal extends Modal {
    constructor(app, block) {
        super(app);
        this.block = block;
    }

    onOpen() {
        const { contentEl } = this;
        this.titleEl.setText("批量添加维度");
        const description = contentEl.createEl("p", { text: "每行格式: 领域 维度 或 领域:维度 或 领域,维度", cls: "batch-desc" });
        const textArea = contentEl.createEl("textarea", {
            cls: "batch-textarea",
            placeholder: "性格:社交\n性格:开放性\n政治:经济\n情感:热情"
        });
        textArea.style.width = "100%";
        textArea.style.height = "200px";
        textArea.style.marginBottom = "16px";
        textArea.style.fontFamily = "monospace";

        const buttonDiv = contentEl.createDiv({ cls: "modal-buttons" });
        const confirmBtn = buttonDiv.createEl("button", { text: "批量添加" });
        const cancelBtn = buttonDiv.createEl("button", { text: "取消" });

        confirmBtn.addEventListener("click", async () => {
            const rawText = textArea.value;
            const lines = rawText.split(/\r?\n/);
            await this.block.batchAddTraits(lines);
            this.close();
        });
        cancelBtn.addEventListener("click", () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class EditJSONModal extends Modal {
    constructor(app, block) {
        super(app);
        this.block = block;
    }

    onOpen() {
        const { contentEl } = this;
        this.titleEl.setText("编辑倾向数据 (JSON)");
        const textArea = contentEl.createEl("textarea", {
            cls: "tendency-json-editor",
            value: this.block.serializeData()
        });
        textArea.style.width = "100%";
        textArea.style.height = "300px";
        textArea.style.fontFamily = "monospace";
        const buttonDiv = contentEl.createDiv({ cls: "modal-buttons" });
        const saveBtn = buttonDiv.createEl("button", { text: "保存" });
        const cancelBtn = buttonDiv.createEl("button", { text: "取消" });
        saveBtn.addEventListener("click", async () => {
            try {
                const newData = JSON.parse(textArea.value);
                if (typeof newData !== "object" || !newData.hasOwnProperty("domains")) {
                    throw new Error("数据必须包含 domains 字段");
                }
                for (const domain in newData.domains) {
                    for (const trait in newData.domains[domain]) {
                        newData.domains[domain][trait] = clampValue(newData.domains[domain][trait]);
                    }
                }
                this.block.data = newData;
                this.block.sourceCode = this.block.serializeData();
                await this.block.saveToFile();
                this.block.render();
                this.close();
                new Notice("数据已更新");
            } catch (err) {
                new Notice("JSON 格式错误: " + err.message);
            }
        });
        cancelBtn.addEventListener("click", () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

module.exports = class PersonaTendencyPlugin extends Plugin {
    async onload() {
        this.registerMarkdownCodeBlockProcessor("tendency", (source, el, ctx) => {
            const file = this.app.workspace.getActiveFile();
            const filePath = file ? file.path : null;
            const component = new TendencyCodeBlock(el, source, this, filePath);
            ctx.addChild(component);
        });
    }

    getCurrentFileNameWithoutExt(filePath) {
        if (!filePath) return "未知人物";
        const name = filePath.split("/").pop();
        return name.replace(/\.md$/, "");
    }
};