// main.js
const { Plugin, MarkdownRenderChild, Notice, Modal } = require('obsidian');

// 预置数据（使用您提供的所有维度，格式均为“左-右”）
const PRESET_DATA = {
    person: "",
    domains: {
        "政治": {
            "革命-改良": 0,
            "科学-空想": 0,
            "集权-分权": 0,
            "国际-民族": 0,
            "党派-公会": 0,
            "生产-生态": 0,
            "保守-进步": 0
        },
        "性格": {
            "外向-内向": 0,
            "谦虚-傲慢": 0,
            "理性-感性": 0,
            "严肃-轻浮": 0,
            "共情-冷血": 0,
            "利他-利己": 0,
            "迟钝-敏锐": 0
        },
        "社交": {
            "利他-利己": 0,
            "外向-内向": 0,
            "自信-自卑": 0,
            "睚眦-豁达": 0,
            "敏感-迟钝": 0,
            "好事-避事": 0,
            "偏激-随和": 0
        },
        "饮食": {
            "超甜-厌甜": 0,
            "超苦-厌苦": 0,
            "超酸-厌酸": 0,
            "超辣-厌辣": 0,
            "超咸-厌咸": 0,
            "浓香-清淡": 0,
            "新鲜-腌制": 0
        },
        "身体": {
            "平衡-失调": 0,
            "举鼎-无力": 0,
            "明眸-失明": 0,
            "敏锐-失聪": 0,
            "强健-体弱": 0,
            "超忆-失忆": 0,
            "暴食-厌食": 0
        },
        "生活": {
            "奢靡-节省": 0,
            "朴素-时尚": 0,
            "正常-异常": 0,
            "厨神-蹩脚": 0,
            "高知-文盲": 0,
            "高雅-粗鄙": 0,
            "叛逆-守律": 0
        }
    }
};

function clampValue(v) {
    let num = Number(v);
    if (isNaN(num)) return 0;
    return Math.min(3, Math.max(-3, Math.round(num)));
}

// 将 "左-右" 拆分为左右两个词
function splitTrait(traitName) {
    const idx = traitName.indexOf('-');
    if (idx !== -1) {
        return { left: traitName.substring(0, idx).trim(), right: traitName.substring(idx + 1).trim() };
    }
    return { left: traitName, right: "" };
}

// 可点击圆圈组件（双端词，无额外描述）
class ClickableCircles {
    constructor(container, initialValue, leftWord, rightWord, onChange) {
        this.container = container;
        this.value = clampValue(initialValue);
        this.leftWord = leftWord;
        this.rightWord = rightWord;
        this.onChange = onChange;
        this.render();
    }

    render() {
        this.container.empty();
        this.container.classList.add("circle-rating-dual");

        // 左端词
        const leftSpan = document.createElement("span");
        leftSpan.className = "end-word left-word";
        leftSpan.textContent = this.leftWord;
        this.container.appendChild(leftSpan);

        // 圆圈容器
        const circlesDiv = document.createElement("div");
        circlesDiv.className = "circles-container";
        for (let i = 0; i <= 6; i++) {
            const circleVal = i - 3;
            const circle = document.createElement("span");
            circle.className = "rating-circle";
            circle.setAttribute("data-value", circleVal);
            circle.style.width = "24px";
            circle.style.height = "24px";
            circle.style.borderRadius = "50%";
            circle.style.display = "inline-block";
            circle.style.margin = "0 3px";
            circle.style.cursor = "pointer";
            circle.style.transition = "all 0.1s";
            this.updateCircleStyle(circle, circleVal);
            circle.addEventListener("click", (e) => {
                e.stopPropagation();
                if (this.value === circleVal) return;
                this.value = circleVal;
                const circles = circlesDiv.querySelectorAll(".rating-circle");
                circles.forEach(c => {
                    const val = parseInt(c.getAttribute("data-value"));
                    this.updateCircleStyle(c, val);
                });
                if (this.onChange) this.onChange(this.value);
            });
            circlesDiv.appendChild(circle);
        }
        this.container.appendChild(circlesDiv);

        // 右端词
        const rightSpan = document.createElement("span");
        rightSpan.className = "end-word right-word";
        rightSpan.textContent = this.rightWord;
        this.container.appendChild(rightSpan);
    }

    updateCircleStyle(circle, circleVal) {
        if (circleVal < 0) {
            if (this.value < 0 && Math.abs(circleVal) <= Math.abs(this.value)) {
                circle.style.backgroundColor = "#e74c3c"; // 左倾红色
                circle.style.opacity = "1";
            } else {
                circle.style.backgroundColor = "#cccccc";
                circle.style.opacity = "0.6";
            }
        } else if (circleVal > 0) {
            if (this.value > 0 && circleVal <= this.value) {
                circle.style.backgroundColor = "#2ecc71"; // 右倾绿色
                circle.style.opacity = "1";
            } else {
                circle.style.backgroundColor = "#cccccc";
                circle.style.opacity = "0.6";
            }
        } else {
            if (this.value === 0) {
                circle.style.backgroundColor = "#f1c40f"; // 中立黄色
                circle.style.opacity = "1";
            } else {
                circle.style.backgroundColor = "#cccccc";
                circle.style.opacity = "0.6";
            }
        }
        if (circleVal === this.value) {
            circle.style.boxShadow = "0 0 0 2px #3498db";
            circle.style.transform = "scale(1.1)";
        } else {
            circle.style.boxShadow = "none";
            circle.style.transform = "scale(1)";
        }
    }

