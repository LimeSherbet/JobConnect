var http = require('http');
var fs = require('fs');
url = require('url');
express = require('express');
app = express();

http.createServer(function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync('./web/src/index.html', 'utf8'));

}).listen(4200);