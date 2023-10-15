// 发布页文件

// 用户信息栏交互
const user = document.querySelector(".right");
const panel = document.querySelector(".panel");
user.addEventListener("mouseenter", () => {
  panel.classList.add("show");
});
user.addEventListener("mouseleave", () => {
  panel.classList.remove("show");
});

// ----- 频道选择模块 -----
const select = document.querySelector(".form-select"); // 获取频道选择框
// 1.获取频道数据函数
async function setChannleList() {
  const result = await axios({
    method: "GET",
    url: "/my/article/cates",
  });
  // 2.渲染数据
  const htmlStr = result.data
    .map((item) => {
      return `<option value="${item.id}">${item.name}</option>`;
    })
    .join("");
  select.innerHTML =
    '<option value="" selected>请选择文章分区</option>' + htmlStr;
}
setChannleList();

// ----- 文章封面模块 -----
const file = document.querySelector("#form-file"); // 获取默认文件上传框
const place = document.querySelector(".place"); // 获取自定义文件上传框
const cover = document.querySelector(".cover"); // 获取图片显示框
let fileName = ""; // 文章封面图片名字
file.addEventListener("change", async (e) => {
  // 1.文件上传事件
  const img = e.target.files[0]; // 获取用户上传的图片
  const fd = new FormData(); // 获取表单内容
  fd.append("cover_img", img); // 注意 该处的变量名要与服务器接口的文件名一致(cover_img)
  // 2.上传图片请求
  const result = await axios({
    method: "POST",
    url: "/my/article/upload",
    data: fd,
  });
  // 3.图片回显
  fileName = result.filename;
  cover.src = "../node/public/image/" + fileName;
  cover.classList.add("show"); // 显示封面图片
  place.classList.add("hide"); // 隐藏自定义文件上传框
});
// 4.点击更换图片
cover.addEventListener("click", () => {
  file.click();
});

// ----- 文章发布模块 -----
const send = document.querySelector(".send"); // 获取发布按钮
const form = document.querySelector("#articleForm"); // 获取表单对象
send.addEventListener("click", async (e) => {
  if (e.target.innerHTML !== "发布") return; // 判断是发布还是修改
  // 1.获取表单信息(serialize插件)
  const data = serialize(form, { hash: true, empty: true });
  data.cover_img = fileName; // 将文章封面路径挂载到data对象中
  // 2.表单内容验证
  if (
    !data.cate_id ||
    data.content === "<p><br></p>" ||
    !data.title ||
    !data.cover_img
  ) {
    return myAlert("请填写完整信息");
  }
  // 3.文章发布请求
  const result = await axios({
    method: "POST",
    url: "/my/article/add",
    data: data,
  });
  // 4.文章发布完成
  myAlert(result.message);
  form.reset(); // 重置表单
  // 重置封面
  cover.src = "";
  cover.classList.remove("show"); // 隐藏封面图片
  place.classList.remove("hide"); // 显示自定义文件上传框
  editor.setHtml(""); // 清空富文本编辑器
  setTimeout(() => {
    location.href = "index.html"; // 跳转到首页
  }, 2000);
});

// ----- 文章编辑回显模块 -----
(function () {
  const paramsStr = location.search; // 获取首页传过来的文章ID
  const params = new URLSearchParams(paramsStr); // 地址参数处理函数(内置函数)
  params.forEach(async (value, key) => {
    // 判断是否接收到编辑文章的ID
    if (key === "id") {
      // 修改页面内容
      document.querySelector(".title").innerHTML = "修改文章";
      document.querySelector(".send").innerHTML = "修改";
      // 渲染需要修改的文章的内容
      try {
        // 1.请求文章内容
        const result = await axios({
          method: "GET",
          url: `/my/article/artId/${value}`,
        });
        // 2.选择需要渲染的数据
        const dataObj = {
          cate_id: result.data[0].cate_id, // 文章分区
          title: result.data[0].title, // 文章标题
          cover_img: result.data[0].cover_img, // 文章封面
          content: result.data[0].content, // 文章内容
          id: result.data[0].id, // 文章ID
        };
        // 3.数据渲染
        Object.keys(dataObj).forEach((key) => {
          // 遍历数据对象中的每一个属性
          if (key === "cover_img") {
            // (1)封面不能直接渲染,需要手动设置
            if (dataObj[key]) {
              // 有封面就渲染封面
              document.querySelector(".cover").src = `../node${dataObj[key]}`;
              document.querySelector(".cover").classList.add("show"); // 显示图片
              document.querySelector(".place").classList.add("hide"); // 隐藏文件框
            } else {
              // 无封面就渲染默认图片
              document.querySelector(".cover").src =
                "../node/public/upload/article";
              document.querySelector(".cover").classList.add("show"); // 显示图片
              document.querySelector(".place").classList.add("hide"); // 隐藏文件框
            }
          } else if (key === "content") {
            // (2)文章内容不能直接渲染,要手动渲染到富文本编辑器
            editor.setHtml(dataObj[key]);
          } else {
            // (3)渲染其他参数
            document.querySelector(`[name=${key}]`).value = dataObj[key];
          }
        });
      } catch (err) {
        // console.dir(err);
        alert("文章获取失败");
        location.href = "manage.html";
      }
    }
  });
})();

// ----- 文章编辑保存模块 -----
send.addEventListener("click", async (e) => {
  if (e.target.innerHTML !== "修改") return; // 判断是发布还是修改
  // 1.获取表单信息(serialize插件)
  const data = serialize(form, { hash: true, empty: true });
  // 2.表单内容验证
  if (
    !data.cate_id ||
    data.content === "<p><br></p>" ||
    !data.title ||
    !cover.src
  ) {
    return myAlert("请填写完整信息");
  }
  // 3.文章修改请求
  data.cover_img = cover.src; // 在表单信息上挂载封面地址
  const result = await axios({
    method: "PUT",
    url: `/my/article/update/${data.id}`,
    data: data,
  });
  // console.log(result);
  // 5.文章修改失败
  if (result.status !== 0) return myAlert(result.message);
  // 4.文章修改完成
  myAlert(result.message);
  form.reset(); // 重置表单
  // 重置封面
  cover.src = "";
  cover.classList.remove("show"); // 隐藏封面图片
  place.classList.remove("hide"); // 显示自定义文件上传框
  editor.setHtml(""); // 清空富文本编辑器
  setTimeout(() => {
    location.href = "manage.html"; // 跳转到管理页
  }, 2000);
});

// ----- 退出登录模块 -----
const exit = document.querySelector(".exit");
exit.addEventListener("click", () => {
  // 1.清空本地保存的令牌
  localStorage.removeItem("token");
  // 2.跳转到登录页
  myAlert("退出成功");
  setTimeout(() => {
    location.href = "login.html"; // 跳转到登录页
  }, 1000);
});
