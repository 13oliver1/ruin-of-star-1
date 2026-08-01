---
name: Andteas·Korenkarth
othername: 安提斯-克伦卡特
gender: 男
ethnicity: 人类
time: "#第三纪"
birthday:
deathday:
height: 183
photo:
lover: 伊莉弥
family: 阿斯特利斯（母）
所属国: 合众国
角色编号: 1
简介:
职业:
tags: oc
banner:
banner_icon:
following_date: 2026-03-10
---

## 基本信息
````ad-flex
<div>


**<span style="font-size: 10px; color: “#888888 ”;">`=this.角色编号`</span></font>**
**<span style="font-size: 20px; color: “#888888">▪ `=this.name` <span style="font-size: 10px;">`=this.othername` **
`=this.ethnicity`  `=this.time`

**<span style="font-size: 12px; color: “#888888 ”;"> 📅`=this.birthday`</span></font><span style="font-size: 12px; color: “#888888 ”;"> -`=this.deathday`</span></font>**

**<span style="font-size: 14px; color: “#888888 ”;">性  别 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.gender)`</span></font>_**
**<span style="font-size: 14px; color: “#888888 ”;">种  族 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.ethnicity)`</span></font>_**
**<span style="font-size: 14px; color: “#888888 ”;">职  业 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.职业)`</span></font>_**
**<span style="font-size: 14px; color: “#888888 ”;">所属国 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.所属国)`</span></font>_**
**<span style="font-size: 14px; color: “#888888 ”;">家  人 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.family)`</span></font>_**
**<span style="font-size: 14px; color: “#888888 ”;">爱  人 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.lover)`</span></font>_**
**<span style="font-size: 14px; color: “#888888 ”;">特  性 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.特点)`</span></font>_**
**<span style="font-size: 14px; color: “#888888 ”;">爱  好 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.爱好)`</span></font>_**


</div>

<div>
<br>

```dataviewjs
dv.el("div", `<img src="${dv.current().photo}" >`);
```


</div>



````
<br>

````ad-flex
<div>

**<span style="font-size: 16px; color: “#888888 ”;">备 注 </span></font>**
 _<span style="font-size: 14px; color: “#888888 ”;">`=(this.备注)` </span></font>_
 
**<span style="font-size: 16px; color: “#888888 ”;">简 介 </span></font>**

 _<span style="font-size: 14px; color: “#888888 ”;">`=(this.简介)` </span></font>_
 
 </div>
````
## 研究兴趣

---

## 相关事件

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

## 时间线

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
