/*
Giải Phẫu một HTTP Transaction
================================================================================
Mục đích của hướng dẫn này nhằm truyền đặt một hiểu biết vững chắc của tiến 
trình xử lý HTTP request của Node.js (the process of Node.js HTTP handling). 
Chúng tôi sẽ giả định bạn đã biết, theo một hiểu biết cơ bản, cách thức làm 
việc của một HTTP request, không phụ thuộc vào ngôn ngữ hay môi trường lập
trình nào. Chúng tôi cũng sẽ giả định bạn cũng chút nào đó biết về Node.js 
EventEmitters và Streams. Nếu bạn không biết gì về chúng, rất đáng giá cho 
việc đọc nhanh API docs của những cái này.
EventEmitter: https://nodejs.org/api/events.html
Streams: https://nodejs.org/api/stream.html

Tạo Server
================================================================================
Bất kỳ node web server application sẽ phải tạo web server object tại một thời
điểm nào đó. Sử dụng hàm: createServer
*/

var http = require('http');

var server = http.createServer(function(request, response) {
    // magic happens here!
});

/*
Cái function được đưa vào createServer sẽ được gọi một lần cho mỗi HTTP Request
đến server đó, vì vậy nó được gọi là request handler. Thực tế createServer tạo
một Server object hay chính là một EventEmitter, cái chúng ta có ở trên chỉ là 
một tốc ký cho việc tạo một server object và sau này sẽ thêm listener sau.
*/
var server = http.createServer();

server.on('request', function(request, response) {
   // the same kind of magic happens here! 
});

/*
Khi một HTTP request táng vào server, node gọi request handler function với một
vài handy objects để làm việc với transaction, request và response. Chúng ta sẽ 
tìm hiểu chúng sớm.

Để phục vụ các request, cái listen method cân được gọi trên server object. 
Trong tất cả các trường hợp, tất cả cái bạn cần truyền đến listen là port number
bạn muốn cái server lắng nghe trên đó. Có một vài lựa chọn khác, có thể tham khảo 
API reference.

Method, URL và Headers
================================================================================

Khi xử lý một request, điều đầu tiên bạn có thể muốn làm là nhìn vào method và 
URL, bởi vậy các action phù hợp sẽ được lựa chọn. Node làm cho việc này chút 
nào đó bớt đau đớn hơn bằng việc đưa các handy property lên request object.
*/

var method = request.method;

var url = request.url;

/*
Lưu ý: request object là một instance của IncomingMessage

"method" ở đây luôn luôn là một HTTP method/verb thông thường. "url" là một URL 
đầy đủ (không bao gồm: server, protocol và port). Với một URL điển hình, nó sẽ 
bao gồm toàn bộ mọi thứ từ forward slash thứ 3.
Headers cũng không ở quá xa. Chúng ở ngay trong chính object headers
(request.headers)
*/

var headers = request.headers;

var userAgent = headers['user-agent'];

/*
Lưu ý quan trọng: tất cả các headers đều được biểu diễn theo lower-case, không
phụ thuộc vào thực tế các client gửi chúng đến như thế nào. Việc này làm đơn 
giản hoá nhiệm vụ parse header cho mục đích nào đó.

Nếu một vài header bị lặp lại, các giá trị của chúng sẽ bị overwritten hoặc 
joined cùng nhau theo dạng string phân tách nhau bởi dấu phấy (comma), tuỳ 
thuộc trên header cụ thể. Trong một vài trường hợp, việc này có thể là vấn 
đề, bởi vậy rawHeaders vẫn sẵn sàng phục vụ.

Request Body
================================================================================

Khi nhận một POST hoặc PUT request, request body có thể quan trọng đối với ứng 
dụng của bạn. Lấy dữ liệu trong body có thể mất công hơn là lấy thông tin 
headers. Cái request object được truyền đến một handler phải được kế thừa 
ReadableStream interface. Stream này có thể được xử lý(listened to) hoặc
cho vào ống đợi (piped) như các thằng Stream khác. Chúng ta có thể tóm ngay
được data của stream khi nó đang truyền đến bằng các event 'data' và 'end'. 
(right out of)

Cái thùng(the chunk) nơi chứa các thứ mà 'data' events phát (emit) ra là một 
Buffer. Nếu bạn biết nó sẽ là một string data, tốt nhất là collect nó vào một 
array, sau đó đến 'end' event thì concatenate và stringify nó.
*/

var body = [];
request.on('data', function(chunk) {
    body.push(chunk);
}).on('end', function() {
    body = Buffer.concat(body).toString();
    // at this point, 'body' has the entire request body stored in it as a string
})

