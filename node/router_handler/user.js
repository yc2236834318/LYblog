// 登录注册路由函数文件

// 导入数据库文件
const db = require("../db/index");
// 导入令牌模块
const jwt = require("jsonwebtoken");
// 导入全局配置
const config = require("../config");
// 导入密码加密模块(安装命令 npm i bcryptjs@2.4.3)
const bcrypt = require("bcryptjs");

// 注册函数
exports.regUser = (req, res) => {
  const userinfo = req.body; // 获取客户端提交的信息
  // (1)验证账号是否已存在
  const sqlStr = "select * from ev_users where username=?";
  db.query(sqlStr, userinfo.username, (err, results) => {
    // 查询数据库中该账号是否存在
    if (err) {
      return res.send({ status: 1, message: "数据库链接失败 ", err });
    }
    if (results.length > 0) {
      // 查询结果长度不为0则表示账号已存在
      return res.send({ status: 1, message: "注册失败,账号已存在" });
    }
    // (2)将用户密码加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    // (3)新建用户
    const sql = "insert into ev_users set ?";
    const nickname = "用户" + Date.now();
    db.query(
      sql,
      {
        username: userinfo.username,
        password: userinfo.password,
        nickname: nickname,
      },
      (err, results) => {
        if (err) return res.send({ status: 1, message: "数据库操作失败", err });
        if (results.affectedRows !== 1) {
          // 新建用户失败
          return res.send({ status: 1, message: "用户注册失败" });
        }
        res.send({ status: 0, message: "注册成功" });
      }
    );
  });
};

// 登录函数
exports.login = (req, res) => {
  const userinfo = req.body; // 获取用户提交信息
  const sql = "select * from ev_users where username=?";
  // (1)验证用户信息
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败" });
    if (results.length !== 1) {
      // 查询账号结果不为1
      return res.send({ status: 1, message: "账号不存在" });
    }
    // 判断密码是否正确
    // 格式 bcrypt.compareSync(用户提交的密码, 数据库加密过的密码)
    // 匹配为true,不匹配为false
    const compare = bcrypt.compareSync(userinfo.password, results[0].password);
    if (!compare) return res.send({ status: 1, message: "账号或密码错误" });
    // (2)登录成功后生成token令牌
    // 获取用户信息并将密码和头像等隐私信息置空
    const user = { ...results[0], password: "", user_pic: "" };
    // 生成加密令牌
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn, // 令牌有效期
    });
    // 响应令牌
    res.send({
      status: 0,
      message: "登录成功",
      token: "Bearer " + tokenStr,
    });
  });
};

// 搜索模块
// 1.搜索用户
exports.userSearch = (req, res) => {
  const sql = `select id,nickname,user_pic from ev_users where nickname like('%${req.body.value}%');`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "用户搜索成功",
      data: results,
    });
  });
};
// 2.搜索文章
exports.artSearch = (req, res) => {
  const sql = `select a.id,a.title,a.cover_img,a.pub_date,a.cate_id,u.nickname,u.user_pic from ev_articles as a left join ev_users as u on a.author_id=u.id where title like('%${req.body.value}%') and is_delete=0;`;
  db.query(sql, (err, results) => {
    if (err) return res.send({ status: 1, message: "数据库操作失败", err });
    res.send({
      status: 0,
      message: "文章搜索成功",
      data: results,
    });
  });
};
