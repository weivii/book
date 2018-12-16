const express=require("express")
const path = require("path")

const app=express()

app.get("/",(req,res)=>{
//    res.sendFile(path.join(__dirname,"/views/index.html"))
res.sendFile("/views/index.html",{root : __dirname})
})

app.listen(8080,()=>{
    console.log("http://127.0.0.1:8080")
})