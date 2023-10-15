// 文章路由函数文件

// 导入数据库文件
const { count } = require("console");
const db = require("../db/index");
const path = require("path");

// 文章信息获取模块
// 1.获取文章条数
exports.getArticles = (req, res) => {
  // 条数查询
  const countSql = `select count(*) as count from ev_articles as a left join ev_users as u on a.author_id=u.id where a.is_delete=0 and a.cate_id like('${req.query.cate_id}')`;
  // 返回文章条数
  let count = 0;
  db.query(countSql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    count = results;
    getArticlesinfo(req, res, count); // 调用文章信息获取函数
  });
};
// 2.获取文章信息(先查询条数再查询信息,防止异步)
function getArticlesinfo(req, res, count) {
  // 多表查询(左连接)
  // select 字段名 from 表1 left join 表2 on 连接条件 where 查询条件 order by 排序字段
  const sql = `select a.id,a.title,a.content,a.cover_img,a.pub_date,a.cate_id,a.author_id,u.nickname,u.user_pic from ev_articles as a left join ev_users as u on a.author_id=u.id where a.is_delete=0 and a.cate_id like('${
    req.query.cate_id
  }') order by a.id ${req.query.order} limit ${
    (req.query.page - 1) * req.query.per_page
  },${req.query.per_page}`;
  // 返回文章信息
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "获取文章列表成功",
      count: count,
      data: results,
    });
  });
}

// 根据用户ID获取文章函数模块
// 1.获取文章条数
exports.getArticlesById = (req, res) => {
  // 条数查询
  const countSql = `select count(*) as count from ev_articles where is_delete=0 and author_id = ${req.query.uid} and cate_id like('${req.query.cate_id}')`;
  // 返回文章条数
  let count = 0;
  db.query(countSql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    count = results;
    getById(req, res, count); // 调用文章信息获取函数
  });
};
// 2.获取文章信息(先查询条数再查询信息,防止异步)
function getById(req, res, count) {
  const sql = `SELECT * FROM ev_articles where is_delete=0 and author_id = ${
    req.query.uid
  }  and cate_id like('${req.query.cate_id}') order by id desc limit ${
    (req.query.page - 1) * req.query.per_page
  },${req.query.per_page}`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "获取文章列表成功",
      count: count,
      data: results,
    });
  });
}

// 文章删除模块
exports.removeArticle = (req, res) => {
  const sql = `update ev_articles set is_delete=1 where id=${req.params.delId}`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "删除文章成功",
    });
  });
};

// 文章发布模块
// 1.文章封面回显函数
exports.coverArticle = (req, res) => {
  res.send(req.file);
};
// 2.发布文章函数
exports.addArticle = (req, res) => {
  // 定义文章信息对象
  const articleInfo = {
    title: req.body.title, // 文章标题
    content: req.body.content, // 文章内容
    cate_id: req.body.cate_id, // 文章分区ID
    author_id: req.auth.id, // 文章作者的ID
    cover_img: path.join("/public/image", req.body.cover_img), // 文章封面
    pub_date: new Date(), // 文章发布时间
  };
  const sql = `insert into ev_articles set ?`;
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.affectedRows !== 1) {
      return res.send({ status: 1, message: "文章发布失败" });
    }
    // 发布文章成功
    res.send({ status: 0, message: "文章发布成功" });
  });
};

// 文章编辑模块
// 1.根据文章ID获取文章信息函数(编辑回显)
exports.articleView = (req, res) => {
  const sql = `select  a.id,a.title,a.content,a.cover_img,a.pub_date,a.cate_id,a.author_id,u.nickname,u.user_pic from ev_articles as a left join ev_users as u on a.author_id=u.id where a.id=${req.params.artId}`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "文章获取成功",
      data: results,
    });
  });
};
// 2.文章编辑保存函数
exports.articleUpdate = (req, res) => {
  // 取出封面文件名 注意 \\\\为一个反斜线
  const cover_img =
    "\\\\public\\\\image\\\\" + `${path.basename(req.body.cover_img)}`;
  // 定义sql语句
  const sql = `update ev_articles set title='${req.body.title}',cate_id=${req.body.cate_id},content='${req.body.content}',cover_img='${cover_img}' where id=${req.params.artId}`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.affectedRows !== 1) {
      return res.send({ status: 1, message: "文章编辑失败" });
    }
    res.send({ status: 0, message: "文章编辑成功", data: req.body });
  });
};

// 数目统计模块
// 1.根据文章ID查询点赞数函数
exports.getPraiseCount = (req, res) => {
  const sql = `select count(*) as count from ev_praise where aid=${req.params.aid};`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "文章点赞数查询成功",
      data: results,
    });
  });
};
// 2.根据文章ID查询收藏数函数
exports.getCollectCount = (req, res) => {
  const sql = `select count(*) as count from ev_collect where aid=${req.params.aid};`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "文章收藏数查询成功",
      data: results,
    });
  });
};

// 文章评论模块
// 1.获取文章评论函数
exports.getComment = (req, res) => {
  const sql = `select c.id,c.uid,c.aid,c.content,c.pub_date,u.nickname,u.user_pic 
  from ev_comment as c left join ev_users as u on c.uid=u.id where c.aid=${req.params.aid} and c.is_delete=0 order by c.pub_date desc`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "评论获取成功",
      data: results,
    });
  });
};
// 2.发布文章评论函数
exports.pubComment = (req, res) => {
  const sql = `insert into ev_comment(uid,aid,content,pub_date) values(${req.body.uid},${req.body.aid},'${req.body.content}','${req.body.date}');`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    if (results.affectedRows !== 1) {
      return res.send({ status: 1, message: "评论发布失败" });
    }
    res.send({
      status: 0,
      message: "评论发布成功",
      data: results,
    });
  });
};
// 3.删除文章评论函数(伪删除)
exports.delComment = (req, res) => {
  const sql = `update ev_comment set is_delete=1 where id = ${req.body.commentID} and uid=${req.body.uid};`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    if (results.affectedRows !== 1) {
      return res.send({ status: 1, message: "评论删除失败" });
    }
    res.send({
      status: 0,
      message: "评论删除成功",
      data: results,
    });
  });
};
