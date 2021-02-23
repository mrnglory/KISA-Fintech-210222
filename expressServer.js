const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/user', function (req, res) {
    res.send('사용자 페이지입니다.')
})

app.listen(3000)