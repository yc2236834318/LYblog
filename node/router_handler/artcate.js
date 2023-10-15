// 文章分类路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 获取文章分类函数
exports.getArticleCates = (req, res) => {
  const sql = "select * from ev_article_cate where is_delete=0 order by id asc";
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    res.send({
      status: 0,
      message: "获取文章分类列表成功",
      data: results,
    });
  });
};

// 新增文章分类函数
exports.addArticleCates = (req, res) => {
  // 判断文章分类名是否已存在
  const sql = "select * from ev_article_cate where name=? or alias=?";
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.length === 2) {
      return res.send({
        status: 1,
        message: "分类名称和分类别名已存在,请重新命名",
      });
    }
    if (results.length === 1 && results[0].name === req.body.name) {
      return res.send({ status: 1, message: "分类名称已存在,请重新命名" });
    }
    if (results.length === 1 && results[0].alias === req.body.alias) {
      return res.send({ status: 1, message: "分类别名已存在,请重新命名" });
    }
    // 新建文章分类
    const sqlStr = "insert into ev_article_cate set ?";
    db.query(sqlStr, req.body, (err, results) => {
      if (err) return res.send({ status: 1, message: "数据库操作失败" });
      if (results.affectedRows !== 1) {
        return res.send({ status: 1, message: "新建文章分类失败" });
      }
      res.send({ status: 0, message: "新建文章分类成功" });
    });
  });
};

// 删除文章分类函数(标记删除)
exports.deleteCateById = (req, res) => {
  const sql = "update ev_article_cate set is_delete=1 where id=?";
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.affectedRows !== 1) {
      return res.send({ status: 1, message: "删除文章分类失败" });
    }
    res.send({ status: 0, message: "删除文章分类成功" });
  });
};

// 根据ID获取文章分类函数
exports.getArtCateById = (req, res) => {
  const sql = "select * from ev_article_cate where id=?";
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.length !== 1) {
      return res.send({ status: 1, message: "获取文章分类失败" });
    }
    // 判断该文章类型是否标记删除
    if (results[0].is_delete === 1) {
      return res.send({ status: 1, message: "该文章分类已删除" });
    }
    res.send({
      status: 0,
      message: "获取文章分类成功",
      data: results[0],
    });
  });
};

// 根据ID修改文章分类函数
exports.updateCateById = (req, res) => {
  // 查询用户修改的分类名称和分类别名是否可用
  const sql =
    "select * from ev_article_cate where id!=? and (name=? or alias=?)";
  db.query(
    sql,
    [req.body.id, req.body.name, req.body.alias],
    (err, results) => {
      if (err) return res.send({ status: 1, message: "数据库操作失败" });
      if (results.length === 2) {
        return res.send({
          status: 1,
          message: "分类名称和分类别名已存在,请重新命名",
        });
      }
      if (results.length === 1 && results[0].name === req.body.name) {
        return res.send({ status: 1, message: "分类名称已存在,请重新命名" });
      }
      if (results.length === 1 && results[0].alias === req.body.alias) {
        return res.send({ status: 1, message: "分类别名已存在,请重新命名" });
      }
      // 修改文章分类
      const sqlStr = "update ev_article_cate set ? where id=?";
      db.query(sqlStr, [req.body, req.body.id], (err, results) => {
        if (err) return res.send({ status: 1, message: "数据库操作失败" });
        if (results.affectedRows !== 1) {
          return res.send({ status: 1, message: "修改文章分类失败" });
        }
        res.send({ status: 0, message: "修改文章分类成功" });
      });
    }
  );
};
