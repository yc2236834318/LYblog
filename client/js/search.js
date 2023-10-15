// 搜索页文件

// ----- 数据交互模块 -----

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

// 判断登录状态
const token = localStorage.getItem("token");
const uinfo = document.querySelector(".right");
const none = document.querySelector(".none");
if (token) {
  // 登录时
  uinfo.style.display = "flex";
  none.style.display = "none";
  // 渲染首页用户信息栏中的用户信息
  axios({
    method: "GET",
    url: "my/userinfo",
  }).then((res) => {
    const nickname = res.data.nickname || "游客"; // 昵称
    const user_id = res.data.id; // 用户ID
    let user_pic = ""; // 头像
    if (res.data.user_pic) {
      user_pic = "../node" + res.data.user_pic;
    } else {
      user_pic = "../node/public/upload/face.png";
    }
    document.querySelector(".nickname").innerHTML = nickname;
    document.querySelector(".nickname").dataset.id = user_id;
    document.querySelector(".face img").src = user_pic;
  });
} else {
  // 未登录时
  uinfo.style.display = "none";
  none.style.display = "block";
}

// 用户信息渲染函数
async function userRender(value) {
  const result = await axios({
    method: "POST",
    url: "api/search/user",
    data: { value: value },
  });
  if (result.status !== 0) return myAlert("用户搜索失败");
  const empty = document.querySelector(".author-empty");
  if (result.data.length < 1) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }
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
    </a>
  </li>`;
    })
    .join("");
  authorList.innerHTML = htmlStr;
}

// 文章信息渲染函数
async function artRender(value) {
  const result = await axios({
    method: "POST",
    url: "api/search/articles",
    data: { value: value },
  });
  if (result.status !== 0) return myAlert("文章搜索失败");
  const empty = document.querySelector(".article-empty");
  if (result.data.length < 1) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }
  const htmlStr = result.data
    .map((item) => {
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
}

// 搜索信息获取
const searchBtn = document.querySelector(".searchBtn");
const searchInput = document.querySelector(".search input");
const authorList = document.querySelector(".author-list");
const articleList = document.querySelector(".article-list");
(function () {
  const paramsStr = location.search; // 获取首页传过来的文章ID
  const params = new URLSearchParams(paramsStr); // 地址参数处理函数(内置函数)
  if (params.size < 1) return; // 判断是否接收到搜索数据
  params.forEach((value, key) => {
    if (key === "value") {
      searchInput.value = value;
      userRender(value); // 搜索相关用户
      artRender(value); // 搜索相关文章
    }
  });
})();

// 搜索功能
let flag = true; // 节流阀
searchBtn.addEventListener("click", () => {
  const value = searchInput.value.trim().substring(0, 10);
  if (value.length < 1) return myAlert("请输入关键字");
  // 判断节流阀
  if (!flag) return myAlert("操作频繁,请稍等");
  flag = false; // 通过节流阀后关闭节流阀
  setTimeout(() => {
    flag = true; // 2秒后打开节流阀
  }, 2000);
  userRender(value); // 搜索相关用户
  artRender(value); // 搜索相关文章
  myAlert("搜索完成");
});

// 退出登录
const exit = document.querySelector(".exit");
exit.addEventListener("click", () => {
  // 1.清空本地保存的令牌
  localStorage.removeItem("token");
  // 2.跳转到登录页
  myAlert("退出成功");
  setTimeout(() => {
    location.href = "login.html";
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
    window.open(`article.html?id=${eve.dataset.id}`, "_blank");
  }
});

// 用户点击跳转
authorList.addEventListener("click", (e) => {
  // 2.跳转到关注的用户信息页
  if (e.target.nodeName === "IMG" || e.target.nodeName === "DIV") {
    const authorID = e.target.parentNode.parentNode.parentNode.dataset.id;
    window.open(`author.html?id=${authorID}`, "_blank");
  }
});
