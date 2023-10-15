// 收藏页文件

// 分区名
const plateArr = [
  "新闻",
  "娱乐",
  "历史",
  "体育",
  "金融",
  "旅游",
  "影视",
  "美食",
];
// 分区样式
const styleArr = [
  "news",
  "game",
  "history",
  "sport",
  "finance",
  "tourism",
  "movie",
  "delicacy",
];

// ----- 数据交互 -----

// 用户信息渲染模块
const face = document.querySelector(".face-img img");
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

// 文章信息渲染
const articleList = document.querySelector(".article-list");
const articleFun = async () => {
  const result = await axios({
    method: "GET",
    url: "/my/data/getCollect",
  });
  // console.log(result);
  // 2.渲染数据
  const htmlStr = result.data
    .map((item) => {
      // console.log(item);
      return `<li data-id="${item.id}">
    <a href="javascript:;">
      <div class="img-box">
        <img src="../node/${item.cover_img}" alt="" />
      </div>
      <div class="content">
        <div class="title">${item.title}</div>
        <div class="details">
          <div class="face-box">
            <img src="../node/${
              item.user_pic || "/public/upload/face.png"
            }" alt="" />
          </div>
          <div class="author">${item.nickname}</div>
          <div class="tag ${styleArr[item.cate_id - 1]}">${
        plateArr[item.cate_id - 1]
      }</div>
        </div>
        <div class="time">${item.pub_date.substring(0, 10)}</div>
      </div>
    </a>
  </li>`;
    })
    .join("");
  articleList.innerHTML = htmlStr;
  // 若没有相关文章
  if (result.data.length === 0) {
    document.querySelector(".tip").style.display = "block"; // 显示提示信息
  } else {
    // 若有相关文章
    document.querySelector(".tip").style.display = "none"; // 隐藏提示信息
  }
};
articleFun();

// 退出登录模块
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

// ----- 网页交互 -----

// 用户信息栏交互模块
const user = document.querySelector(".right");
const panel = document.querySelector(".panel");
user.addEventListener("mouseenter", () => {
  panel.classList.add("show");
});
user.addEventListener("mouseleave", () => {
  panel.classList.remove("show");
});

// 文章交互
// 重点 渲染+委托+查找触发元素
// 1.由于文章是后面渲染的,所以只能采用事件委托来添加交互效果
// 2.通过监听父元素article-list来给子元素li添加交互效果
// 3.但由于li中还有其他子元素,导致li被自己的子元素遮盖,无法触发
// 4.所以要对触发的子元素进行判断是不是li,不是就查找它父元素是不是li(循环查找)
const cardList = document.querySelector(".article-list");
cardList.addEventListener("mouseover", (e) => {
  let eve = e.target; // 获取被触发的子元素
  // 循环判断被触发的子元素是不是li
  while (eve.nodeName !== "LI") {
    // 如果所有父元素都不是li则跳出循环,防止死循环
    if (eve.nodeName === e.currentTarget.nodeName) break; // e.currentTarget 冒泡对象
    eve = eve.parentNode; // 不是li就向上查找,直到找到就自动退出while循环
  }
  if (eve.nodeName === "LI") {
    // 找到li后就设置交互效果
    eve.querySelector("img").style.transform = "scale(1.1)"; // 图片缩放
    eve.classList.add("li-hover"); // 阴影
  }
});
cardList.addEventListener("mouseout", (e) => {
  let eve = e.target;
  while (eve.nodeName !== "LI") {
    if (eve.nodeName === e.currentTarget.nodeName) break;
    eve = eve.parentNode;
  }
  if (eve.nodeName === "LI") {
    eve.querySelector("img").style.transform = ""; // 图片缩放
    eve.classList.remove("li-hover"); // 阴影
  }
});

// 文章点击跳转
cardList.addEventListener("click", (e) => {
  let eve = e.target;
  while (eve.nodeName !== "LI") {
    if (eve.nodeName === e.currentTarget.nodeName) break;
    eve = eve.parentNode;
  }
  if (eve.nodeName === "LI") {
    // 跳转到文章页并传入文章ID
    location.href = `article.html?id=${eve.dataset.id}`;
  }
});
