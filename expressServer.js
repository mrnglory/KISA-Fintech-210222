const express = require('express');
const app = express();
const path = require('path');
const request = require('request');

// json 타입의 데이터 전송을 허용
app.use(express.json());
// form 타입의 데이터 전송을 허용
app.use(express.urlencoded({ extended: false }));
// to use static asset
app.use(express.static(path.join(__dirname, 'public')));

// 뷰 파일이 있는 디렉토리를 설정
app.set('views', __dirname + '/views');
// 뷰 엔진으로 ejs 사용
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/signup', function(req, res) {
    res.render('signup');
})

app.get('/authResult', function(req, res) {
    var authCode = req.query.code;
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        header : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        form : {
            code : authCode,
            client_id : "49dfaaa3-c984-40fe-890d-88ce7020f5aa",
            client_secret : "b6d0da1d-d9cb-47f2-b8c5-00676eab9209",
            redirect_uri : "http://localhost:3000/authResult",
            grant_type : "authorization_code"
        }
    }

    request(option, function(err, response, body){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            var accessRequestResult = JSON.parse(body);
            console.log(accessRequestResult);
            res.render('resultChild', {data : accessRequestResult});
        }
    })
})

app.post('/signup', function(req, res) {
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var userAccessToken = req.body.userAccessToken;
    var userRefreshToken = req.body.userRefreshToken;
    var userSeqNo = req.body.userSeqNo;

    console.log(userName, userEmail, userPassword, userAccessToken);
    var sql = "INSERT INTO user (name, email, password, accesstoken, refreshtoken, userseqno) VALUES (?,?,?,?,?,?)";
    connection.query(sql,[userName, userEmail, userPassword, userAccessToken, userRefreshToken, userSeqNo], function (err, result) {
        if(err){
            console.error(err);
            throw err;
        }
        else {
            res.json(1);
        }
    });

})

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'p446851',
    database : 'kisa-fintech210222',
    port     : '3307'
});
connection.connect();

app.listen(3000);