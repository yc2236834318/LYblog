// 用户页文件

// ----- 用户信息栏交互模块 -----
const user = document.querySelector(".right");
const panel = document.querySelector(".panel");
user.addEventListener("mouseenter", () => {
  panel.classList.add("show");
});
user.addEventListener("mouseleave", () => {
  panel.classList.remove("show");
});

// ----- 用户信息渲染模块 -----
const face = document.querySelector(".img-box img");
const nick = document.querySelector(".userinfo .nickname");
axios({
  method: "GET",
  url: "my/userinfo",
}).then((res) => {
  // console.log(res);
  const nickname = res.data.nickname || "游客"; // 昵称
  let user_pic = ""; // 头像
  if (res.data.user_pic) {
    user_pic = "../node" + res.data.user_pic;
  } else {
    user_pic = "../node/public/upload/face.png";
  }
  // 信息渲染
  nick.innerHTML = nickname;
  face.src = user_pic;
});

// ----- 信息修改模块 -----
const update = document.querySelector(".update-list");
const boxs = document.querySelectorAll("#userinfo .box");
const form = document.querySelector("#userinfo");
update.addEventListener("click", (e) => {
  // 点击信息修改选项
  if (e.target.nodeName === "LI") {
    boxs.forEach((item) => {
      item.classList.remove("show"); // 隐藏所有的修改框
    });
    if (e.target.dataset.index === "4") return (location.href = "manage.html");
    if (e.target.dataset.index === "5") return (location.href = "collect.html");
    if (e.target.dataset.index === "6") return (location.href = "follow.html");
    boxs[e.target.dataset.index - 1].classList.add("show");
  }
});

// 1.修改昵称
const nickBtn = document.querySelector(".nickBtn");
nickBtn.addEventListener("click", async () => {
  // 获取昵称
  const data = document.querySelector('[name="nickname"]').value;
  // 昵称验证
  if (data.length < 2 || data.length > 12) {
    return (document.querySelector(".nicktip").style.display = "block");
  }
  // 发起请求
  const result = await axios({
    method: "POST",
    url: "/my/nickname",
    data: { nickname: data },
  });
  myAlert(result.message);
  // 修改成功就刷新页面
  if (result.status === 0) {
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
});

// 2.修改密码
const pswBtn = document.querySelector(".pswBtn");
pswBtn.addEventListener("click", async () => {
  // 获取密码
  const oldpsw = document.querySelector('[name="oldpsw"]').value;
  const newpsw = document.querySelector('[name="newpsw"]').value;
  // 密码验证
  if (
    oldpsw.length < 6 ||
    oldpsw.length > 12 ||
    newpsw.length < 6 ||
    newpsw.length > 12
  ) {
    document.querySelector(".pswtip").innerHTML = "*密码长度为6-12位字符";
    return (document.querySelector(".pswtip").style.display = "block");
  }
  if (oldpsw === newpsw) {
    document.querySelector(".pswtip").innerHTML = "*新旧密码不能相同";
    return (document.querySelector(".pswtip").style.display = "block");
  }
  // 发起请求
  const result = await axios({
    method: "POST",
    url: "/my/updatepwd",
    data: { oldPsw: oldpsw, newPsw: newpsw },
  });
  myAlert(result.message);
  // 修改成功退出登录
  if (result.status === 0) {
    localStorage.removeItem("token"); // 清空本地保存的令牌
    setTimeout(() => {
      location.href = "login.html"; // 跳转到登录页
    }, 2000);
  }
});

// 3.修改头像(头像回显)
const file = document.querySelector("#form-file"); // 获取默认文件上传框
const place = document.querySelector(".place"); // 获取自定义文件上传框
const cover = document.querySelector(".cover"); // 获取图片显示框
let fileName = ""; // 文章封面图片名字
file.addEventListener("change", async (e) => {
  // (1)文件上传事件
  const img = e.target.files[0]; // 获取用户上传的图片
  const fd = new FormData(); // 获取表单内容
  fd.append("user_pic", img); // 注意 该处的变量名要与服务器接口的文件名一致(user_pic)
  // (2)上传图片请求
  const result = await axios({
    method: "POST",
    url: "/my/update/avatarView",
    data: fd,
  });
  // (3)图片回显
  fileName = result.filename;
  cover.src = "../node/public/avatar/" + fileName;
  cover.classList.add("show"); // 显示封面图片
  place.classList.add("hide"); // 隐藏自定义文件上传框
});
// (4)点击更换图片
cover.addEventListener("click", () => {
  file.click();
});

// 4.修改头像(头像保存)
const faceBtn = document.querySelector(".faceBtn");
faceBtn.addEventListener("click", async () => {
  // 判断用户有没有上传图片
  if (!fileName) return myAlert("请先上传图片");
  // 发起请求
  const result = await axios({
    method: "POST",
    url: "/my/update",
    data: { avatar: fileName },
  });
  // console.log(result);
  myAlert(result.message);
  // 修改成功就刷新页面
  if (result.status === 0) {
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
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
