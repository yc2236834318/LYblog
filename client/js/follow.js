// 关注页文件

// ----- 数据交互模块 -----

// 获取关注用户信息
const followList = document.querySelector(".follow-list");
async function getFollow() {
  const result = await axios({
    method: "GET",
    url: "/my/data/getFollow",
  });
  const htmlStr = result.data
    .map((item) => {
      return `<li data-id="${item.id}">
    <a href="javascript:;">
      <div class="face-img">
        <img src="../node/${
          item.user_pic || "/public/upload/face.png"
        }" alt="" />
      </div>
      <div><div class="author-name">${item.nickname}</div></div>
      <button class="followBtn btn" data-code="1">已关注</button>
    </a>
  </li>`;
    })
    .join("");
  followList.innerHTML = htmlStr;
  // 若没有关注的用户
  if (result.data.length === 0) {
    document.querySelector(".tip").style.display = "block"; // 显示提示信息
  } else {
    // 若有关注的用户
    document.querySelector(".tip").style.display = "none"; // 隐藏提示信息
  }
}
getFollow();

// 用户操作
let flag = true; // 节流阀
followList.addEventListener("click", async (e) => {
  // 1.关注/取消关注
  if (e.target.classList.contains("followBtn")) {
    // 判断节流阀
    if (!flag) return myAlert("操作频繁,请稍等");
    flag = false; // 通过节流阀后关闭节流阀
    setTimeout(() => {
      flag = true; // 2秒后打开节流阀
    }, 2000);
    // 发起请求
    const code = e.target.dataset.code;
    const authorID = e.target.parentNode.parentNode.dataset.id;
    const result = await axios({
      method: "POST",
      url: "/my/data/update/follow",
      data: { id: authorID, code: code },
    });
    if (result.status !== 0) return myAlert("操作失败");
    if (code === "1") {
      e.target.classList.add("cancel");
      e.target.dataset.code = "0";
      e.target.innerHTML = "关注";
      myAlert("取消关注");
    } else if (code === "0") {
      e.target.classList.remove("cancel");
      e.target.dataset.code = "1";
      e.target.innerHTML = "已关注";
      myAlert("关注成功");
    }
  }
  // 2.跳转到关注的用户信息页
  if (e.target.nodeName === "IMG" || e.target.nodeName === "DIV") {
    const authorID = e.target.parentNode.parentNode.parentNode.dataset.id;
    location.href = `author.html?id=${authorID}`;
  }
});

// 退出登录
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

// ----- 网页交互模块 -----

// 用户信息栏交互
const user = document.querySelector(".right");
const panel = document.querySelector(".panel");
user.addEventListener("mouseenter", () => {
  panel.classList.add("show");
});
user.addEventListener("mouseleave", () => {
  panel.classList.remove("show");
});
