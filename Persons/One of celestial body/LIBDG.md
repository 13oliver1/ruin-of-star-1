---
name: LIBDG
othername: 利比狄歌
gender: 无
ethnicity: 神
time: 第三纪
birthday:
deathday:
象征: 白马、白鹿、白色或金色矿石、黄金、红色宝石、石榴石
height: 218
photo:
lover: 我
family: 哈莎（母）、我（父+母）、虚（自身，前身）、瑞密利欧（半自我，兄弟）
角色编号:
简介: "万喉千手之兽，光明与艺术的化身\r

  双子神中的年幼者，乐园的钥匙啊\r

  您是世界的开始与终结，遨游永恒命运的光。\r

  \r

  他的人格有一部分来自虚，大部分来自灼。\r

  \r

  达到了真正“完美”的存在，不过也因为“完美”而“不完美”，因为神性，无法理解凡人的悲哀。是的，有时候看起来好像特别没有人性，实际上是缺少作为凡人的体验，善于交流，比睿密利欧外向多了，至少从外表看就像是一只活泼阳光又有点稳重的金毛大狗狗。意外的充满了心机，并且经常把它用在讨人欢心上面。\r

  \r

  是的，他还记得作为【灼】的过去（第二纪）的事情。讨厌吗？讨厌。恨着哈莎，爱着命运，糟糕透顶。他讨厌哈莎是因为作为母亲却沉浸在爱人中，喜欢命运也是因为作为“母亲”却沉浸在爱人中。\r

  \r

  外貌\r

  浅色的肌肤，强壮而完美的体魄。丝绸般的白色长发如波涛般卷曲，面容经常遮掩在各种头纱下，在遥远的传说中其面容是俊美而充满野性的，和自己的兄弟，还有遥远过去的“虚”有着一样的面孔。降临在天体上时却给人爽朗而年轻的感觉，眼睛是如同太阳一般的金黄，暗藏世间一切动人的光辉。\r

  \   \r

  但是本体也比睿密利欧的更难理解，打个比方就像个没有触手但是伞盖上长满了手和嘴的水母。最初，在和双胞胎兄弟告别之后将自己的那一部分世界的善和恶彻底分离。原本之后打算去看看睿密利欧，却发现整个“世界”被彻底分成两半，因此决定去接引孩子们往生的灵魂。\r

  \r

  武器是指挥棒，撕裂次元释放并驯服那些存在，驱使它们战斗。在这方面，利比狄歌是无情而理智的驯服者。\r

  \r

  他的神殿里充满了永恒的光和热，白色的，带纹理大理石散发着奇妙动人的金色光辉，泉水边是繁花锦簇，大理石柱上缠满了活得非常自然的植物。伟大的神明高坐在神座上高歌，演奏。那宛若天国般的乐曲从中流泻而出，神圣的气息笼罩着这里，即使忘记了一切，在此处也会有各种情绪涌上来，甚至能模糊的唤起一些记忆。\r

  \r

  神明并非可以随意窥探外貌的存在，只有家人才能观望其面容，因此以面纱蒙面，既是威严，也是其慈悲，擅自窥探者只能归入奇怪存在的怀抱。\r

  \ \r

  在长久的孤独中，没有家人的陪伴，你是否会觉得太过寂寞？\r

  ……对不起。"
备注: 幼子神啊，与我共度永恒吧
职业: 创世神，音乐神，概念与规则神，游牧神，驯服者的神，旅行之神
特点: 红色带金色细条纹斗篷，白色波浪卷，灿烂的笑容，冰冷的心
爱好: 配偶，家人，旅行，音乐
权柄: 规则，制造和手工艺，音乐，酿造，狂欢，游牧，因为沉醉而产生的疯狂，家庭中年幼者的保护者，天体之光照耀的地带，
tags:
  - 神
  - oc
  - LIBDG
banner:
banner_icon:
followday:name:
  "{ name }":
