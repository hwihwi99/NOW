var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var crypto = require('crypto')
var mysql = require('mysql')
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    port : '3306',
    password : '1234',
    database : 'now'
})
connection.connect();

var nickname; 

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.listen(3000,function(){
    console.log('server start')
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/LandingPage.html"))
})

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/login.html"))
})

app.post('/login',(req,res)=>{
    nickname = req.body.login_nickname
    var inputpw = req.body.login_pw
    var query = connection.query('select * from now_user where nickname = ?',[nickname],(error,row)=>{
        if(error){
            throw error;
        }
        if(row[0]){
            // 등록된 아이디가 있다면
            var pwcheck = crypto.createHash("sha512").update(inputpw+row[0].salt).digest("hex")
        
            if(pwcheck == row[0].pw){
                res.redirect('/home')
            }else{
                // 비밀번호가 틀리다면
                res.send("<script>alert('비밀번호를 다시 확인해주세요');location.href='/login';</script>")
            }
        }
        else{
            // 등록된 아이디가 없다면
            res.send("<script>alert('등록된 아이디가 없습니다.');location.href='/login';</script>")
        }
    })
})

app.get('/home',(req,res)=>{
    res.render('home.ejs',{nickname:nickname})
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
    var salt = Math.round((new Date().valueOf()*Math.random()))+""
    var hashpw = crypto.createHash("sha512").update(pw+salt).digest("hex")

    // 아이디 중복 확인
    var query = connection.query('select * from now_user where nickname = ?',[nickname],(error,row)=>{
        if(error){
            throw error;
        }
        if(row[0]){
            // 아이디가 중복이라면
            res.send("<script>alert('중복된 닉네임 입니다. 다시 확인해주세요');location.href='/join';</script>")
        }else{
            // 아이디 중복이 아니면

            // 비밀번호가 같은지 확인
            if(pw == pwcheck){
                // 같으면 데이터 저장
                var query = connection.query('insert into now_user(email,nickname,user_name,pw,salt) values (?,?,?,?,?)',[email,nickname,name,hashpw,salt],(error,row)=>{
                    if(error){
                        throw error;
                    }
                    res.send("<script>alert('회원가입이 완료되었습니다.');location.href='/login';</script>")
                })
            }else{
                // 비밀번호가 다르면
                res.send("<script>alert('비밀번호를 다시 확인해주세요.');location.href='/join';</script>")
            }
        }
    })    
})

app.get('/board',(req,res)=>{
    connection.query('select * from now_board',(err,row)=>{
        res.render('board.ejs',{nickname:nickname, title:row})
    })
})

var board_title

app.get('/board/:title',(req,res)=>{
    console.log(board_title);
    connection.query('select * from now_post where board_title = ?',[board_title],(err,row)=>{
        res.render('post.ejs',{nickname:nickname,board_title:board_title,post:row})
    })
})

app.post('/board/:title',(req,res)=>{
    board_title = req.body.board_title;
    res.redirect('/board/:title');
})
// app.post('/board/search',(req,res)=>{

// })

app.get('/board/new',(req,res)=>{
    console.log(__dirname)
    res.sendFile(path.join(__dirname,"./public/newBoard.html"))
})

app.post('/board/new',(req,res)=>{
    var title = req.body.newBoard_title
    var detail = req.body.newBoard_detail

    connection.query('insert into now_board(title,detail) values (?,?)',[title,detail],(err,rows)=>{
        if(err){
            throw err;
        }
        res.redirect('/board');
    })
})

app.get('/post/new',(req,res)=>{
    
    res.sendFile(path.join(__dirname,"./public/newPost.html"))
})
