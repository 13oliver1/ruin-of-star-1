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
简介: "**&emsp;&emsp;刚诞生的时候有着中性化的外貌，后期越来越男性化，变成肌肉狂魔\r

  &emsp;&emsp;他是弟弟，匠神是哥哥\r

  &emsp;&emsp;这个神情绪稳定，最多会对邪神污秽表现出厌恶，最开始的时候就是哥哥下达命令，弟弟四处杀戮收集材料。\r

  &emsp;&emsp;他很少喊累，就算崩溃也是流着泪在杀人。为了孵化诸神，用自身的血液填满血池的时候也是他在不停的放血，对正常状态的他来说，为了达成目的一切都可以付出**"
备注: 光，古，生命之神
职业: 光，古，生命之神
特点: 白发，宇宙手臂
爱好: 战斗狂
权柄: 一切的古老和光辉之物
tags: oc
banner:
banner_icon:name: 2026-04-07
following_date: 2026-04-07
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
**<span style="font-size: 14px; color: “#888888 ”;">权 柄 | </span></font>_<span style="font-size: 14px; color: “#888888 ”;">`=(this.权柄)`</span></font>_**

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

## 时间线
````col
```col-md
flexGrow=0.2
===
**<font color="#5f497a">0000年</font>**
**<font color="#5f497a">0000年</font>**
**<font color="#5f497a">0000年</font>**
**<font color="#5f497a">0000年</font>**
```
```col-md
*<span style="font-size: 15px; color: “#888888 ”;">出生</span></font>*
*<span style="font-size: 15px; color: “#888888 ”;">四处游荡</span></font>*
*<span style="font-size: 15px; color: “#888888 ”;">和哥一起搞基建</span></font>*
*<span style="font-size: 15px; color: “#888888 ”;">出差中</span></font>*
```
````
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