---
## 基本信息
```dataviewjs
// 增强版角色卡片 - 修复版（添加 escapeHtml 和缺失变量）
const currentFile = dv.current();
const filePath = currentFile.file.path;
const frontmatter = app.metadataCache.getCache(filePath)?.frontmatter || {};

function getValue(attr, defaultValue = '-') {
    let val = frontmatter[attr];
    if (val === undefined || val === null) return defaultValue;
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val !== 'string') return String(val);
    return val;
}

function formatDate(value) {
    if (value === undefined || value === null || value === '-') return '-';
    if (value instanceof Date) return value.toLocaleDateString();
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date.toLocaleDateString();
    return String(value);
}

// ★★★★★ 添加 escapeHtml 函数（关键修复）★★★★★
function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    str = String(str);
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// 读取属性
const name = getValue('name', '未命名');
const gender = getValue('gender');
const race = getValue('ethnicity');      // 注意：种族对应 ethnicity
const time = getValue('time', '-');
const birthday = getValue('birthday');
const deathday = getValue('deathday');
const country = getValue('所属国');
const height = getValue('height', '-');
const lover = getValue('lover');
const family = getValue('family');
const roleId = getValue('角色编号', '-');
const description = getValue('简介', '暂无简介');
const ps = getValue('备注', '暂无备注');
const traits = getValue('特点');
const occupation = getValue('职业');
const hobbies = getValue('爱好');
const power = getValue('power', '-');
let imageRaw = getValue('photo', null);
if (imageRaw === '-') imageRaw = null;

// ★★★★★ 添加缺失的 othername 变量（别名）★★★★★
const othername = getValue('别名', '-');

// 处理图片路径（Obsidian内部链接或外部URL）
let imageHtml = '';
if (imageRaw) {
    let imgPath = imageRaw;
    const internalMatch = imageRaw.match(/\[\[([^\[\]]+)\]\]/);
    if (internalMatch) {
        imgPath = internalMatch[1];
    }
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        imageHtml = `<img src="${escapeHtml(imgPath)}" class="card-image" alt="avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
    } else {
        const imageFile = app.metadataCache.getFirstLinkpathDest(imgPath, filePath);
        if (imageFile) {
            const resourcePath = app.vault.getResourcePath(imageFile);
            imageHtml = `<img src="${resourcePath}" class="card-image" alt="avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        } else {
            imageHtml = `<div class="avatar-placeholder">${escapeHtml(name.charAt(0).toUpperCase() || '?')}</div>`;
        }
    }
} else {
    imageHtml = `<div class="avatar-placeholder">${escapeHtml(name.charAt(0).toUpperCase() || '?')}</div>`;
}

// 构建卡片HTML
const container = dv.container.createDiv();
container.style.margin = '1rem 0';

const style = `
.character-card {
    border: 1px solid var(--background-modifier-border);
    border-radius: 16px;
    padding: 1.5rem;
    background: var(--background-primary);
    transition: box-shadow 0.2s ease;
}
.character-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.card-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.8rem;
    flex-wrap: wrap;
}
.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--background-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid var(--background-modifier-border);
}
.avatar-placeholder {
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--text-muted);
}
.card-image {
    width: 100%;
    height: 100%;
    display: block;
}
.name-area h1 {
    font-size: 1.9rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    line-height: 1.2;
    color: var(--text-normal);
}
.name-area .sub {
    font-size: 0.85rem;
    color: var(--text-muted);
}
.attr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem 1.5rem;
    margin-bottom: 1.8rem;
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 1.5rem;
}
.attr-item {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    font-size: 0.9rem;
}
.attr-label {
    font-weight: 500;
    width: 70px;
    flex-shrink: 0;
    font-size: 0.9rem;
    color: var(--text-muted);
}
.attr-value {
    font-size: 1rem;
    color: var(--text-normal);
    word-break: break-word;
    flex: 1;
}
.description-section {
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 1.2rem;
    margin-top: 0.2rem;
}
.description-label {
    font-weight: 500;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: var(--text-normal);
}
.description-content {
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--text-normal);
    white-space: pre-wrap;
    background: var(--background-secondary);
    padding: 0.8rem 1rem;
    border-radius: 12px;
    margin: 0;
}
@media (max-width: 600px) {
    .character-card {
        padding: 1rem;
    }
    .attr-grid {
        grid-template-columns: 1fr;
    }
    .attr-label {
        width: 65px;
    }
}
`;

container.innerHTML = `
<style>${style}</style>
<div class="character-card">
    <div class="card-header">
        <div class="avatar">
            ${imageHtml}
        </div>
        <div class="name-area">
            <h1>${escapeHtml(name)}</h1>
            <div class="sub"><strong>NO.${escapeHtml(roleId)}</strong></div>
        </div>
    </div>
    <div class="attr-grid">
        <div class="attr-item"><span class="attr-label">身高</span><span class="attr-value">${escapeHtml(height)}</span></div>
        <div class="attr-item"><span class="attr-label">别名</span><span class="attr-value">${escapeHtml(othername)}</span></div>
        <div class="attr-item"><span class="attr-label">性别</span><span class="attr-value">${escapeHtml(gender)}</span></div>
        <div class="attr-item"><span class="attr-label">特性</span><span class="attr-value">${escapeHtml(traits)}</span></div>
        <div class="attr-item"><span class="attr-label">种族</span><span class="attr-value">${escapeHtml(race)}</span></div>
        <div class="attr-item"><span class="attr-label">职业</span><span class="attr-value">${escapeHtml(occupation)}</span></div>
        <div class="attr-item"><span class="attr-label">爱好</span><span class="attr-value">${escapeHtml(hobbies)}</span></div>
        <div class="attr-item"><span class="attr-label">爱人</span><span class="attr-value">${escapeHtml(lover)}</span></div>
        <div class="attr-item"><span class="attr-label">生日</span><span class="attr-value">${escapeHtml(formatDate(birthday))}</span></div>
        <div class="attr-item"><span class="attr-label">忌日</span><span class="attr-value">${escapeHtml(formatDate(deathday))}</span></div>
        <div class="attr-item"><span class="attr-label">家人</span><span class="attr-value">${escapeHtml(family)}</span></div>
        <div class="attr-item"><span class="attr-label">能力</span><span class="attr-value">${escapeHtml(power)}</span></div>
    </div>
    <div class="description-section">
        <div class="description-label">简介</div>
        <div class="description-content">${escapeHtml(description).replace(/\n/g, '<br>')}</div>
    </div>
