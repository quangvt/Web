var http = require('http');
var map = require('through2-map');

var server = http.createServer((req, res)=>{
  if (req.method !== 'POST') {
    return res.end('send me a POST\n');
  }
  res.writeHead(200, {'content-type':'text/plain'})

  req.pipe(map(function(chunk){
    //return chunk.toString().split('').reverse().join('');
    return chunk.toString().toUpperCase();
  })).pipe(res);
});

server.listen(Number(process.argv[2]));
