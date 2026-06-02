---
othername:
  - 俄弗密诺斯
  - 莱尔曼
gender: 无
ethnicity: 神
time: "#第一纪"
birthday: 第一纪第三天
deathday: 第一纪末尾
象征: 鱼类，海草
height: 237-？？？
photo:
lover: 无
family: 古伦比亚特（父/母）库革帕罗斯（叔/姨/伯/姑）亚尔哈特（兄姊）
角色编号: "050"
简介: "何其丰饶的俄弗密诺斯！\r

  大海和大洋的君王，暴怒和温驯的糅合体。

  愿你向我们展露永远的慈悲。

  原本大海将永远和天空相伴，因为诅咒，俄弗密诺斯诅咒了哈莎，让她靠近亚尔哈特就会变得狂躁不安。

  如果没有被诅咒的话可能会和日月求爱。

  常见形象为手持六分仪，有着墨绿色长发的男性，长发蓝色部分是清澈的海水，有小鱼在里面游动，原型是海洋，本人也精于计算，根据需要而扮演不同的性格（多变的海洋），本质上很包容，对所有人都一视同仁。因海难而死的人们不安的簇拥在他的脚边，期待着安眠之处的仁慈能将死亡的讯息带给自己的家人。

  到后期勉强发现了不对劲，试图向智慧之神求救但是失败了。"
备注: 航海、契约与商业之神
职业: 航海、契约与商业之神
tags:
  - oc
  - 神
banner: "photo/主页用/航海、契约与商业之神-20241003163337280.webp"
banner_icon:name: 2026-03-03
following_date: 2026-03-03
name: EFPRMINOS
爱好: 航海，宴席，交易，华美的东西，可以掌控的东西
权柄: 航海、契约、商业、海、洋、海水相关的天灾，宝藏，海洋的丰饶
特性: 头发是水做的
banner_y: 0.464
banner_x: 0.46082
Banner style: Gradient
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
      "革命-改良": 3,
      "科学-空想": 3,
      "集权-分权": -3,
      "国际-民族": 3,
      "党派-公会": -3,
      "生产-生态": 3,
      "保守-进步": 2
    },
    "性格": {
      "外向-内向": -3,
      "谦虚-傲慢": 2,
      "理性-感性": -3,
      "严肃-轻浮": 2,
      "共情-冷血": 2,
      "利他-利己": 3,
      "迟钝-敏锐": 3
    },
    "社交": {
      "利他-利己": -1,
      "外向-内向": -3,
      "自信-自卑": -3,
      "睚眦-豁达": -2,
      "敏感-迟钝": -3,
      "好事-避事": -2,
      "偏激-随和": 0
    },
    "饮食": {
      "超甜-厌甜": -1,
      "超苦-厌苦": 2,
      "超酸-厌酸": -1,
      "超辣-厌辣": -2,
      "超咸-厌咸": -1,
      "浓香-清淡": -2,
      "新鲜-腌制": -3
    },
    "身体": {
      "平衡-失调": -3,
      "举鼎-无力": -3,
      "明眸-失明": -3,
      "敏锐-失聪": -3,
      "强健-体弱": -3,
      "超忆-失忆": -3,
      "暴食-厌食": -1
    },
    "生活": {
      "奢靡-节省": -3,
      "朴素-时尚": 3,
      "正常-异常": -3,
      "厨神-蹩脚": -3,
      "高知-文盲": -3,
      "高雅-粗鄙": -2,
      "叛逆-守律": -2
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