</div>
`;
```
## 个人偏好
```tendency
{}
```
## 时间线
```timeline
[line-3, body-2]
+ 第x纪</br> [????]]年
+ [小标题]
+ [内容]

+ [????]]年
+ [小标题]
+ [内容]
```

---

## 相关人物/时间线

```dataviewjs
let names = dv.current().aliases ? dv.current().aliases : [];
names.push(dv.current().name)

// 参考 https://forum.obsidian.md/t/for-loops-and-dataviewjs/46284
// every: 每个要素都在；
// some: 某个要素在

dv.table(["论文","期刊","年份"],
dv.pages(`#paper`)
  .where(t => names.some(x => t.authors.includes(x)))
  .map(b => [b.file.link, b.journal, b.paper_date])
  .sort(b => b.paper_date, 'desc')
)
```

## 最新动态

```dataviewjs

let folderChoicePath = "00 - 每日日记/DailyNote"
const files = app.vault.getMarkdownFiles().filter(file => file.path.includes(folderChoicePath))
let names = dv.current().aliases ? dv.current().aliases : [];
names.push(dv.current().name)


let arr = files.map(async(file) => {
    const content = await app.vault.cachedRead(file)
    let lines = await content.split("\n").filter(line => names.some(name => line.includes(name)))
    //console.log(lines)
    return ["[["+file.name.split(".")[0]+"]]", lines]
})

Promise.all(arr).then(values => {
    const beautify = values.map(value => {
        const temp = value[1].map(line => { return line }) //美化要重写
        return [value[0],temp]
    })
    const exists = beautify.filter(value => value[1][0] && value[0] != "[[未命名 10]]") .sort(value => value[0],'desc')
    dv.table(["日期", "动态"], exists)
})
```
