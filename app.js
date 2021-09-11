var express = require('express')
var app = express()
var path = require('path')
const bodyParser = require('body-parser')
var mysql = require('mysql')
// mysql.createConnection(
    
// )

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000,function(){
    console.log('server start')
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/LandingPage.html"))
})

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/login.html"))
})

app.get('/join',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/join.html"))
})

app.post('/join',(req,res)=>{
    var email = req.body.join_email
})