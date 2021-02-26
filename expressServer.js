const express = require('express');
const app = express();
const path = require('path');
const request = require('request');
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth');
var moment = require('moment')
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

var companyId = "M202111576U";

app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/signup', function(req, res) {
    res.render('signup');
})

app.get('/login', function(req, res) {
    res.render('login');
})

app.get('/main', function(req, res) {
    res.render('main');
})

app.get('/balance', function(req, res) {
    res.render('balance');
})

app.get('/qrcode', function(req, res) {
    res.render('qrcode');
})

app.get('/authTest', auth, function(req, res) {
    res.send("정상적으로 로그인 하셨다면 해당 화면이 보입니다.");
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

app.post('/login', function(req, res){
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    console.log(userEmail, userPassword)
    var sql = "SELECT * FROM user WHERE email = ?";
    connection.query(sql, [userEmail], function(err, result){
        if(err){
            console.error(err);
            res.json(0);
            throw err;
        }
        else {
            if(result.length == 0){
                res.json(3)
            }
            else {
                var dbPassword = result[0].password;
                if(dbPassword == userPassword){
                    var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
                    jwt.sign(
                        {
                            userId : result[0].id,
                            userEmail : result[0].email
                        },
                        tokenKey,
                        {
                            expiresIn : '10d',
                            issuer : 'fintech.admin',
                            subject : 'user.login.info'
                        },
                        function(err, token){
                            console.log('로그인 성공', token)
                            res.json(token)
                        }
                    )
                }
                else {

                    res.json(2);
                }
            }
        }
    })

})

app.post('/list', auth, function(req, res) {
    var user = req.decoded;
    console.log(user);
    var sql = "SELECT * FROM user WHERE id = ?";
    connection.query(sql, [user.userId], function(err, result) {
        if (err) throw err;
        else {
            var dbUserData = result[0];
            console.log(dbUserData);
            var option = {
                method : "GET",
                url : "https://testapi.openbanking.or.kr/v2.0/user/me",
                headers : {
                    Authorization : "Bearer " + dbUserData.accesstoken
                },
                qs : {
                    user_seq_no : dbUserData.userseqno
                }
            }
            request(option, function(err, response, body) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                else {
                    var listRequestResult = JSON.parse(body);
                    // console.log(listRequestResult);
                    res.json(listRequestResult);
                }
            })
        }
    })
})

app.post('/balance', auth, function(req, res) {
    // 사용자 정보 조회
    // 사용자 정보를 바탕으로 request(잔액조회 api) 요청 작성하기
    var user = req.decoded;
    console.log(req.body)
    var finusenum = req.body.fin_use_num;
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = "M202111576U" + countnum;
    var transdtime = moment(new Date()).format('YYYYMMDDhhmmss');
    console.log(transdtime);
    var sql = "SELECT * FROM user WHERE id = ?";
    connection.query(sql, [user.userId], function(err, result) {
        if (err) throw err;
        else {
            var dbUserData = result[0];
            console.log(dbUserData);
            var option = {
                method : "GET",
                url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
                headers : {
                    Authorization : "Bearer " + dbUserData.accesstoken
                },
                qs : {
                    bank_tran_id : transId,
                    fintech_use_num : finusenum,
                    tran_dtime : transdtime
                }
            }
            request(option, function(err, response, body) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                else {
                    var balanceRequestResult = JSON.parse(body);
                    res.json(balanceRequestResult);
                }
            })
        }
    })
})

app.post('/transactionList', auth, function(req, res) {
    var user = req.decoded;
    console.log(req.body)
    var finusenum = req.body.fin_use_num;
    var countnum = Math.floor(Math.random() * 1000000000) + 1;
    var transId = companyId + countnum;
    var transdtime = moment(new Date()).format('YYYYMMDDhhmmss');
    console.log(transdtime);
    var sql = "SELECT * FROM user WHERE id = ?";
    connection.query(sql, [user.userId], function(err, result){
        if (err) throw err;
        else {
            var dbUserData = result[0];
            console.log(dbUserData);
            var option = {
                method : "GET",
                url : "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
                headers : {
                    Authorization : "Bearer " + dbUserData.accesstoken
                },
                qs : {
                    bank_tran_id : transId,
                    fintech_use_num : finusenum,
                    inquiry_type : 'A',
                    inquiry_base : 'D',
                    from_date : '20190101',
                    to_date : '20190101',
                    sort_order : 'D',
                    tran_dtime : transdtime
                }
            }
            request (option, function(err, response, body) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                else {
                    var transactionListResult = JSON.parse(body);
                    // console.log(transactionListResult);
                    res.json(transactionListResult);

                }
            })
        }
    })
})

app.post('/withdraw', auth, function(req, res) {

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