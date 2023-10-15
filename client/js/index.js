// 首页文件

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
    const nickname = res.data.nickname; // 昵称
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

// 分区渲染函数
const artcateList = document.querySelector(".artcate-list");
const artcateFun = async () => {
  // 1.获取分区
  const result = await axios({
    method: "GET",
    url: "/my/article/cates",
  });
  // 2.渲染数据
  const htmlStr = result.data
    .map((item, index) => {
      return `<li data-index="${index + 1}">
      <a href="javascript:;">${item.name}</a>
      </li>`;
    })
    .join("");
  artcateList.innerHTML =
    `<li data-index="%"><a href="javascript:;" class="li-active">全部</a></li>` +
    htmlStr;
};
artcateFun();

// 文章查询参数配置(即下方文章渲染函数的参数)
const queryObj = {
  cate_id: "%", // 文章分区ID %表示所有分区
  page: 1, // 当前页码
  per_page: 12, // 每页显示的条数
  order: "desc", // 排序方式
};

// 文章获取函数
const articleList = document.querySelector(".article-list");
const pagination = document.querySelector(".pagination");
const total = pagination.querySelector(".total");
const now = pagination.querySelector(".now");
const articleFun = async () => {
  // 1.获取全部文章信息
  const result = await axios({
    method: "GET",
    url: "/my/article/articles",
    params: queryObj,
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
  // 3.渲染页码
  const count = result.count[0].count;
  const pages = Math.ceil(count / 12);
  if (pages > 1) {
    pagination.style.display = "block"; // 若页码>1则显示分页器
  } else {
    pagination.style.display = "none"; // 否则就隐藏分页器
  }
  now.querySelector("span").innerHTML = queryObj.page; // 当前页码
  total.querySelector("span").innerHTML = pages; // 总共页码
  // 4.若没有相关文章
  if (result.data.length === 0) {
    document.querySelector(".tip").style.display = "block"; // 显示提示信息
    document.querySelector(".sort-list").style.display = "none"; // 隐藏排序框
  } else {
    // 若有相关文章
    document.querySelector(".tip").style.display = "none"; // 隐藏提示信息
    document.querySelector(".sort-list").style.display = "flex"; // 显示排序框
  }
  // 5.滚动页面到顶部
  window.scrollTo({ top: 0 });
};

// 首页默认文章渲染
articleFun(); // 无需修改参数,直接调用文章获取函数

// 分区文章渲染
artcateList.addEventListener("click", (e) => {
  if (e.target.nodeName !== "A") return;
  const panelId = e.target.parentNode.dataset.index; // 获取用户点击的分区的ID
  queryObj.cate_id = panelId; // 将分区ID同步到参数配置中
  queryObj.page = 1; // 跳到第一页
  articleFun(); // 渲染文章
});

// 排序文章渲染
const sort = document.querySelector(".sort-list");
sort.addEventListener("click", (e) => {
  if (e.target.nodeName === "LI") {
    // 切换效果
    sort.querySelectorAll("li").forEach((item) => {
      item.classList.remove("sort-active");
    });
    e.target.classList.add("sort-active");
    queryObj.order = e.target.dataset.order; // 同步排序方式
    queryObj.page = 1; // 跳到第一页
    articleFun(); // 渲染文章
  }
});

// 翻页文章渲染
const last = document.querySelector(".last");
const next = document.querySelector(".next");
// 上一页
last.addEventListener("click", () => {
  // 判断是不是第一页
  if (queryObj.page <= 1) return;
  queryObj.page--; // 页码-1
  articleFun(); // 渲染文章
});
// 下一页
next.addEventListener("click", () => {
  // 判断是不是最后一页
  if (queryObj.page >= total.querySelector("span").innerHTML) return;
  queryObj.page++; // 页码+1
  articleFun(); // 渲染文章
});

// 搜索功能
const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".searchBtn");
searchBtn.addEventListener("click", () => {
  const value = searchInput.value.trim().substring(0, 10);
  if (value.length < 1) return myAlert("请输入关键字");
  // 跳转到搜索页并提交用户搜索数据
  window.open(`search.html?value=${value}`, "_blank");
  searchInput.value = "";
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

// 导航栏交互
const navList = document.querySelector(".artcate-list");
navList.addEventListener("mouseover", (e) => {
  // 鼠标悬浮
  if (e.target.nodeName === "A") {
    e.target.style.backgroundColor = "#eee";
  }
});
navList.addEventListener("mouseout", (e) => {
  // 鼠标离开
  if (e.target.nodeName === "A") {
    e.target.style.backgroundColor = "";
  }
});
navList.addEventListener("click", (e) => {
  // 点击切换
  if (e.target.nodeName === "A") {
    navList.querySelectorAll("a").forEach((item) => {
      item.className = "";
    });
    e.target.className = "li-active";
  }
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
