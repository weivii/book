const express= require("express")
const bodyParser = require("body-parser")
const mysql =require("mysql")
const moment = require("moment")
const app = express()
// 连接数据库
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'blog'
  });

  app.use(bodyParser.urlencoded({ extended: false }))
// 静态资源托管
app.use("/node_modules",express.static("./node_modules"))

// 设置模板引擎
app.set("view engine","ejs")
// 
app.set("views","./views")

app.get("/",(req,res)=>{
    res.render("index.ejs",{})
})

app.get("/register",(req,res)=>{
    res.render("./user/register",{})
})
// 注册
app.post("/register",(req,res)=>{
    // 服务器解析通过post请求传递过来的数据
    const userInfo = req.body
    // 验证
    if(!userInfo.username||!userInfo.password||!userInfo.nickname) return res.status(400).send({status:400,msg:"注册失败，填写完整信息"})
    // 查重
    connection.query('select count(*) as count from users where username =?',userInfo.username,  (err, results)=> {
        if(err) return res.status(500).send({status:500,msg:"注册失败，请重试"})
        console.log("results")
        if(results[0].count!==0) return res.send({status:400,msg:"用户名重复，请重试"})
        // if(err) return res.status.send({staus:400,msg:"注册失败，请重试"})

        userInfo.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
       const registerMysql = "insert into users set ?"
       connection.query(registerMysql,userInfo,(err,result)=>{
          if(err) return res.status(500).send({status:500,msg:"注册失败，请重试"})
          res.send({status:200,msg:"注册成功"})
       })
    })    
})

app.get("/login",(req,res)=>{
    res.render("./user/login",{})
})
app.post("/login",(req,res)=>{
    const loginMysql = "select*from user where usernme = ? and password = ?"
    connection.query(loginMysql,[req.body.username,req.body.password],(err,result)=>{
        if(err) return res.status(400).send({status:400,msg:"登录失败，请重试"})
        res.send({status:200,msg:"登录成功"})
     })
})
app.listen(8080,()=>{
    console.log("http://127.0.0.1:8080")
})