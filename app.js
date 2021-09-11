var express = require('express')
var app = express()
var path = require('path')
const bodyParser = require('body-parser')
var mysql = require('mysql')
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    port : '3306',
    password : '1234',
    database : 'now'
})
connection.connect();

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
    var pw = req.body.join_pw
    var pwcheck = req.body.join_pwcheck
    var nickname = req.body.join_nickname
    var name = req.body.join_nickname

    connection.query('')
})