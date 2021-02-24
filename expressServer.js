const express = require('express');
const app = express();
const path = require('path');

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