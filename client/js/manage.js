// 管理页文件

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

// ----- 用户信息栏交互模块 -----
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
  select.innerHTML = '<option value="%" selected>全部分区</option>' + htmlStr;
}
setChannleList();

// ----- 文章获取模块 -----

// 1.文章查询参数配置(即下方文章渲染函数的参数)
const queryObj = {
  uid: 0, // 用户ID
  cate_id: "%", // 文章分区ID %表示所有分区
  page: 1, // 当前页码
  per_page: 2, // 每页显示的条数
};

// 2.文章获取函数
const articleList = document.querySelector(".article-list");
const pagination = document.querySelector(".pagination");
const total = pagination.querySelector(".total");
const now = pagination.querySelector(".now");
const articleFun = async () => {
  // (1)获取用户ID
  const userinfo = await axios({
    method: "GET",
    url: "my/userinfo",
  });
  queryObj.uid = userinfo.data.id; // 同步用户ID
  // (2)获取该用户的文章信息
  const result = await axios({
    method: "GET",
    url: "/my/article/articles/id",
    params: queryObj,
  });
  // console.log(result);
  // (3)渲染数据
  const htmlStr = result.data
    .map((item) => {
      // console.log(item);
      return `<tr data-id="${item.id}">
      <td>
        <a href="javascript:;" class="img-box">
          <img src="../node/${item.cover_img}" alt="" />
        </a>
      </td>
      <td><p><a href="javascript:;" class="artTitle">${item.title}</a></p></td>
      <td><span class="artPlate ${styleArr[item.cate_id - 1]}">${
        plateArr[item.cate_id - 1]
      }</span></td>
      <td>
        <span>${item.pub_date.substring(0, 19)}</span>
      </td>
      <td data-id="${item.id}">
        <a href="javascript:;" class="edit">编辑</a>
        <a href="javascript:;" class="del">删除</a>
      </td>
    </tr>`;
    })
    .join("");
  articleList.innerHTML = htmlStr;
  // (4)渲染页码
  const count = result.count[0].count;
  const pages = Math.ceil(count / 2);
  if (pages > 1) {
    pagination.style.display = "block"; // 若页码>1则显示分页器
  } else {
    pagination.style.display = "none"; // 否则就隐藏分页器
  }
  now.querySelector("span").innerHTML = queryObj.page; // 当前页码
  total.querySelector("span").innerHTML = pages; // 总共页码
  // (5)若没有相关文章
  if (result.data.length < 1) {
    articleList.innerHTML = `<tr class="empty"><td>没 有 相 关 文 章</td></tr>`;
  }
};

// 3.渲染默认文章
articleFun(); // 无需修改参数,直接调用文章获取函数

// 4.渲染分区文章
select.addEventListener("change", (e) => {
  // 分区状态变化时,更新查询参数
  queryObj.cate_id = e.target.value;
  queryObj.page = 1;
  // 重新渲染数据
  articleFun();
});

// 5.渲染翻页文章
const last = document.querySelector(".last");
const next = document.querySelector(".next");
let flag = true; // 节流阀
// 下一页
next.addEventListener("click", () => {
  // (1)判断页码数
  if (queryObj.page >= total.querySelector("span").innerHTML) return;
  // (2)判断节流阀
  if (!flag) return myAlert("操作频繁");
  // (3) 数据刷新
  flag = false; // 关闭节流阀
  queryObj.page++; // 更新页码参数
  articleFun(); // 重新渲染数据
  setTimeout(() => {
    flag = true; // 0.5s后打开节流阀
  }, 500);
});
// 2.上一页
last.addEventListener("click", () => {
  // (1)判断页码数
  if (queryObj.page <= 1) return;
  // (2)判断节流阀
  if (!flag) return myAlert("操作频繁");
  // (3) 数据刷新
  flag = false; // 关闭节流阀
  queryObj.page--; // 更新页码参数
  articleFun(); // 重新渲染数据
  setTimeout(() => {
    flag = true; // 0.5s后打开节流阀
  }, 500);
});

// ----- 文章查看模块 -----
articleList.addEventListener("click", async (e) => {
  // 1.判断是否点击封面或标题(事件委托)
  if (e.target.nodeName === "IMG" || e.target.className === "artTitle") {
    // 2.跳转到文章页并传入参数
    const artId = e.target.parentNode.parentNode.parentNode.dataset.id;
    window.open(`article.html?id=${artId}`, "_blank");
  }
});

// ----- 文章删除模块 -----
articleList.addEventListener("click", async (e) => {
  // 1.判断是否点击删除按钮(事件委托)
  if (e.target.classList.contains("del")) {
    if (!confirm("是否删除文章")) return;
    // 2.获取被删除文章的ID
    const delId = e.target.parentNode.dataset.id;
    // 3.发起删除请求
    const result = await axios({
      method: "DELETE",
      url: `/my/article/delete/${delId}`,
    });
    // 4.重新渲染数据
    queryObj.page = 1;
    articleFun();
    myAlert("删除成功");
  }
});

// ----- 文章编辑模块 -----
articleList.addEventListener("click", async (e) => {
  // 1.判断是否点击编辑按钮(事件委托)
  if (e.target.classList.contains("edit")) {
    // 2.获取被编辑文章的ID
    const artId = e.target.parentNode.dataset.id;
    location.href = `publish.html?id=${artId}`; // 跳转到发布页并传入ID参数
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
    location.href = "login.html";
  }, 1000);
});
