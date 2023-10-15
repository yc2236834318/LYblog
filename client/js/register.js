// 验证模块

// 1.用户名验证
const username = document.querySelector("[name=username]");
// (1)用户名验证函数
function verifyName() {
  const tips = username.nextElementSibling;
  const reg = /^[a-zA-Z0-9_]{6,12}$/; // 6-12位,包含数字大小写字母下划线
  if (!reg.test(username.value)) {
    tips.innerHTML = "*6-12位，包含数字、字母、下划线";
    tips.className = "tips error";
    return false;
  } else {
    tips.innerHTML = "*格式正确";
    tips.className = "tips correct";
    return true;
  }
}
// (2)验证判断
username.addEventListener("change", verifyName);

// 2.密码验证
const password = document.querySelector("[name=password]");
// (1)密码强度函数
function getLevel(value) {
  let level = 0;
  if (/[0-9]/.test(value)) {
    level++; // 是否有数字
  }
  if (/[a-zA-Z]/.test(value)) {
    level++; // 是否有字母
  }
  if (/[^0-9a-zA-Z]/.test(value)) {
    level++; // 是否有符号
  }
  return level;
}
// (2)密码验证函数
function verifyPsw() {
  const strength = document.querySelector(".strength");
  const tips = password.nextElementSibling;
  const reg = /^[a-zA-Z0-9_]{6,16}$/; // 6-16位,包含数字、字母、下划线
  if (!reg.test(password.value)) {
    strength.style.display = "none"; // 验证不通过就隐藏密码强度框
    tips.innerHTML = "*6-16位，包含数字、字母、下划线";
    tips.className = "tips error";
    return false;
  } else {
    tips.innerHTML = "";
    // 密码强度判断
    strength.style.display = "block"; // 验证通过就显示密码强度框
    for (let i = 0; i < strength.children.length; i++) {
      // 隐藏所有强度框
      strength.children[i].style.display = "none";
    }
    // 调用密码强度函数
    switch (getLevel(password.value)) {
      // 显示相应的强度框
      case 3:
        strength.children[0].style.display = "block";
        break;
      case 2:
        strength.children[1].style.display = "block";
        break;
      case 1:
        strength.children[2].style.display = "block";
        break;
    }
    return true;
  }
}
// (3)验证判断
password.addEventListener("change", verifyPsw);

// 3.重复密码验证
const psw = document.querySelector("[name=psw]");
// (1)重复密码验证函数
function pswFun() {
  const tips = psw.nextElementSibling;
  if (password.value !== psw.value) {
    tips.innerHTML = "*两次密码不相同";
    tips.className = "tips error";
    return false;
  } else {
    tips.innerHTML = "";
    return true;
  }
}
// (2)验证判断
psw.addEventListener("change", pswFun);
// (3)当第一次的密码更改时同时验证重复密码
password.addEventListener("change", pswFun);

// 4.提交模块
const form = document.querySelector("#reg");
const cbox = document.querySelector(".protocol .cbox");
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 阻止提交
  // (1)表单是否验证通过
  if (verifyName() && verifyPsw() && pswFun()) {
    // 表单验证通过
    if (!cbox.checked) {
      // (2)是否勾选协议
      // 没有勾选
      myAlert("请勾选同意协议");
      e.preventDefault(); // 阻止提交
      cbox.checked = true;
    } else {
      // 勾选协议
      // 获取表单数据
      const unameValue = username.value;
      const pwdValue = password.value;
      // 发起Ajax请求
      const result = await axios({
        method: "POST",
        url: "http://127.0.0.1/api/reguser",
        data: {
          username: unameValue,
          password: pwdValue,
        },
      });
      if (result.data.status !== 0) return myAlert(result.data.message);
      myAlert(result.data.message);
      form.reset(); // 重置表单
      setTimeout(() => {
        location.href = "login.html"; // 跳转到登录页
      }, 2000);
    }
  } else {
    // 表单验证未通过
    myAlert("数据不正确,请重新填写");
  }
});
