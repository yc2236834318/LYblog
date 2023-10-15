// 文章数据验证文件

// 导入数据验证模块
const joi = require("joi");

// 定义文章的验证规则
const title = joi.string().required();
const content = joi.string().required().allow("");
const cate_id = joi.number().integer().min(1).required();
const cover_img = joi.string().required();

// 导出发布文章的规则对象
exports.add_article_schema = {
  body: {
    title: title,
    cate_id: cate_id,
    content: content,
    cover_img: cover_img,
  },
};
