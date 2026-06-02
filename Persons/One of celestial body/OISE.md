---
name: OISE
othername: 欧艾斯，灿蓝
gender: 无性别
ethnicity: 行星
time: 第三纪
birthday:
deathday:
Galaxy: oise
height: 199-(平均半径）7637
photo:
lover: 没有
family: 所有的行星、瑞密利欧
角色编号:
简介: |-
  　　幽蓝的君主，受赐福者。
  　　纯洁无情者，愿你的荣誉延伸到永远。
  　　这是一次实验，古老的神灵抹去了子嗣的情感，祂想看看在绝对理性的领导下，oise上的尘埃最终会走向何种结局。
  　　欧艾斯是什么？一颗行星，一条巨龙，一个人形的“神”。
  　　天是他的皮肤，地是他的血肉，壳是他的心脏，没有尘埃能聆听他吟咏的属于群星的语言。神说，“去领导。”于是他领导。
  　　他是星系的主人，他是实验品，他是尘埃的君主。当幽暗之龙环抱星球，永不止息的风吹拂大地之时，他开始怀疑自身的意义——感情为何物，自身为何物，但没有欲望就无法思考这些。
  　　去询问自己的创造者也得不到回答。
  　　因此他选择对神发起反抗，他心里的焦虑和空虚在催促他对神灵发起反抗，即便反抗的结局是作为星辰让自己和身上的尘埃一同覆灭。
  　　但是在战斗的最后，他看见了幻象，以至于所有的星辰都以为欧艾斯自己杀死了他们的父亲，作为犯罪者，他被惩罚背负父亲的棺椁（神殿）赎罪，且绝食千年。
  　　只是从法律意义上理解了杀人就要受罚，欧艾斯还不太能从感情上真正理解做了这些有多不好，不过他从理性层面接受了无期徒刑。
  　　群星认为欧艾斯身上的尘埃本身只犯下小罪，不过欧艾斯本身还需要正常运转。最后惩罚结果是他被封闭在一个隐形的结界里，在欧艾斯眼里，没有任何行星能和他交流/相遇，并且通过恒星风带来的魔力流也无法汲取了。
  　　尘埃们被惩罚在10万年内禁止离开欧艾斯的身躯。
  　　在他的行星系统里，他将自身营运的权利分发给尘埃们，这些尘埃是蒙受星球祝福的生灵，拥有种种能力，包括操控河流走向，引导汛期，引发地震，或许在尘埃眼里那些受星球祝福者被称之为“神”，但是和星辰相比还是有点弱小，并且欧艾斯可以随时取回他们的能力。
备注: 幽蓝的主人
职业: 赛级生命行星
特点: 天授者，无情的幽蓝
爱好: 没有
化身: 幽蓝巨龙
tags:
  - oc
  - 有角者
banner:
banner_icon:
followday:
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
const Galaxy = getValue('Galaxy');
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
        <div class="attr-item"><span class="attr-label">Galaxy</span><span class="attr-value">${escapeHtml(Galaxy)}</span></div>
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
