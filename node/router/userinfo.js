// 用户信息路由接口文件

const express = require("express");
const path = require("path");
const router = express.Router(); // 路由对象

// 导入用户信息路由函数文件
const userinfo_handler = require("../router_handler/userinfo");

// 导入数据验证模块
const expressJoi = require("@escook/express-joi");
// 导入验证规则对象(schema/user)
const { update_nickname_schema } = require("../schema/user");
const { update_password_schema } = require("../schema/user");

// 文件上传
// 1.导入multer模块
const multer = require("multer");
// 2.配置文件名和存放路径
const storage = multer.diskStorage({
  // 路径设置
  destination: function (req, file, cb) {
    cb(null, "public/avatar");
  },
  // 文件名设置(防止重名):上传时间戳+文件扩展名
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// 3.实例化multer对象
const uploadAvatar = multer({ storage: storage }).single("user_pic");
// .single("文件名"):支持一次上传一个文件
// 注意 该处的文件名要与客户端请求提交的文件名一致

// 用户信息接口
router.get("/userinfo", userinfo_handler.getUserInfo);

// 根据ID查询用户信息接口
router.get("/userinfo/id", userinfo_handler.getUserInfoById);

// 修改用户昵称接口(有数据验证)
router.post(
  "/nickname",
  expressJoi(update_nickname_schema),
  userinfo_handler.updateUserInfo
);

// 修改用户密码接口(有数据验证)
router.post(
  "/updatepwd",
  expressJoi(update_password_schema),
  userinfo_handler.updatePassword
);

// 用户头像回显接口(挂载multer对象)
router.post(
  "/update/avatarView",
  uploadAvatar,
  userinfo_handler.updateAvatarView
);

// 修改用户头像接口
router.post("/update", userinfo_handler.updateAvatar);

// 导入路由对象
module.exports = router;
