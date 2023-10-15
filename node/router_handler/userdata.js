// 用户数据路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 查询关注用户函数
exports.selFollow = (req, res) => {
  const sql = `select count(*) as count from ev_follow where uid=${req.auth.id} and fid=${req.params.authorID}`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "关注查询成功",
      data: results,
    });
  });
};

// 查询点赞文章函数
exports.selPraise = (req, res) => {
  const sql = `select count(*) as count from ev_praise where uid=${req.auth.id} and aid=${req.params.articleID}`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "点赞查询成功",
      data: results,
    });
  });
};

// 查询收藏文章函数
exports.selCollect = (req, res) => {
  const sql = `select count(*) as count from ev_collect where uid=${req.auth.id} and aid=${req.params.articleID}`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "收藏查询成功",
      data: results,
    });
  });
};

// 修改关注用户函数
exports.updateFollow = (req, res) => {
  if (req.auth.id == req.body.id) return res.send({ status: 1 }); // 不能关注自己
  if (req.body.code === "0") {
    // 关注
    const sql = `insert into ev_follow(uid,fid) values(${req.auth.id},${req.body.id})`;
    updateStatus(sql);
  } else {
    // 取消关注
    const sql = `delete from ev_follow where uid=${req.auth.id} and fid=${req.body.id}`;
    updateStatus(sql);
  }
  function updateStatus(sql) {
    db.query(sql, (err, results) => {
      if (err) return res.send({ status: 1, message: "数据库操作失败", err });
      if (results.affectedRows !== 1) {
        return res.send({ status: 1, message: "操作失败" });
      }
      res.send({
        status: 0,
        message: "操作成功",
      });
    });
  }
};

// 修改点赞文章函数
exports.updatePraise = (req, res) => {
  if (req.body.code === "0") {
    // 点赞
    const sql = `insert into ev_praise(uid,aid) values(${req.auth.id},${req.body.id})`;
    updateStatus(sql);
  } else {
    // 取消点赞
    const sql = `delete from ev_praise where uid=${req.auth.id} and aid=${req.body.id}`;
    updateStatus(sql);
  }
  function updateStatus(sql) {
    db.query(sql, (err, results) => {
      if (err) return res.send({ status: 1, message: "数据库操作失败", err });
      if (results.affectedRows !== 1) {
        return res.send({ status: 1, message: "操作失败" });
      }
      res.send({
        status: 0,
        message: "操作成功",
      });
    });
  }
};

// 修改收藏文章函数
exports.updateCollect = (req, res) => {
  if (req.body.code === "0") {
    // 收藏
    const sql = `insert into ev_collect(uid,aid) values(${req.auth.id},${req.body.id})`;
    updateStatus(sql);
  } else {
    // 取消收藏
    const sql = `delete from ev_collect where uid=${req.auth.id} and aid=${req.body.id}`;
    updateStatus(sql);
  }
  function updateStatus(sql) {
    db.query(sql, (err, results) => {
      if (err) return res.send({ status: 1, message: "数据库操作失败", err });
      if (results.affectedRows !== 1) {
        return res.send({ status: 1, message: "操作失败" });
      }
      res.send({
        status: 0,
        message: "操作成功",
      });
    });
  }
};

// 获取关注用户函数
exports.getFollow = (req, res) => {
  const sql = `select distinct u.id,u.user_pic,u.nickname  from ev_follow as f left join ev_users as u on f.fid=u.id where f.uid=${req.auth.id} order by u.id desc;`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "关注获取成功",
      data: results,
    });
  });
};

// 获取收藏文章函数
exports.getCollect = (req, res) => {
  const sql = `select a.cover_img,a.pub_date,u.nickname,a.id,u.user_pic,a.cate_id,a.title from ev_collect as c left join ev_articles as a on c.aid=a.id left join ev_users as u on a.author_id=u.id where c.uid=${req.auth.id} and a.is_delete=0 order by c.id desc;`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "收藏获取成功",
      data: results,
    });
  });
};
