var http = require("http");

console.log("server started");

http.createServer(function (req, res) {
    var body = "hello Server";
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end("hello node http server")
}).listen(3000);