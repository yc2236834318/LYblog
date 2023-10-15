// 令牌验证文件

const token = localStorage.getItem("token");
// 未登录时
if (!token) {
  alert("请先登录");
  location.href = "login.html"; // 跳转到登录页
}
// 成功登录
// 渲染首页用户信息栏中的用户信息
axios({
  method: "GET",
  url: "my/userinfo",
}).then((res) => {
  // console.log(res);
  const nickname = res.data.nickname || "游客"; // 昵称
  const user_id = res.data.id; // 用户ID
  let user_pic = ""; // 头像
  if (res.data.user_pic) {
    user_pic = "../node" + res.data.user_pic;
  } else {
    user_pic = "../node/public/upload/face.png";
  }
  // 信息渲染
  document.querySelector(".nickname").innerHTML = nickname;
  document.querySelector(".nickname").dataset.id = user_id;
  document.querySelector(".face img").src = user_pic;
});
