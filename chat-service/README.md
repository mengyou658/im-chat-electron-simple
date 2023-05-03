# 后台服务端

# 依赖
1. mysql8版本
2. nodejs 16版本以上

## 修改配置
1. 修改mysql配置
```js

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "chatim"
})


```
2. 启动服务
```cmd
node app.js 
```
3. 
