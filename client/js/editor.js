// 富文本编辑器配置文件

// 解构工具栏对象和编辑器对象
const { createEditor, createToolbar } = window.wangEditor;

// 编辑器配置函数
const editorConfig = {
  placeholder: "文章内容", // 提示文字
  onChange(editor) {
    // 内容改变函数
    const html = editor.getHtml(); // 获取内容
    const article = document.querySelector(".article");
    // 将获取到的内容同步到隐藏的文本域中,便于信息快速收集
    article.value = html;
  },
};

// 创建编辑器
const editor = createEditor({
  selector: "#editor-container",
  html: "<p><br></p>",
  config: editorConfig,
  mode: "default", // 编辑器模式
});

// 工具栏配置函数
const toolbarConfig = {};

// 创建工具栏
const toolbar = createToolbar({
  editor,
  selector: "#toolbar-container",
  config: toolbarConfig,
  mode: "default", // 工具栏模式
});