/*
Lưu ý: Xử lý này có vẻ tẻ nhạt, và trong nhiều trường hợp, đúng là như vậy. Nhưng 
may mắn làm sao, có một số module như 'concat-stream' và 'body' trên npm, chúng có
thể giúp chúng ta ẩn đi một vài logic này. Tuy nhiên quan trọng là bạn phải hiểu 
cái gì đang chạy ngầm bên dưới con đường đẹp đó, đó là tại sao bạn đang đọc những
dòng này.

A Quick Thing About Error (Một suy nghĩ nhanh về error)
================================================================================

Do 'request' object là một ReadableStream, nó cũng là một EventEmitter nên nó
hành xử tương tự EventEmitter khi có error xảy ra.
Một error trong 'request' stream show hàng bằng việc phát tán (emit) một 'error'
event trên sàn biểu diễn (stream)

Nếu bạn không có một ông listener cho event đó, error sẽ bị ném ra (throw), nó 
có thể làm cho ứng dụng Node.js của bạn tiêu đời. Vì vậy bạn nên add một 'error'
listener trên request, thậm chí bạn chỉ log nó và tiếp tục công việc bình 
thường. (Mặc dù nó có thể là tốt nhất để gửi một vài kiểu lỗi HTTP response. 
Sẽ đến với vấn đề này sau).

*/

request.on('error', function(err) {
    // This prints the error message and stack trace to 'stderr'
    console.error(err.stack);
});

/*
Có một vài cách khác để xử lý các error này như: other abstractions và tools. 
Nhưng một điều luôn luôn cần ghi nhớ rằng error có thể và sẽ xảy ra, và bạn sẽ
phải chơi với nó.

What We've Got so Far (Đến đây chúng ta đã có gì rồi?)
================================================================================

creating a server, grabbing the method, URL, headers and body out of request. 
Look like this:
*/

var http = require('http');

http.createServer(function(request, response) {
    var headers = request.headers;
    var method = request.method;
    var url = request.url;
    var body = [];
    request.on('error', function(err) {
        console.error(err);
    }).on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function(){
        body = Buffer.concat(body).toString();
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to response to this request.
    });
}).listen(8080); // Activates this server, listening on port 8080

/*
Nếu chúng ta chạy ví dụ này, ta có thể nhận được các request, nhưng không 
response cho nó cái gì hết. Thực tế, nếu bạn thử ví dụ này từ một web browser, 
request của bạn sẽ bị timeout, vì không có gì trả lại client.

Đến lúc này chúng ta vẫn chưa sờ đến response object tẹo nào. Response là một 
instance của ServerResponse và cũng là một WritableStream. Nó có rất nhiều 
method hữu dụng cho việc gửi dữ liệu về client. Chúng ta sẽ xem xét nó ngay thôi.

HTTP Status Code
================================================================================
Nếu bạn không bận tâm đến việc thiết lập (setting) nó, thì HTTP status code của
một response luôn luôn là 200. Tất nhiên, không thể nào tât cả các HTTP response
đảm bảo được việc này, tại một thời điểm nào đó chắc chắn bạn muốn gửi một mã 
khác. Để làm vậy, bạn set cái statusCode property.
*/

response.statusCode = 404; // Báo với ông client rằng cái resource đó không tìm
thấy đâu.

/*
Có một vài cách làm ngắn hơn cho xử lý này, chúng ta sẽ sớm thấy thôi đừng nóng.

Setting Response Headers (Thiết lập các headers cho Response)
================================================================================
Các Headers được thiết lập thông qua một method tiện lợi được gọi là setHeader
*/

response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');

/*
Khi thiết lập headers trên một response, sẽ không phân biệt hoa thường
(insensitive) đối với các name. Nếu bạn thiết lập bị trùng lặp, giá trị cuối 
cùng sẽ được truyền đi.

Explicitly Sending Header Data (Truyền dữ liệu Header một cách tường minh)
================================================================================

Các phương thức dùng để setting header và status code mà chúng ta mới đề cập
đó là chúng ta đang sử dụng "implicit headers". Cũng có nghĩa là bạn đang dưa
vào node để gửi headers cho bạn tại một thời điểm thích hợp trước khi bạn 
gửi body data.

Nếu bạn muốn, bạn có thể explicitly write các header cho response stream. Để
làm vậy, có một method là 'writeHead', nó sẽ writes cái status code và headers
vào stream.

*/

response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon'
    
});

/*
Một khi chúng ta đã thiết lập các header (có thể Implicitly hoặc Explicitly),
khi này bạn đã sắn sàng để có thể gửi response data.

Sending Response Body (Gửi Response Body)
================================================================================
Vì response object là một WriteableStream, vì vậy việc writing một response body
đến client chỉ là vấn đề của việc sử dụng các method thông thường.

*/

response.write('<htm>');
response.write('<body>');
response.write('<h1>Hello, World!</h1>');
response.write('</body>');
response.write('</html>');
response.end();

/*
Hàm 'end' trên stream có thể cũng lấy một vài optional data để gửi như là nhứng
bit cuối cùng của dữ liệu trên stream, bởi vậy chúng ta có thể làm đơn giản
bước trên như sau:
*/

