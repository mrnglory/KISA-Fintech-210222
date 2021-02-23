var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'p446851',
    database : 'kisa-fintech210222',
    port     : '3307'
});

connection.connect();

connection.query('SELECT * FROM user;', function(error, results, fields) {
    console.log(results);
});

connection.end();