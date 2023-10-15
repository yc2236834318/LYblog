// 文章分类数据验证文件

// 导入数据验证模块
const joi = require("joi");

// 定义文章分类的验证规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();
const id = joi.number().integer().min(1).required();

// 导出文章分类的规则对象
exports.add_cate_schema = {
  body: {
    name: name,
    alias: alias,
  },
};

// 导出根据ID删除文章分类规则对象
exports.delete_cate_schema = {
  params: {
    id: id,
  },
};

// 导出根据ID获取文章分类规则对象
exports.get_cate_schema = {
  params: {
    id: id,
  },
};

// 导出根据ID修改文章分类规则对象
exports.update_cate_schema = {
  body: {
    id: id,
    name: name,
    alias: alias,
  },
};
