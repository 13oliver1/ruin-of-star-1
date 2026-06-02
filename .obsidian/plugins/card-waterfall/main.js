/*
 * Obsidian 卡片瀑布流插件 (纯筛选版 - 修复空白页)
 * 功能：
 * - 无搜索功能，默认显示所有笔记
 * - 卡片图片：从笔记属性 firstphoto 读取
 * - 卡片信息：直接显示字段值（name 加粗，tags 为小药丸）
 * - 多条件筛选（支持任意 frontmatter 属性）、排序
 * - 多标签页独立状态
 * - URI 链接支持传递筛选条件
 * - 全局默认列数设置
 * - 设置内含详细使用说明
 */

const { Plugin, Notice, setIcon, moment } = require('obsidian');

// 默认设置
const DEFAULT_SETTINGS = {
    cardWidth: 280,
    maxPreviews: 200,
    displayFields: ['name', 'tags'],
    dateFormat: 'YYYY-MM-DD',
    imageField: 'firstphoto',
    filters: [],
    sortBy: 'mtime',
    sortOrder: 'desc',
    defaultColumns: 3,
};

class CardWaterfallPlugin extends Plugin {
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new WaterfallSettingTab(this.app, this));
        this.addCommand({
            id: 'open-card-waterfall',
            name: '打开卡片瀑布流',
            callback: () => this.openWaterfallView()
        });
        this.addRibbonIcon('images', '卡片瀑布流', () => this.openWaterfallView());
        this.registerView('card-waterfall', (leaf) => new WaterfallView(leaf, this));
        this.registerObsidianProtocolHandler('card-waterfall', (params) => {
            const options = {};
            if (params.sortBy) options.sortBy = params.sortBy;
            if (params.sortOrder) options.sortOrder = params.sortOrder;
            if (params.filters) {
                try { options.filters = JSON.parse(decodeURIComponent(params.filters)); } catch (e) {}
            }
            this.openWaterfallView(options);
        });
        this.injectStyles();
        console.log('卡片瀑布流插件（纯筛选版）加载完成');
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .card-waterfall-view { display: flex; flex-direction: column; height: 100%; background: var(--background-primary); }
            .waterfall-controls { padding: 12px; border-bottom: 1px solid var(--background-modifier-border); background: var(--background-secondary); display: flex; flex-direction: column; gap: 8px; }
            .control-row { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; }
            .filter-sort-row { display: flex; align-items: center; border-top: 1px solid var(--background-modifier-border); padding-top: 8px; }
            .sort-buttons { display: flex; gap: 4px; background: var(--background-primary); border-radius: 6px; padding: 2px; }
            .sort-button { padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 4px; }
            .sort-button.active { background: var(--interactive-accent); color: var(--text-on-accent); }
            .filter-button { display: flex; align-items: center; gap: 6px; padding: 4px 12px; background: var(--background-primary); border-radius: 6px; cursor: pointer; font-size: 0.9rem; border: 1px solid var(--background-modifier-border); }
            .filter-panel { position: absolute; top: 100px; left: 20px; width: 400px; max-width: 90vw; background: var(--background-primary); border: 1px solid var(--background-modifier-border); border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.2); padding: 16px; z-index: 100; display: none; }
            .filter-panel.visible { display: block; }
            .filter-item { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; padding: 8px; background: var(--background-secondary); border-radius: 8px; }
            .filter-field { width: 100px; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); }
            .filter-operator { width: 80px; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); }
            .filter-value { flex: 1; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); }
            .filter-active { width: 20px; height: 20px; cursor: pointer; }
            .filter-delete { color: var(--text-error); cursor: pointer; padding: 0 4px; font-size: 1.2rem; }
            .filter-add { margin-top: 12px; padding: 8px; width: 100%; background: var(--interactive-normal); border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
            .filter-add:hover { background: var(--interactive-hover); }
            .waterfall-container { display: flex; flex-wrap: wrap; gap: 16px; padding: 16px; overflow-y: auto; flex: 1; align-content: flex-start; }
            .waterfall-card { flex: 0 0 var(--card-width,280px); background: var(--background-secondary); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: 0.2s; cursor: pointer; display: flex; flex-direction: column; border: 1px solid var(--background-modifier-border); }
            .waterfall-card:hover { transform: translateY(-6px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
            .card-image { width: 100%; height: 170px; background: var(--background-primary-alt); display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid var(--background-modifier-border); position: relative; }
            .card-image-img { width: 100%; height: 100%; object-fit: cover; }
            .card-image-fallback { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: var(--text-muted); font-size: 48px; }
            .card-info { padding: 14px; display: flex; flex-direction: column; gap: 6px; }
            .card-field-value { color: var(--text-normal); word-break: break-word; }
            .card-field-value[data-field="name"] { font-weight: bold; font-size: 1.1em; }
            .card-field-value[data-field="tags"] { display: flex; flex-wrap: wrap; gap: 4px; }
            .card-tag { background: var(--tag-background); color: var(--tag-color); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; border: 1px solid var(--tag-border); }
            .waterfall-empty { padding: 40px; text-align: center; color: var(--text-muted); width: 100%; font-size: 1.1rem; }
            .card-image-field-badge { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; padding: 4px 8px; border-radius: 20px; font-size: 0.7rem; backdrop-filter: blur(4px); pointer-events: none; z-index: 1; }
        `;
        document.head.appendChild(style);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        if (!this.settings.imageField) this.settings.imageField = 'firstphoto';
        if (!this.settings.filters) this.settings.filters = [];
        if (!this.settings.defaultColumns) this.settings.defaultColumns = 3;
    }
    async saveSettings() { await this.saveData(this.settings); }
    openWaterfallView(options = {}) {
        const leaf = this.app.workspace.getLeaf('tab');
        leaf.setViewState({ type: 'card-waterfall', state: options, active: true });
    }
}

class WaterfallView extends require('obsidian').ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        const state = this.leaf.viewState?.state || {};
        this.filters = state.filters ? JSON.parse(JSON.stringify(state.filters)) : JSON.parse(JSON.stringify(plugin.settings.filters));
        this.sortBy = state.sortBy || plugin.settings.sortBy;
        this.sortOrder = state.sortOrder || plugin.settings.sortOrder;
        this.columns = plugin.settings.defaultColumns;
        this.notes = [];
        this.allNotes = [];
    }
    getViewType() { return 'card-waterfall'; }
    getDisplayText() { return '卡片瀑布流'; }
    getIcon() { return 'images'; }

    async onOpen() {
        console.log('WaterfallView onOpen started');
        const { containerEl } = this; // 使用 containerEl 而不是 contentEl
        containerEl.empty().addClass('card-waterfall-view');
        const controlDiv = containerEl.createDiv({ cls: 'waterfall-controls' });

        // 第一行：右侧控件（列数 + 排序）
        const row1 = controlDiv.createDiv({ cls: 'control-row' });
        const rightDiv = row1.createDiv({ cls: 'control-right' });
        const colDiv = rightDiv.createDiv({ cls: 'waterfall-control-item' });
        colDiv.createSpan({ text: '列数:' });
        const colSlider = colDiv.createEl('input', { type: 'range', cls: 'waterfall-column-slider', min: '1', max: '6', step: '1', value: this.columns });
        const colVal = colDiv.createSpan({ text: this.columns });
        colSlider.addEventListener('input', e => {
            this.columns = parseInt(e.target.value);
            colVal.textContent = this.columns;
            this.applyColumnWidth();
        });

        const sortDiv = rightDiv.createDiv({ cls: 'sort-buttons' });
        const sortTime = sortDiv.createDiv({ cls: 'sort-button', text: '📅 时间' });
        const sortName = sortDiv.createDiv({ cls: 'sort-button', text: '🔤 名称' });
        const sortOrderBtn = sortDiv.createDiv({ cls: 'sort-button', text: this.sortOrder === 'desc' ? '⬇️ 降序' : '⬆️ 升序' });
        this.updateSortButtons(sortTime, sortName, sortOrderBtn);
        sortTime.onclick = () => { this.sortBy = 'mtime'; this.updateSortButtons(sortTime, sortName, sortOrderBtn); this.filterAndRender(); };
        sortName.onclick = () => { this.sortBy = 'name'; this.updateSortButtons(sortTime, sortName, sortOrderBtn); this.filterAndRender(); };
        sortOrderBtn.onclick = () => {
            this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
            sortOrderBtn.textContent = this.sortOrder === 'desc' ? '⬇️ 降序' : '⬆️ 升序';
            this.filterAndRender();
        };

        // 第二行：筛选按钮
        const row2 = controlDiv.createDiv({ cls: 'filter-sort-row' });
        this.filterButton = row2.createDiv({ cls: 'filter-button' });
        setIcon(this.filterButton, 'filter');
        this.filterButton.createSpan({ text: `筛选 (${this.filters.length})` });
        this.filterButton.addEventListener('click', e => { e.stopPropagation(); this.toggleFilterPanel(); });
        this.filterPanel = containerEl.createDiv({ cls: 'filter-panel' });
        this.renderFilterPanel();

        this.container = containerEl.createDiv({ cls: 'waterfall-container' });
        this.container.style.setProperty('--card-width', this.plugin.settings.cardWidth + 'px');
        console.log('Container created');

        // 加载所有笔记
        try {
            await this.loadAllNotes();
            console.log(`Loaded ${this.allNotes.length} notes`);
        } catch (e) {
            console.error('Error loading notes:', e);
            new Notice('加载笔记时出错，请查看控制台');
        }

        // 应用筛选并渲染
        this.filterAndRender();

        this.registerEvent(this.app.vault.on('modify', () => this.loadAllNotes().then(() => this.filterAndRender())));
        this.registerEvent(this.app.vault.on('delete', () => this.loadAllNotes().then(() => this.filterAndRender())));
        this.registerEvent(this.app.vault.on('create', () => this.loadAllNotes().then(() => this.filterAndRender())));
        window.addEventListener('resize', () => this.applyColumnWidth());
        this.registerDomEvent(document, 'click', e => {
            if (this.filterPanel?.classList.contains('visible') && !this.filterPanel.contains(e.target) && !this.filterButton.contains(e.target))
                this.filterPanel.classList.remove('visible');
        });
        console.log('WaterfallView onOpen completed');
    }

    updateSortButtons(t, n, o) {
        t.classList.toggle('active', this.sortBy === 'mtime');
        n.classList.toggle('active', this.sortBy === 'name');
        o.textContent = this.sortOrder === 'desc' ? '⬇️ 降序' : '⬆️ 升序';
    }

    toggleFilterPanel() {
        if (this.filterPanel.classList.contains('visible')) this.filterPanel.classList.remove('visible');
        else { this.renderFilterPanel(); this.filterPanel.classList.add('visible'); }
    }

    renderFilterPanel() {
        if (!this.filterPanel) return;
        this.filterPanel.empty();
        if (this.filters.length === 0) {
            this.filterPanel.createEl('div', { text: '暂无筛选条件', cls: 'filter-empty', style: 'color: var(--text-muted); padding: 8px;' });
        } else {
            this.filters.forEach((f, idx) => {
                const item = this.filterPanel.createDiv({ cls: 'filter-item' });
                const field = item.createEl('input', { cls: 'filter-field', type: 'text', placeholder: '属性', value: f.field || '' });
                field.oninput = () => { f.field = field.value; this.filterAndRender(); };
                const op = item.createEl('select', { cls: 'filter-operator' });
                ['等于','包含','大于','小于'].forEach(o => {
                    const opt = op.createEl('option', { text: o, value: o });
                    if (f.operator === o) opt.selected = true;
                });
                op.onchange = () => { f.operator = op.value; this.filterAndRender(); };
                const val = item.createEl('input', { cls: 'filter-value', type: 'text', placeholder: '值', value: f.value || '' });
                val.oninput = () => { f.value = val.value; this.filterAndRender(); };
                const active = item.createEl('input', { cls: 'filter-active', type: 'checkbox' });
                active.checked = f.active !== false;
                active.onchange = () => { f.active = active.checked; this.filterAndRender(); };
                const del = item.createEl('span', { cls: 'filter-delete', text: '✕' });
                del.onclick = () => { this.filters.splice(idx,1); this.renderFilterPanel(); this.filterAndRender(); this.updateFilterCount(); };
            });
        }
        const add = this.filterPanel.createEl('button', { cls: 'filter-add', text: '+ 添加筛选条件' });
        add.onclick = () => {
            this.filters.push({ field:'', operator:'等于', value:'', active:true });
            this.renderFilterPanel();
            this.updateFilterCount();
        };
        const close = this.filterPanel.createEl('button', { text:'关闭', cls:'mod-cta', style:'margin-top:12px; width:100%;' });
        close.onclick = () => this.filterPanel.classList.remove('visible');
        this.updateFilterCount();
    }

    updateFilterCount() {
        if (this.filterButton) {
            const span = this.filterButton.querySelector('span');
            if (span) span.textContent = `筛选 (${this.filters.length})`;
        }
    }

    applyColumnWidth() {
        if (!this.container) return;
        const w = this.container.clientWidth;
        const gap = 16;
        const cw = (w - gap * (this.columns - 1)) / this.columns - 2;
        if (cw > 100) this.container.style.setProperty('--card-width', cw + 'px');
    }

    // 加载所有笔记（受最大预览数限制）
    async loadAllNotes() {
        const files = this.app.vault.getMarkdownFiles();
        const max = this.plugin.settings.maxPreviews;
        const notes = [];

        for (let i = 0; i < files.length && notes.length < max; i++) {
            const file = files[i];
            const cache = this.app.metadataCache.getFileCache(file);
            if (!cache) continue;

            const content = await this.app.vault.cachedRead(file);
            const bodyTags = cache.tags ? cache.tags.map(t => t.tag.replace(/^#/, '')) : [];
            let fmTags = [];
            if (cache.frontmatter?.tags) {
                const ft = cache.frontmatter.tags;
                if (Array.isArray(ft)) fmTags = ft.map(t => String(t).replace(/^#/, '').trim());
                else if (typeof ft === 'string') fmTags = ft.split(',').map(t => t.replace(/^#/, '').trim());
            }
            const allTags = [...new Set([...bodyTags, ...fmTags])];

            notes.push({
                file,
                name: file.basename,
                path: file.path,
                content,
                tags: allTags,
                frontmatter: cache.frontmatter || {},
                stat: file.stat
            });
        }
        this.allNotes = notes;
        console.log(`loadAllNotes finished: ${notes.length} notes loaded`);
    }

    filterAndRender() {
        console.log('filterAndRender called, allNotes length:', this.allNotes.length);
        let filtered = [...this.allNotes];
        const activeFilters = this.filters.filter(f => f.active && f.field && f.value);
        if (activeFilters.length) {
            filtered = filtered.filter(note => activeFilters.every(f => {
                const val = this.getFieldValue(note, f.field);
                if (val === undefined || val === '') return false;
                const strVal = String(val).toLowerCase();
                const fVal = f.value.toLowerCase();
                if (f.operator === '等于') return strVal === fVal;
                if (f.operator === '包含') return strVal.includes(fVal);
                if (f.operator === '大于') {
                    const num = parseFloat(val), fn = parseFloat(f.value);
                    if (!isNaN(num) && !isNaN(fn)) return num > fn;
                    return strVal > fVal;
                }
                if (f.operator === '小于') {
                    const num = parseFloat(val), fn = parseFloat(f.value);
                    if (!isNaN(num) && !isNaN(fn)) return num < fn;
                    return strVal < fVal;
                }
                return true;
            }));
        }

        if (this.sortBy === 'mtime') {
            filtered.sort((a,b) => this.sortOrder === 'desc' ? b.stat.mtime - a.stat.mtime : a.stat.mtime - b.stat.mtime);
        } else {
            filtered.sort((a,b) => {
                const an = a.name.toLowerCase(), bn = b.name.toLowerCase();
                return this.sortOrder === 'desc' ? bn.localeCompare(an) : an.localeCompare(bn);
            });
        }

        console.log('filterAndRender: rendering', filtered.length, 'cards');
        this.renderCards(filtered);
    }

    getFieldValue(note, field) {
        const fm = note.frontmatter || {};
        switch(field) {
            case 'name': return note.name;
            case 'alias': return fm.alias || '';
            case 'tags': return note.tags;
            case 'ctime': return note.stat.ctime ? moment(note.stat.ctime).format(this.plugin.settings.dateFormat) : '';
            case 'mtime': return note.stat.mtime ? moment(note.stat.mtime).format(this.plugin.settings.dateFormat) : '';
            default: return fm[field] || '';
        }
    }

    renderFieldValue(container, field, value) {
        const span = container.createSpan({ cls: 'card-field-value' });
        span.setAttribute('data-field', field);
        if (field === 'tags' && Array.isArray(value) && value.length) {
            value.slice(0,5).forEach(t => span.createSpan({ cls: 'card-tag', text: t }));
            if (value.length > 5) span.createSpan({ cls: 'card-tag', text: `+${value.length-5}` });
        } else if (value && typeof value === 'object') {
            span.setText(Array.isArray(value) ? value.join(', ') : String(value));
        } else {
            span.setText(String(value || ''));
        }
        if (!value || (Array.isArray(value) && !value.length)) {
            span.style.color = 'var(--text-faint)';
            span.setText('(无)');
        }
    }

    getImageFromProperty(note) {
        const f = this.plugin.settings.imageField;
        if (!f) return null;
        let path = note.frontmatter?.[f];
        if (!path) {
            const m = note.content.match(new RegExp(`${f}::\\s*(.*?)(\\n|$)`, 'i'));
            if (m) path = m[1].trim();
        }
        return path;
    }

    resolveImagePath(path, note) {
        if (!path) return null;
        if (path.match(/^https?:\/\//i)) return path;
        try {
            let file = this.app.vault.getAbstractFileByPath(path);
            if (!file && note.file.parent) file = this.app.vault.getAbstractFileByPath(note.file.parent.path + '/' + path);
            if (!file) file = this.app.vault.getAbstractFileByPath(path.replace(/^\.\//, ''));
            if (file) return this.app.vault.getResourcePath(file);
        } catch (e) {}
        return path;
    }

    renderCards(notes) {
        if (!this.container) {
            console.error('renderCards: container is null');
            return;
        }
        this.container.empty();
        if (!notes?.length) {
            this.container.createDiv({ cls: 'waterfall-empty', text: '✨ 没有找到匹配的笔记，试试调整筛选条件吧' });
            console.log('renderCards: empty state shown');
            return;
        }
        notes.forEach(note => {
            try {
                const card = this.container.createDiv({ cls: 'waterfall-card' });
                card.onclick = () => this.app.workspace.openLinkText(note.path, '');

                const imgDiv = card.createDiv({ cls: 'card-image' });
                const badge = imgDiv.createDiv({ cls: 'card-image-field-badge', text: `📷 ${this.plugin.settings.imageField}` });
                const imgPath = this.getImageFromProperty(note);
                if (imgPath) {
                    const src = this.resolveImagePath(imgPath, note);
                    const img = imgDiv.createEl('img', { cls: 'card-image-img', src });
                    img.onerror = () => {
                        img.remove(); badge.remove();
                        const fb = imgDiv.createDiv({ cls: 'card-image-fallback' });
                        setIcon(fb, 'image-off');
                    };
                } else {
                    badge.setText(`⚠️ 无 ${this.plugin.settings.imageField}`);
                    const fb = imgDiv.createDiv({ cls: 'card-image-fallback' });
                    setIcon(fb, 'file-image');
                }

                const info = card.createDiv({ cls: 'card-info' });
                const fields = this.plugin.settings.displayFields;
                if (!fields.length) {
                    const n = info.createSpan({ cls: 'card-field-value', text: note.name });
                    n.style.fontWeight = 'bold'; n.style.fontSize = '1.1em';
                } else {
                    fields.forEach(f => {
                        const val = this.getFieldValue(note, f);
                        this.renderFieldValue(info, f, val);
                    });
                }
            } catch (e) {
                console.error('Error rendering card for note:', note.path, e);
            }
        });
        console.log('renderCards completed');
    }
}

class WaterfallSettingTab extends require('obsidian').PluginSettingTab {
    constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
    display() {
        const { containerEl } = this;
        containerEl.empty();

        // ========== 使用说明 ==========
        const ins = containerEl.createDiv();
        ins.createEl('h3', { text: '📖 使用说明' });

        const createSection = (title, content) => {
            const section = ins.createDiv();
            section.createEl('h4', { text: title, attr: { style: 'margin-bottom: 4px;' } });
            section.createEl('p', { text: content, attr: { style: 'margin-top: 0; color: var(--text-muted);' } });
        };

        createSection('1. 准备笔记',
            '在笔记 frontmatter 中设置图片字段（默认 firstphoto），例如：\n' +
            '---\n' +
            'firstphoto: attachments/paris.jpg\n' +
            'alias: 巴黎游记\n' +
            'tags: [旅行]\n' +
            '---\n' +
            '# 我的旅行笔记');

        createSection('2. 打开瀑布流',
            '点击左侧栏的 🖼️ 图标，或使用命令“打开卡片瀑布流”。每次打开都会在新标签页创建独立视图。');

        createSection('3. 筛选',
            '点击“筛选”按钮，弹出面板后可添加多个条件。每个条件包含：属性名、运算符（等于/包含/大于/小于）、值、激活复选框。点击 ✕ 可删除。');

        createSection('4. 排序',
            '右上角有三个排序按钮：📅 时间、🔤 名称、⬇️/⬆️ 升降序。点击切换。');

        createSection('5. 列数调整',
            '右上角有列数滑块（1-6），可实时调整卡片列数。全局默认列数可在下方设置。');

        createSection('6. 自定义卡片显示字段',
            '在下方“卡片显示字段”区域，每行输入一个属性名（如 name、tags、created）。' +
            '其中 name 会自动加粗，tags 会显示为彩色小药丸。');

        createSection('7. URI 链接',
            '在其他笔记中创建链接，可打开带有预设筛选条件的瀑布流。\n' +
            '示例：\n' +
            '[筛选作者为张三的笔记](obsidian://card-waterfall?filters=' + encodeURIComponent('[{"field":"author","operator":"等于","value":"张三","active":true}]') + '&sortBy=name&sortOrder=asc)\n' +
            '支持参数：sortBy, sortOrder, filters（需 URL 编码）。');

        ins.createEl('hr');

        // ========== 设置项 ==========
        containerEl.createEl('h2', { text: '卡片瀑布流设置' });

        new require('obsidian').Setting(containerEl)
            .setName('全局默认列数')
            .setDesc('新打开的卡片瀑布流视图默认显示的列数（每个视图可独立调整滑块）')
            .addSlider(slider => slider
                .setLimits(1, 6, 1)
                .setValue(this.plugin.settings.defaultColumns)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.defaultColumns = value;
                    await this.plugin.saveSettings();
                }));

        new require('obsidian').Setting(containerEl)
            .setName('图片字段名')
            .setDesc('笔记属性中存储图片路径的字段名称（默认：firstphoto）')
            .addText(text => text
                .setPlaceholder('firstphoto')
                .setValue(this.plugin.settings.imageField)
                .onChange(async (value) => {
                    this.plugin.settings.imageField = value.trim() || 'firstphoto';
                    await this.plugin.saveSettings();
                }));

        new require('obsidian').Setting(containerEl)
            .setName('卡片宽度')
            .setDesc('设置卡片的基准宽度（像素）')
            .addSlider(slider => slider
                .setLimits(200, 400, 10)
                .setValue(this.plugin.settings.cardWidth)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.cardWidth = value;
                    await this.plugin.saveSettings();
                }));

        new require('obsidian').Setting(containerEl)
            .setName('最大预览数')
            .setDesc('限制加载的笔记数量')
            .addSlider(slider => slider
                .setLimits(20, 500, 10)
                .setValue(this.plugin.settings.maxPreviews)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxPreviews = value;
                    await this.plugin.saveSettings();
                }));

        new require('obsidian').Setting(containerEl)
            .setName('日期格式')
            .setDesc('使用 moment.js 格式，如 YYYY-MM-DD')
            .addText(text => text
                .setPlaceholder('YYYY-MM-DD')
                .setValue(this.plugin.settings.dateFormat)
                .onChange(async (value) => {
                    this.plugin.settings.dateFormat = value || 'YYYY-MM-DD';
                    await this.plugin.saveSettings();
                }));

        containerEl.createEl('h3', { text: '卡片显示字段' });

        const fieldDesc = containerEl.createDiv();
        fieldDesc.setText('输入笔记属性字段名（每行一个）。将直接显示字段值，其中 "name" 会自动加粗，"tags" 会显示为小药丸。');
        fieldDesc.style.marginBottom = '10px'; fieldDesc.style.color = 'var(--text-muted)'; fieldDesc.style.fontSize = '0.9em';

        const area = containerEl.createEl('textarea', {
            cls: 'waterfall-fields-textarea',
            text: this.plugin.settings.displayFields.join('\n')
        });
        area.style.width = '100%'; area.style.minHeight = '120px'; area.style.fontFamily = 'monospace'; area.style.marginBottom = '10px';

        new require('obsidian').Setting(containerEl)
            .addButton(b => b.setButtonText('保存字段设置').setCta().onClick(async () => {
                const fields = area.value.split('\n').map(l => l.trim()).filter(l => l);
                this.plugin.settings.displayFields = fields;
                await this.plugin.saveSettings();
                new Notice('字段设置已保存');
            }))
            .addButton(b => b.setButtonText('恢复默认').setWarning().onClick(async () => {
                this.plugin.settings.displayFields = ['name', 'tags'];
                await this.plugin.saveSettings();
                this.display();
                new Notice('已恢复默认字段');
            }));
    }
}

module.exports = CardWaterfallPlugin;