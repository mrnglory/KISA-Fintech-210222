const express = require('express');
const app = express();

// json 타입의 데이터 전송을 허용
app.use(express.json());
// form 타입의 데이터 전송을 허용
app.use(express.urlencoded({ extended: false }));

// 뷰 파일이 있는 디렉토리를 설정
app.set('views', __dirname + '/views');
// 뷰 엔진으로 ejs 사용
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/ejs', function (req, res) {
    res.render('ejsTest');
})

app.post('/userData', function(req, res) {
    console.log("사용자의 요청이 발생했습니다");
    console.log(req.body);
    res.send(true);
})

app.get('/user', function (req, res) {
    connection.query('SELECT * FROM user;', function(error, results, fields) {
        console.log(results);
        res.send(results);
    });
})



////////////
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'p446851',
    database : 'kisa-fintech210222',
    port     : '3307'
});
connection.connect();
// connection.end();
///////////



app.listen(3000);