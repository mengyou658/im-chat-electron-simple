const mysql = require("mysql")
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "chatim"
})

const serverPort = 9527

module.exports = {
  serverPort,
  emailConfig: { //邮箱配置
    host: "smtp.qq.com",//邮箱服务器  这里我用的QQ邮箱
    port: 465,//邮箱使用端口
    secure: true,//是否使用默认的465端口
    auth: {
      user: "111111@qq.com", // 发送方邮箱地址
      pass: "111111" // smtp 验证码
    }
  },
  newUserConfig: {
    Avatar: "./logo.png",
  },
  info: {
    sucess: function (data, message = '') {
      return {
        state: true,
        message,
        data
      }
    },
    error: function (message = '') {
      return {
        state: false,
        message
      }
    }
  },
  db: db,
  nowTime: function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate() >= 10 ? now.getDate() : ('0' + now.getDate());
    const hour = now.getHours() >= 10 ? now.getHours() : ('0' + now.getHours());
    const miu = now.getMinutes() >= 10 ? now.getMinutes() : ('0' + now.getMinutes());
    const sec = now.getSeconds() >= 10 ? now.getSeconds() : ('0' + now.getSeconds());
    return +year + "-" + (month + 1) + "-" + date + "- " + hour + ":" + miu + ":" + sec;
  }
}
