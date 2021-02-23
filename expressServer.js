const express = require('express');
const app = express();

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