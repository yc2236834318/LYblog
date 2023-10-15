// 弹窗文件

// 提示弹窗
function myAlert(msg) {
  // 判断是否已有一个弹窗框
  const alert = document.querySelector(".alertShow");
  // 如果已有一个弹窗,就隐藏已有的弹窗,弹出新的弹窗
  if (alert) alert.className = "alert alertHide";
  // 出现
  const myAlert = document.createElement("div");
  const body = document.querySelector("body");
  body.appendChild(myAlert);
  myAlert.className = "alert alertShow"; // 淡入
  myAlert.innerHTML = msg;
  // 消失
  setTimeout(
    () => {
      myAlert.className = "alert alertHide"; // 淡出
    },
    2000,
    setTimeout(() => {
      body.removeChild(myAlert); // 移除
    }, 2500)
  );
}
