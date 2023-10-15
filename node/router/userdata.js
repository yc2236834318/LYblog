// 用户数据路由接口文件

const express = require("express");
const path = require("path");
const router = express.Router(); // 路由对象

// 导入用户信息路由函数文件
const userdata_handler = require("../router_handler/userdata");

// 查询关注接口
router.get("/selFollow/:authorID", userdata_handler.selFollow);

// 查询点赞接口
router.get("/selPraise/:articleID", userdata_handler.selPraise);

// 查询收藏接口
router.get("/selCollect/:articleID", userdata_handler.selCollect);

// 修改关注接口
router.post("/update/follow", userdata_handler.updateFollow);

// 修改点赞接口
router.post("/update/praise", userdata_handler.updatePraise);

// 修改点赞接口
router.post("/update/collect", userdata_handler.updateCollect);

// 获取关注接口
router.get("/getFollow", userdata_handler.getFollow);

// 获取收藏接口
router.get("/getCollect", userdata_handler.getCollect);

// 导入路由对象
module.exports = router;
