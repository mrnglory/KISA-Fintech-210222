const express = require('express')
const app = express()


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


app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/user', function (req, res) {
    connection.query('SELECT * FROM user;', function(error, results, fields) {
        console.log(results);
        res.send(results);
    });
})

app.listen(3000)