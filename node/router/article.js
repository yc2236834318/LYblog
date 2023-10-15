// 文章路由接口文件

const express = require("express");
const path = require("path");
const router = express.Router(); // 路由对象

// 导入文章分类路由函数文件
const article_handler = require("../router_handler/article");
// 导入数据验证模块
const expressJoi = require("@escook/express-joi");
// 导入验证规则对象(schema/article)
const { add_article_schema } = require("../schema/article");

// 文件上传
// 1.导入multer模块
const multer = require("multer");
// 2.配置文件名和存放路径
const storage = multer.diskStorage({
  // 路径设置
  destination: function (req, file, cb) {
    cb(null, "public/image");
  },
  // 文件名设置(防止重名):上传时间戳+文件扩展名
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// 3.实例化multer对象
const upload = multer({ storage: storage }).single("cover_img");
// .single("文件名"):支持一次上传一个文件
// 注意 该处的文件名要与客户端请求提交的文件名一致

// 获取文章接口
router.get("/articles", article_handler.getArticles);

// 根据用户ID获取文章接口
router.get("/articles/id", article_handler.getArticlesById);

// 根据文章ID获取文章接口
router.get("/artId/:artId", article_handler.articleView);

// 删除文章接口
router.delete("/delete/:delId", article_handler.removeArticle);

// 文章封面回显接口(挂载multer对象)
router.post("/upload", upload, article_handler.coverArticle);

// 发布文章接口(有数据验证)
router.post("/add", expressJoi(add_article_schema), article_handler.addArticle);

// 编辑文章接口(有数据验证)
router.put(
  "/update/:artId",
  expressJoi(add_article_schema),
  article_handler.articleUpdate
);

// 根据文章ID查询点赞数接口
router.get("/praiseCount/:aid", article_handler.getPraiseCount);

// 根据文章ID查询收藏数接口
router.get("/collectCount/:aid", article_handler.getCollectCount);

// 获取文章评论接口
router.get("/comment/get/:aid", article_handler.getComment);

// 发布文章评论接口
router.post("/comment/publish", article_handler.pubComment);

// 删除文章评论接口(伪删除)
router.post("/comment/del", article_handler.delComment);

// 导出路由对象
module.exports = router;
