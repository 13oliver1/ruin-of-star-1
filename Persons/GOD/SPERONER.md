---
othername:
  - Aemobya
  - 丝佩罗涅
  - 阿莱比亚
gender: 女
ethnicity: 神
time: 第一纪
birthday:
deathday:
象征: 爱，欢愉，美丽，丰收，外交，社交，友爱，狂欢和迷醉之神，魅惑之神
height: 3m？
photo:
lover: 无
family: 古伦比亚特（父/母）库革帕罗斯（叔/姨/伯/姑）俄弗密诺斯（兄姊）
角色编号:
简介: "    爱神身边永远都不会缺少追随者，在她身边并不缺少神明，作为“爱”这一概念的具象化本身也有扭曲的一面，然而她是真实的美丽的存在，爱使得人们有了前进的动力，也犯下诸多的罪恶，她常常和战争之神结伴而出，有时候也会出现在智慧之神，航海（海/商业）神的身边，她是诸神的见证者，誓约者，是调理诸神关系的润滑油，如果没被诅咒，无论是白天还是夜晚她都会与之相伴，并且在夜晚中表明更多的欲望。\r

  \    可惜在诅咒下她无比的仇视夜晚，导致夜变成了不义的背叛和仇恨。\r

  \    在最后，灼热的大脑终于明白了那份浓烈的感情真的太过诡异，为何如此？明明白天应该与夜晚相伴。"
备注: 美，欢愉和丰收之神
职业: 美，欢愉和丰收之神
特点: 粉发之神
爱好: 爱与美丽，丰收和欢愉
权柄: 爱，欢愉，美丽，丰收，外交，社交，友爱，亲爱，恋爱，夫妻之爱, 誓言的见证者
tags:
  - oc
  - 神
banner:
banner_icon:name: 2026-04-07
following_date: 2026-04-07
name: SPERONER
---

## 基本信息
```dataviewjs
// 增强版角色卡片 - 支持图片（image属性）
const currentFile = dv.current();
const filePath = currentFile.file.path;
const frontmatter = app.metadataCache.getCache(filePath)?.frontmatter || {};

function getValue(attr, defaultValue = '-') {
    let val = frontmatter[attr];
    if (val === undefined || val === null) return defaultValue;
    if (Array.isArray(val)) return val.join(', ');
    return val;
}

function formatDate(value) {
    if (!value || value === '-') return '-';
    if (value instanceof Date) return value.toLocaleDateString();
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date.toLocaleDateString();
    return value;
}

function escapeHtml(str) {
    if (!str) return '';
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
const race = getValue('ethnicity');
const time= getValue('time', '-');
const birthday = getValue('birthday');
const deathday = getValue('deathday');
const like = getValue('象征');
const height = getValue('height', '-');
const lover = getValue('lover');
const family = getValue('family');
const roleId = getValue('角色编号', '-');
const description = getValue('简介', '暂无简介');
const ps = getValue('备注', '暂无备注');
const traits = getValue('特点');
const occupation = getValue('职业');
const hobbies = getValue('爱好');
const othername = getValue('othername', '-');
const power = getValue('权柄', '-');
let imageRaw = getValue('photo', null);
if (imageRaw === '-') imageRaw = null;

// 处理图片路径（Obsidian内部链接或外部URL）
let imageHtml = '';
if (imageRaw) {
    // 尝试提取内部链接路径 [[xxx.png]]
    let imgPath = imageRaw;
    const internalMatch = imageRaw.match(/\[\[([^\[\]]+)\]\]/);
    if (internalMatch) {
        imgPath = internalMatch[1];
    }
    // 简单判断是否为URL
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        imageHtml = `<img src="${escapeHtml(imgPath)}" class="card-image" alt="avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
    } else {
        // Obsidian内部图片，需要通过getResourcePath
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
            <div class="sub">NO.${escapeHtml(roleId)}</div>
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
        <div class="attr-item"><span class="attr-label">权柄</span><span class="attr-value">${escapeHtml(power)}</span></div>
    </div>
    <div class="description-section">
        <div class="description-label">简介</div>
        <div class="description-content">${escapeHtml(description).replace(/\n/g, '<br>')}</div>
    </div>
</div>
`;
```
```tendency
{
  "person": "",
  "domains": {
    "政治": {
      "革命-改良": 0,
      "科学-空想": 3,
      "集权-分权": -3,
      "国际-民族": 0,
      "党派-公会": 0,
      "生产-生态": 1,
      "保守-进步": -1
    },
    "性格": {
      "外向-内向": -3,
      "谦虚-傲慢": 3,
      "理性-感性": 2,
      "严肃-轻浮": 0,
      "共情-冷血": -2,
      "利他-利己": 2,
      "迟钝-敏锐": 3
    },
    "社交": {
      "利他-利己": 2,
      "外向-内向": -3,
      "自信-自卑": -3,
      "睚眦-豁达": -3,
      "敏感-迟钝": -3,
      "好事-避事": -2,
      "偏激-随和": 0
    },
    "饮食": {
      "超甜-厌甜": -1,
      "超苦-厌苦": 1,
      "超酸-厌酸": -1,
      "超辣-厌辣": -2,
      "超咸-厌咸": -1,
      "浓香-清淡": -2,
      "新鲜-腌制": -3
    },
    "身体": {
      "平衡-失调": -3,
      "举鼎-无力": 0,
      "明眸-失明": 0,
      "敏锐-失聪": -1,
      "强健-体弱": -3,
      "超忆-失忆": -2,
      "暴食-厌食": 1
    },
    "生活": {
      "奢靡-节省": -1,
      "朴素-时尚": 3,
      "正常-异常": -1,
      "厨神-蹩脚": -3,
      "高知-文盲": -3,
      "高雅-粗鄙": -3,
      "叛逆-守律": -3
    }
  }
}
```
## 时间线
```timeline
[line-3, body-2]
+ 第x纪</br> [????]年
+ [小标题]
+ [内容]

+ [????]年
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

## TIPS

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
