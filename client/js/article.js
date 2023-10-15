// 文章页文件

// ----- 数据交互模块 -----

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

const nickname = document.querySelector(".nickname");
const follow = document.querySelector(".follow");
const praise = document.querySelector(".praise");
const collect = document.querySelector(".collect");
const praiseNum = document.querySelector(".praiseNum");
const collectNum = document.querySelector(".collectNum");
const info = document.querySelector(".info");
const face = document.querySelector(".author_pic img");
const author = document.querySelector(".author");
const title = document.querySelector(".title");
const cover = document.querySelector(".cover img");
const content = document.querySelector(".content");
const time = document.querySelector(".time i");
const commentList = document.querySelector(".comment-list");
const commentFace = document.querySelector(".comment-face img");
const commentName = document.querySelector(".comment-name");
const commentContent = document.querySelector(".comment-content");
const commentTime = document.querySelector(".comment-time");
const commentUserFace = document.querySelector(".user_face img");
const commentUserName = document.querySelector(".user_name");
const commentText = document.querySelector('[name="comment"]');
let articleID = 0; // 文章ID
let authorID = 0; // 文章作者ID

// 文章点赞收藏数渲染函数
async function getNum(id) {
  // 1.获取文章点赞数
  const pNumResult = await axios({
    method: "GET",
    url: `/my/article/praiseCount/${id}`,
  });
  const pNum = pNumResult.data[0].count;
  praiseNum.innerHTML = `(${pNum})`;
  // 2.获取文章收藏数
  const cNumResult = await axios({
    method: "GET",
    url: `/my/article/collectCount/${id}`,
  });
  const cNum = cNumResult.data[0].count;
  collectNum.innerHTML = `(${cNum})`;
}

// 文章状态判断函数
async function artStatus(type, id) {
  if (!token) return; // 未登录就return
  const result = await axios({
    method: "GET",
    url: `/my/data/sel${type}/${id}`,
  });
  if (result.status !== 0) return;
  if (result.data[0].count < 1) return;
  artStatusRender(type, true);
}

// 文章状态修改函数
let flag = true; // 节流阀
async function artStatusUpdate(type, code, id) {
  // 0.登录判断
  if (!token) {
    alert("请先登录");
    location.href = "login.html"; // 跳转到登录页
    return;
  }
  // 1.节流阀判断
  if (!flag) return myAlert("操作频繁,请稍等");
  flag = false; // 通过节流阀后就关闭节流阀
  setTimeout(() => {
    flag = true; // 2秒后打开节流阀
  }, 2000);
  // 2.状态修改
  const result = await axios({
    method: "POST",
    url: `/my/data/update/${type}`,
    data: { id: id, code: code },
  });
  if (result.status !== 0) return myAlert("操作失败");
  myAlert("操作成功");
  // 3.重新渲染文章状态
  if (code === "0") return artStatusRender(type, true);
  if (code === "1") return artStatusRender(type, false);
}

// 文章状态渲染函数
function artStatusRender(type, flag) {
  if (type === "follow") {
    if (flag) {
      follow.innerHTML = "已关注";
      follow.classList.add("followActive");
      follow.dataset.code = 1;
    } else {
      follow.innerHTML = "关注";
      follow.classList.remove("followActive");
      follow.dataset.code = 0;
    }
  }
  if (type === "praise") {
    if (flag) {
      praise.innerHTML = "&#xe83b;";
      praise.nextElementSibling.innerHTML = "已赞";
      praise.dataset.code = 1;
      getNum(articleID); // 同步点赞数
    } else {
      praise.innerHTML = "&#xe83e;";
      praise.nextElementSibling.innerHTML = "点赞";
      praise.dataset.code = 0;
      getNum(articleID); // 同步点赞数
    }
  }
  if (type === "collect") {
    if (flag) {
      collect.innerHTML = "&#xe839;";
      collect.nextElementSibling.innerHTML = "已收藏";
      collect.dataset.code = 1;
      getNum(articleID); // 同步收藏数
    } else {
      collect.innerHTML = "&#xe83a;";
      collect.nextElementSibling.innerHTML = "收藏";
      collect.dataset.code = 0;
      getNum(articleID); // 同步收藏数
    }
  }
}

// 文章评论渲染函数
async function commentRender(aid) {
  const commentData = await axios({
    method: "GET",
    url: `/my/article/comment/get/${aid}`,
  });
  // console.log(commentData);
  if (commentData.status !== 0) return myAlert("评论获取失败");
  if (commentData.data.length < 1) {
    return (commentList.innerHTML = `<li>
    <div class="empty">还 没 有 评 论</div>
  </li>`);
  }
  const htmlStr = commentData.data
    .map((item) => {
      return `<li data-uid="${item.uid}">
        <div class="comment-face faceStyle">
          <img src="../node/${
            item.user_pic || "/public/upload/face.png"
          }" alt="" />
        </div>
        <div class="comment-name nameStyle">${item.nickname}</div>
        <div class="comment-content">${item.content}</div>
        <div class="comment-del" data-id="${item.id}">删除</div>
        <div class="comment-time">${item.pub_date}</div>
      </li>`;
    })
    .join("");
  commentList.innerHTML = htmlStr;
  // 判断每个评论是否是自己发送的
  commentList.querySelectorAll("li").forEach((item) => {
    if (item.dataset.uid === nickname.dataset.id) {
      item.children[3].style.display = "block";
    }
  });
}

