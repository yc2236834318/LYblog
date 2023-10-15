// 用户信息路由函数文件

// 导入数据库文件
const db = require("../db/index");

// 导入密码加密模块
const bcrypt = require("bcryptjs");

// 获取用户信息函数
exports.getUserInfo = (req, res) => {
  // 定义查询语句(排除密码)
  const sql = "select id,username,nickname,user_pic from ev_users where id=?";
  db.query(sql, req.auth.id, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.length !== 1) {
      return res.send({ status: 1, message: "未查询到用户信息" });
    }
    res.send({
      status: 0,
      message: "获取用户信息成功",
      data: results[0],
    });
  });
};

// 根据ID获取用户信息函数
exports.getUserInfoById = (req, res) => {
  // 定义查询语句(排除密码)
  const sql = "select id,username,nickname,user_pic from ev_users where id=?";
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.length !== 1) {
      return res.send({ status: 1, message: "未查询到用户信息" });
    }
    res.send({
      status: 0,
      message: "获取用户信息成功",
      data: results[0],
    });
  });
};

// 修改用户昵称函数
exports.updateUserInfo = (req, res) => {
  const sql = `update ev_users set nickname='${req.body.nickname}' where id=${req.auth.id}`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.affectedRows !== 1) {
      return res.send({ status: 1, message: "修改信息失败" });
    }
    res.send({ status: 0, message: "修改信息成功" });
  });
};

// 修改用户密码函数
exports.updatePassword = (req, res) => {
  const sql = "select * from ev_users where id=?";
  db.query(sql, req.auth.id, (err, results) => {
    // 查询数据库用户信息
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    // 判断用户是否存在
    if (results.length !== 1) {
      return res.send({ status: 1, message: "用户不存在" });
    }
    // 判断用户输入的旧密码是否正确
    const compare = bcrypt.compareSync(req.body.oldPsw, results[0].password);
    if (!compare) return res.send({ status: 1, message: "原密码错误" });
    // 修改用户密码
    const sql = "update ev_users set password=? where id=?";
    const newPsw = bcrypt.hashSync(req.body.newPsw, 10); // 加密新密码
    db.query(sql, [newPsw, req.auth.id], (err, results) => {
      if (err) return res.send({ status: 1, message: "数据库操作失败" });
      if (results.affectedRows !== 1) {
        return res.send({ status: 1, message: "修改密码失败" });
      }
      res.send({ status: 0, message: "修改密码成功" });
    });
  });
};

// 用户头像回显函数
exports.updateAvatarView = (req, res) => {
  res.send(req.file);
};

// 修改用户头像函数
exports.updateAvatar = (req, res) => {
  // 取出头像路径 注意 \\\\为一个反斜线
  const user_pic = "\\\\public\\\\avatar\\\\" + req.body.avatar;
  const sql = `update ev_users set user_pic='${user_pic}' where id=?`;
  db.query(sql, req.auth.id, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    if (results.affectedRows !== 1) {
      return res.send({ status: 1, message: "修改头像失败" });
    }
    res.send({ status: 0, message: "修改头像成功" });
  });
};