    setValue(newVal, trigger = true) {
        const nv = clampValue(newVal);
        if (nv === this.value) return;
        this.value = nv;
        const circles = this.container.querySelectorAll(".rating-circle");
        circles.forEach(circle => {
            const val = parseInt(circle.getAttribute("data-value"));
            this.updateCircleStyle(circle, val);
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
            if (!parsed.domains || Object.keys(parsed.domains).length === 0) {
                return JSON.parse(JSON.stringify(PRESET_DATA));
            }
            for (const domain in parsed.domains) {
                for (const trait in parsed.domains[domain]) {
                    parsed.domains[domain][trait] = clampValue(parsed.domains[domain][trait]);
                }
            }
            return parsed;
        } catch (e) {
            return JSON.parse(JSON.stringify(PRESET_DATA));
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

    async addNewTrait(domain, traitName) {
        if (!domain || !traitName) return false;
        domain = domain.trim();
        traitName = traitName.trim();
        if (domain === "" || traitName === "") return false;
        if (!this.data.domains[domain]) this.data.domains[domain] = {};
        if (this.data.domains[domain].hasOwnProperty(traitName)) {
            new Notice(`维度“${traitName}”在领域“${domain}”中已存在`);
            return false;
        }
        this.data.domains[domain][traitName] = 0;
        await this.saveToFile();
        this.render();
        return true;
    }

    async batchAddTraits(inputText) {
        const lines = inputText.split(/\r?\n/);
        let successCount = 0;
        let failCount = 0;
        let currentDomain = null;
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed === "") continue;
            if (trimmed.startsWith("#")) {
                currentDomain = trimmed.substring(1).trim();
                continue;
            }
            if (currentDomain && trimmed) {
                const traitName = trimmed;
                const ok = await this.addNewTrait(currentDomain, traitName);
                if (ok) successCount++;
                else failCount++;
            } else {
                failCount++;
            }
        }
        new Notice(`批量添加：成功 ${successCount} 项，失败 ${failCount} 项`);
    }

    render() {
        this.containerEl.empty();
        const container = this.containerEl.createDiv({ cls: "tendency-container" });

        // 工具栏
        const toolbar = container.createDiv({ cls: "tendency-toolbar" });
        const batchBtn = toolbar.createEl("button", { cls: "tendency-btn", text: "📦 批量添加" });
        const singleBtn = toolbar.createEl("button", { cls: "tendency-btn", text: "+ 添加维度" });
        const editBtn = toolbar.createEl("button", { cls: "tendency-btn", text: "✏️ 编辑数据" });

        batchBtn.addEventListener("click", () => new BatchAddModal(this.plugin.app, this).open());
        singleBtn.addEventListener("click", () => new AddTraitModal(this.plugin.app, this).open());
        editBtn.addEventListener("click", () => new EditJSONModal(this.plugin.app, this).open());

        // 卡片网格
        const grid = container.createDiv({ cls: "tendency-grid" });

        for (const domainName in this.data.domains) {
            const traits = this.data.domains[domainName];
            if (Object.keys(traits).length === 0) continue;

            const card = grid.createDiv({ cls: "tendency-card" });
            const domainTitle = card.createDiv({ cls: "card-domain" });
            domainTitle.setText(domainName);

            const traitList = card.createDiv({ cls: "trait-list" });
            for (const [traitName, rawValue] of Object.entries(traits)) {
                const safeValue = clampValue(rawValue);
                if (safeValue !== rawValue) {
                    this.data.domains[domainName][traitName] = safeValue;
                    this.saveToFile();
                }
                const { left, right } = splitTrait(traitName);
                const traitRow = traitList.createDiv({ cls: "trait-row" });
                // 创建可点击圆圈组件，不产生额外描述文字
                new ClickableCircles(traitRow, safeValue, left, right, async (newVal) => {
                    this.data.domains[domainName][traitName] = newVal;
                    await this.saveToFile();
                });
            }
        }

        if (Object.keys(this.data.domains).length === 0) {
            grid.createDiv({ cls: "tendency-empty" }).setText("暂无数据，请点击上方按钮添加领域和维度。");
        }
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
        this.titleEl.setText("批量添加维度（格式：以 #领域 开头，每行一个维度名）");
        const textarea = contentEl.createEl("textarea", {
            cls: "batch-textarea",
            placeholder: "#政治\n革命-改良\n科学-空想\n#性格\n外向-内向\n谦虚-傲慢"
        });
        textarea.style.width = "100%";
        textarea.style.height = "250px";
        const buttonDiv = contentEl.createDiv({ cls: "modal-buttons" });
        const confirmBtn = buttonDiv.createEl("button", { text: "批量添加" });
        const cancelBtn = buttonDiv.createEl("button", { text: "取消" });
        confirmBtn.addEventListener("click", async () => {
            await this.block.batchAddTraits(textarea.value);
            this.close();
        });
        cancelBtn.addEventListener("click", () => this.close());
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
        const domainInput = contentEl.createEl("input", { type: "text", placeholder: "领域 (如: 性格)", cls: "add-domain-input" });
        domainInput.style.width = "100%";
        domainInput.style.marginBottom = "12px";
        const traitInput = contentEl.createEl("input", { type: "text", placeholder: "维度名称 (格式: 左-右，如: 外向-内向)", cls: "add-trait-input" });
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
}

// 编辑JSON模态框
class EditJSONModal extends Modal {
    constructor(app, block) {
        super(app);
        this.block = block;
    }
    onOpen() {
        const { contentEl } = this;
        this.titleEl.setText("编辑原始数据 (JSON)");
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