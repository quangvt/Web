var http = require('http');
var url = require('url');

var server = http.createServer((req, res) => {
  var parseUrl = url.parse(req.url, true);
  var pathname = parseUrl.pathname.match(/\/([a-zA-Z]+)$/)[1];
  var obj;
  if (pathname === 'parsetime') {
    var a = parseUrl.query.iso;
    var h = Number(a.match(/[T](\d{2}):{1}/)[1]);
    var m = Number(a.match(/:(\d{2}):/)[1]);
    var s = Number(a.match(/:(\d{2})\./)[1]);
    obj = { "hour":h, "minute":m, "second":s };
  }
  else if (pathname === 'unixtime') {
    var unixtime = Date.parse(parseUrl.query.iso);
    obj = { "unixtime":unixtime };
  }
  else {
    console.error('invalid pathname');
  }
  
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(obj))
   
});

server.listen(process.argv[2]);


