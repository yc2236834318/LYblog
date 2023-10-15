// 服务器文件

const express = require("express");
const cors = require("cors");
const app = express();
// 调用内置中间件用于识别body中的请求体数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 导入数据验证模块
const joi = require("joi");
// 创建静态资源服务器
app.use("/public", express.static("./public"));

// cors跨域
app.use(
  cors({
    origin: "*", // 允许跨域的域名
    methods: ["GET", "POST", "HEAD", "DELETE", "PUT"], // 允许跨域的方式
  })
);

// 令牌解析配置
const { expressjwt } = require("express-jwt");
const config = require("./config");
app.use(
  expressjwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [
      // path 无需解析令牌的接口(游客可访问,但不解析就没有req.auth)
      /^\/api/,
      /\/my\/article\/cates/,
      /^\/my\/article\/articles/,
      /\/my\/article\/artId/,
      /\/my\/article\/praiseCount/,
      /\/my\/article\/collectCount/,
      /\/my\/article\/comment\/get/,
      /\/my\/userinfo\/id/,
    ],
  })
);

// 导入登录注册路由模块
const userRouter = require("./router/user");
// 注册为全局模块并加上访问前缀:api
app.use("/api", userRouter);

// 导入用户信息路由模块
const userinfoRouter = require("./router/userinfo");
// 注册为全局模块并加上访问前缀:my
app.use("/my", userinfoRouter);

// 导入文章分类路由模块
const artCateRouter = require("./router/artcate");
// 注册为全局模块并加上访问前缀:my/article
app.use("/my/article", artCateRouter);

// 导入文章路由模块
const articleRouter = require("./router/article");
// 注册为全局模块并加上访问前缀:my/article
app.use("/my/article", articleRouter);

// 导入用户数据路由模块
const userDataRouter = require("./router/userdata");
// 注册为全局模块并加上访问前缀:my/data
app.use("/my/data", userDataRouter);

// 定义错误级中间件,捕获项目错误
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) {
    // 数据验证不通过
    return res.send({ status: 1, message: "数据验证失败 " + err.message });
  }
  if (err.name === "UnauthorizedError") {
    // 无效的令牌
    return res.send({ status: 401, message: "无效的token,请重新登录" });
  }
  res.send({ status: 1, message: "未知的错误 ", err });
});

app.listen(80, () => {
  console.log("服务器启动成功 127.0.0.1");
});