response.end('<html><body><h1>Hello, World</h1></body></html>');

/*
Lưu ý: Quan trọng bạn phải thiết lập status và headers trước khi bắt đầu write
đống dữ liệu vào body. Hình dung như là headers sẽ đến trước body khi nhận mộtt
HTTP response.

Another Quick Thing About Errors (Một cái nhìn lướt nhanh khác về errors)
================================================================================
response stream cũng có thể emit ra các 'error' events, và chúng ta cũng phải
chơi với những 'error' này. Tất cả những lời khuyên từ request stream vẫn sẽ
được áp dụng ở đây

Put It All Together (Trộn tất cả lại)
================================================================================
Chúng ta đã vừa học về tạo một HTTP Responses, hãy đưa chúng vào thôi. Xây dựng 
trên ví dụ trước, chúng ta đang tạo một server và gửi lại client toàn bộ dữ liệu
mà user gửi đến. Chúng ta sẽ format dữ liệu đó thành JSON sử dụng JSON.stringify

*/

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

/*
Echo Server Example
================================================================================

Đơn giản hoá ví dụ trên để tạo một server echo đơn giản, cái chỉ đơn giản
gửi bắt kỳ dữ liệu nhận được nào về client. Tất cả việc chúng ta cần làm là 
tập hợp các dữ liệu từ request stream và write vào response stream, tương tự
như cái chúng ta vừa làm

*/

var http = require('http');

http.createServer(function(request, response) {
    var body = [];
    request.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
}).listen(8080);

/*
Nào bắt đầu mổ xẻ cái này xem sao. Chúng ta chỉ muốn gửi một echo dưới những
điều kiện sau:
- Request Method is GET
- URL là /echo

Trong các trường hợp khác, chúng ta đơn giản response status: 404.
*/

var http = require('http');

http.createServer(function(request, response) {
    if (request.method === 'GET' && request.url === '/echo') {
        var body = [];
        request.on('data', function(chunk) {
            body.push(chunk);
        }).on('end', function() {
            body = Buffer.concat(body).toString();
            response.end(body);
        })
    } else {
        response.statusCode = 404;
        response.end();
    }
}).listen(8080);

/*
Lưu ý: Việc kiểm tra URL theo cách này, có nghĩa chúng ta đang làm với một dạng
của "routing". Dạng khác của routing có thể đơn giản là switch statements hoặc
phức tạp như là cả một framework như express. Nếu bạn đang tìm kiếm thứ gì
chỉ để routing mà không làm gì khác, thử router nhé.

Tuyệt vời, đơn giản thêm tí nữa nhé. request là một ReadableStream, response
là một WriteableStream. Có nghĩa là chúng ta có thể dùng pipe để điều hướng
data từ chỗ này đến chỗ khác(?). Đó chính xác là cái chúng ta muốn cho một 
echo server!
*/

var http = require('http');

http.createServer(function(request, response){
    if (request.method === 'GET' && request.url === '/echo') {
        request.pipe(request);
    } else {
        response.statusCode = 404;
        response.end();
    }
});

/*
Yay streams!

Dù vậy chúng ta chưa làm xong. Như đã đề cập nhiều lần trong bài viết này, errors
có thể xảy ra, và chúng ta cần phải chơi với nó.

Để xử lý error trên request stream, chúng ta sẽ log error vào stderr và gửi một
status code 400 và chỉ định là Bad Request. Trong ứng dụng thực tế, mặc dù vậy,
chúng ta sẽ muốn điều tra cái lỗi đó để biết được chính xác error code và message
cần phải có. Bởi vì sự phổ biến tràn lan của error, tốt nhất bạn nên tham khảo
tài liệu Error Document.

Trên response, chúng ta chỉ đơn giản log error vào stdout
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
    if (request.method === 'GET' &&& request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
}).listen(8080);

/*
Chúng ta bây giờ đã bao quát được những cái thiết yếu nhất của xử lý HTTP request.
Đến đây, bạn sẽ có thể:
- Instantiate một HTTP server với một request handler, và cho nó lắng nghe trên
một cổng nào đó.
- Lấy thông tin Headers, URL, method và body data từ request objects.
- Tạo routing decisions dựa trên URL và/hoặc dữ liệu khác trong request objects.
- Gửi Headers, HTTP status codes và body data thông qua response objects.
- Pipe dữ liệu từ request objects và đưa đến response objects.
- Handle stream errors với cả request và response stream.

Từ những kiến thức cơ bản này, Node.js HTTP servers cho rất nhiều trường hợp
điển hình có thể được khởi dựng. Ngoài ra còn có một đống các thứ khác mà APIs này 
cũng cập, bởi vậy nên chắc chắn bạn cần đọc qua tài liệu API cho EventEmitters, 
Streams và HTTP.

Cảm ơn đã đọc bài viết.

Link gốc:
https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
*/