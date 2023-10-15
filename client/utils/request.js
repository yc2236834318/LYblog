// 全局配置文件

// 配置项目基地址
axios.defaults.baseURL = "http://127.0.0.1";

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 发起请求前上传用户的token令牌
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = token);
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    const result = response.data; // 优化服务器返回的信息体
    return result;
  },
  (err) => {
    // 身份验证失败
    if (err?.response?.status === 401) {
      alert("令牌无效,请重新登录");
      localStorage.clear(); // 清空本地缓存
      location.href = "login.html"; // 跳转到登录页
    }
    return Promise.reject(err);
  }
);
