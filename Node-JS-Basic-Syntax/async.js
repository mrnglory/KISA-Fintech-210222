var fs = require('fs');

function callbackFunc(callback) {
    fs.readFile('test.txt', 'utf8', function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        else {
            console.error("두번째 기능인데 파일을 읽어오느라 시간이... 조큼... 걸려요");
            callback(result);
        }
    });
}

console.log("A");
callbackFunc(function (data) {
    console.log(data);
    console.log("c");
})
