// 数据交互模块

const form = document.querySelector("#log");
const username = form.querySelector("[name=username]");
const password = form.querySelector("[name=password]");
const cbox = form.querySelector(".cbox");

// 记住账号
if (localStorage.getItem("uname")) {
  // 判断本地是否存有账号,如果有就赋值,并且自动选中复选框
  username.value = localStorage.getItem("uname");
  cbox.checked = true;
}

// 登录请求
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 阻止提交
  // 获取表单信息(serialize插件)
  const data = serialize(form, { hash: true, empty: true });
  if (!data.username || !data.password) return myAlert("请填写完整数据");
  // 发起Ajax请求
  const result = await axios({
    method: "POST",
    url: "http://127.0.0.1/api/login",
    data: {
      username: data.username,
      password: data.password,
    },
  });
  // 登录失败
  if (result.data.status === 1) return myAlert(result.data.message);
  // 登录成功
  myAlert("登录成功");
  localStorage.setItem("token", result.data.token); // 保存登录令牌
  // 判断是否记住账号
  if (cbox.checked) {
    // 如果选中就将账号存进浏览器
    localStorage.setItem("uname", username.value);
  } else {
    // 如果没有选中就删除账号
    localStorage.removeItem("uname");
  }
  username.value = "";
  password.value = "";
  setTimeout(() => {
    location.href = "index.html"; // 跳转到首页
  }, 2000);
});

// 网页交互模块

// 眼睛图标切换
const eye = document.querySelector(".eye");
const psw = document.querySelector('[name="password"]');
let flag = true;
eye.addEventListener("click", () => {
  if (flag) {
    eye.innerHTML = "&#xe634;";
    psw.type = "text";
    flag = false;
  } else {
    eye.innerHTML = "&#xe633;";
    psw.type = "password";
    flag = true;
  }
});
