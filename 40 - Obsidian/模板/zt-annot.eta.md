<%
// 从 paperbell 插件获取配置
let label = {};
let noteLabel = 'Note'; // 默认标签

try {
  const paperbellPlugin = app.plugins.plugins.paperbell;
  if (paperbellPlugin && paperbellPlugin.settings &&
      paperbellPlugin.settings.ZotLitColors &&
      paperbellPlugin.settings.ZotLitColors.mapping) {

    const colorMapping = paperbellPlugin.settings.ZotLitColors.mapping;

    // 将 mapping 对象转换成我们需要的格式 {colorName: label}
    Object.keys(colorMapping).forEach(color => {
      if (colorMapping[color] && colorMapping[color].callout) {
        label[color] = colorMapping[color].callout;
      }
    });
  }
} catch (e) {
  console.error("无法读取 paperbell 插件配置:", e);
}

// 如果读取失败，使用默认映射作为备份
if (Object.keys(label).length === 0) {
  label = {
    "red": "Conclusion",
    "orange": "Question",
    "yellow": "Highlight",
    "gray": "Comment",
    "green": "Quote",
    "cyan": "Task",
    "blue": "Definition",
    "navy": "Definition",
    "purple": "Question",
    "brown": "Source",
    "magenta": "To Do"
  };
}

// 获取当前注释的标签
noteLabel = label[it.colorName] ? label[it.colorName] : 'Note';
%>

[!<%= noteLabel %>] Page <%= it.pageLabel %>

<%= it.imgEmbed %><%= it.text %>
<% if (it.comment) { %>
---

<%= it.comment %>
<% } %>