// 文章评论发布函数
async function commentPub(uid, aid, content) {
  if (!token) {
    // 登录判断
    alert("请先登录");
    location.href = "login.html"; // 跳转到登录页
    return;
  }
  const result = await axios({
    method: "POST",
    url: "/my/article/comment/publish",
    data: {
      uid: uid,
      aid: aid,
      content: content,
      date: new Date().toLocaleString(),
    },
  });
  // console.log(result);
  if (result.status !== 0) return myAlert("评论发布失败");
  myAlert("评论发布成功");
  commentText.value = ""; // 清空用户评论框
  commentRender(aid); // 重新渲染评论
}

// 文章评论删除函数
async function commentDel(commentID, uid, aid) {
  if (!token) return; // 未登录就return
  const result = await axios({
    method: "POST",
    url: "/my/article/comment/del",
    data: {
      commentID: commentID,
      uid: uid,
    },
  });
  // console.log(result);
  if (result.status !== 0) return myAlert("评论删除失败");
  myAlert("评论删除成功");
  commentRender(aid); // 重新渲染评论
}

// 文章信息获取
(function () {
  const paramsStr = location.search; // 获取地址栏传过来的文章ID
  const params = new URLSearchParams(paramsStr); // 地址参数处理函数(内置函数)
  if (params.size < 1) return myAlert("文章获取失败"); // 判断是否接收到文章的ID
  params.forEach(async (value, key) => {
    if (key === "id") {
      try {
        // 1.获取文章信息
        const result = await axios({
          method: "GET",
          url: `/my/article/artId/${value}`,
        });
        face.src = "../node/" + result.data[0].user_pic;
        author.innerHTML = result.data[0].nickname;
        title.innerHTML = result.data[0].title;
        cover.src = "../node/" + result.data[0].cover_img;
        content.innerHTML = result.data[0].content;
        time.innerHTML = result.data[0].pub_date.substring(0, 10);
        info.dataset.author_id = result.data[0].author_id; // 作者ID
        info.dataset.artice_id = result.data[0].id; // 文章ID
        authorID = info.dataset.author_id; // 获取文章作者ID
        articleID = info.dataset.artice_id; // 获取文章ID
        // 2.获取文章状态
        artStatus("follow", authorID); // 判断关注状态
        artStatus("praise", articleID); // 判断点赞状态
        artStatus("collect", articleID); // 判断收藏状态
        // 3.获取点赞收藏数
        getNum(articleID);
        // 4.获取文章评论
        commentRender(articleID);
        // 5.渲染发布评论栏的用户信息
        if (!token) return; // 没登录就return
        const userinfo = await axios({
          method: "GET",
          url: "my/userinfo",
        });
        if (userinfo.data.user_pic) {
          commentUserFace.src = "../node/" + userinfo.data.user_pic;
        } else {
          commentUserFace.src = "../node/public/upload/face.png";
        }
        commentUserName.innerHTML = userinfo.data.nickname;
      } catch (err) {
        // console.dir(err);
        return myAlert("文章获取失败", err);
      }
    }
  });
})();

// 文章状态修改
// 1.关注
follow.addEventListener("click", () => {
  if (nickname.dataset.id === authorID) return myAlert("不能关注自己");
  artStatusUpdate("follow", follow.dataset.code, authorID);
});
// 2.点赞
praise.addEventListener("click", () => {
  artStatusUpdate("praise", praise.dataset.code, articleID);
});
// 3.收藏
collect.addEventListener("click", () => {
  artStatusUpdate("collect", collect.dataset.code, articleID);
});

// 文章评论发布
const send = document.querySelector(".send");
send.addEventListener("click", () => {
  const uid = nickname.dataset.id;
  const aid = info.dataset.artice_id;
  const content = commentText.value.trim();
  if (!content) return myAlert("输入内容不能为空");
  commentPub(uid, aid, content); // 执行评论发布函数
});

// 文章评论删除
commentList.addEventListener("click", (e) => {
  if (e.target.classList.contains("comment-del")) {
    if (!confirm("是否删除评论")) return;
    if (e.target.classList.contains("comment-del")) {
      commentDel(e.target.dataset.id, nickname.dataset.id, articleID); // 评论删除函数
    }
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

// 作者页面跳转
info.addEventListener("click", async (e) => {
  const authorID = info.dataset.author_id;
  if (e.target.nodeName === "IMG" || e.target.classList.contains("author")) {
    location.href = `author.html?id=${authorID}`;
  }
});
// 评论页面跳转
commentList.addEventListener("click", (e) => {
  if (e.target.nodeName === "IMG") {
    location.href = `author.html?id=${e.target.parentNode.parentNode.dataset.uid}`;
  }
  if (e.target.classList.contains("comment-name")) {
    location.href = `author.html?id=${e.target.parentNode.dataset.uid}`;
  }
});
