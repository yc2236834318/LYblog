// 文章分类路由接口文件

const express = require("express");
const router = express.Router(); // 路由对象

// 导入文章分类路由函数文件
const artcate_handler = require("../router_handler/artcate");
// 导入数据验证模块
const expressJoi = require("@escook/express-joi");
// 导入验证规则对象(schema/user)
const { add_cate_schema } = require("../schema/artcate");
const { delete_cate_schema } = require("../schema/artcate");
const { get_cate_schema } = require("../schema/artcate");
const { update_cate_schema } = require("../schema/artcate");

// 获取文章分类接口
router.get("/cates", artcate_handler.getArticleCates);

// 新增文章分类接口(有数据验证)
router.post(
  "/addcates",
  expressJoi(add_cate_schema),
  artcate_handler.addArticleCates
);

// 根据ID删除文章分类接口(有数据验证)
router.get(
  "/deletecate/:id",
  expressJoi(delete_cate_schema),
  artcate_handler.deleteCateById
);

// 根据ID获取文章分类接口(有数据验证)
router.get(
  "/cates/:id",
  expressJoi(get_cate_schema),
  artcate_handler.getArtCateById
);

// 根据ID修改文章分类接口(有数据验证)
router.post(
  "/updatecate",
  expressJoi(update_cate_schema),
  artcate_handler.updateCateById
);

// 导出路由对象
module.exports = router;
