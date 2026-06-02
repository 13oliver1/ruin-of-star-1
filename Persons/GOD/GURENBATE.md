---
name: GURENBATE
othername:
  - 古伦比亚特
  - Γκουρενμπιάτερ 
gender: 无
ethnicity: 神
time: 第一纪
birthday:
deathday:
象征: 多棱星，古老之物，光辉，微小星辉
height: 4.5m
photo:
lover: 无
family: 一切
角色编号:
简介: "刚诞生的时候有着中性化的外貌，后期越来越男性化，变成肌肉狂魔\r

  他是弟弟，匠神是哥哥\r

  这个神情绪稳定，最多会对邪神污秽表现出厌恶，最开始的时候就是哥哥下达命令，弟弟四处杀戮收集材料。\r

  他很少喊累，就算崩溃也是流着泪在杀人。为了孵化诸神，用自身的血液填满血池的时候也是他在不停的放血，对正常状态的他来说，为了达成目的一切都可以付出。然而他并不知道这种对污秽本能的厌恶来自命运神对他命运的禁锢和诅咒"
备注: 光，古，生命之神
职业: 光，古，生命之神
特点: 白发，宇宙手臂
爱好: 战斗狂
权柄: 一切的古老和光辉之物
tags:
  - oc
  - 神
banner:
banner_icon:name: 2026-04-07
following_date: 2026-04-07
---

# 基本信息

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
      "科学-空想": 0,
      "集权-分权": -2,
      "国际-民族": -3,
      "党派-公会": 0,
      "生产-生态": -2,
      "保守-进步": 0
    },
    "性格": {
      "外向-内向": 0,
      "谦虚-傲慢": 0,
      "理性-感性": -3,
      "严肃-轻浮": -2,
      "共情-冷血": -1,
      "利他-利己": 0,
      "迟钝-敏锐": -2
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
      "平衡-失调": -2,
      "举鼎-无力": -2,
      "明眸-失明": -3,
      "敏锐-失聪": -2,
      "强健-体弱": -2,
      "超忆-失忆": -3,
      "暴食-厌食": -3
    },
    "生活": {
      "奢靡-节省": 3,
      "朴素-时尚": -3,
      "正常-异常": 2,
      "厨神-蹩脚": 3,
      "高知-文盲": 1,
      "高雅-粗鄙": -3,
      "叛逆-守律": 3
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
