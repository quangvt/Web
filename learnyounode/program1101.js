var http = require('http')
var fs = require('fs')

var server = http.createServer((req, res) => {
    // apply solution
    res.writeHead(200, {'content-type': 'text/plain'})
    
    // src.pipe(dst) : source.pipe(destination) : fileStream.pipe(httpResponseStream)
    fs.createReadStream(process.argv[3]).pipe(res)
})
//server.listen(process.argv[2])
// Apply solution
server.listen(Number(process.argv[2]))