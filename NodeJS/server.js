/*
var http = require('http')

http.createServer(function(request, response) {
    var header = request.headers;
    var method = request.method;
    var url = request.url;
    var body = [];
    request.on('error', function(err) {
        console.error(err);
    }).on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        
        // BEGINNING OF NEW STUFF
        response.on('error', function(err) {
            console.error(err);
        });
        
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Note: the 2 lines above could be replaced with this nex one:
        // response.writeHead(200, {'Content-Type': 'application/json'});
        
        var responseBody = {
            headers: headers,
            method: method,
            url: url,
            body: body
        }
        
        response.write(JSON.stringify(responseBody));
        response.end();
        // Note: the 2 lines above could be replaced witm this next one:
        // response.end(JSON.stringify(responseBody))
        
        // END OF NEW STUFF
    });
}).listen(8080)

*/

var http = require('http');

http.createServer(function(request, response) {
    request.on('error', function(err) {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', function(err) {
        console.error(err);
    });
    if (request.method === 'GET' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
}).listen(8080);
