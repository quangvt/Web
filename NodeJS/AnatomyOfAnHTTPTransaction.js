/*
Giải Phẫu một HTTP Transaction

Mục đích của hướng dẫn này nhằm truyền đặt một hiểu biết vững chắc của tiến trình xử lý HTTP request của Node.js (the process of Node.js HTTP handling). Chúng tôi sẽ giả định bạn đã biết, theo một hiểu biết cơ bản, cách thức làm việc của một HTTP request, không phụ thuộc vào ngôn ngữ hay môi trường lập trình nào. Chúng tôi cũng sẽ giả định bạn cũng chút nào đó biết về Node.js EventEmitters và Streams. Nếu bạn không biết gì về chúng, rất đáng giá cho việc đọc nhanh API docs của những cái này.
EventEmitter: https://nodejs.org/api/events.html
Streams: https://nodejs.org/api/stream.html

Tạo Server

Bất kỳ node web server application sẽ phải tạo web server object tại một thời điểm nào đó. Sử dụng hàm: createServer
*/

var http = require('http');

var server = http.createServer(function(request, response) {
    // magic happens here!
});

/*
Cái function được đưa vào createServer sẽ được gọi một lần cho mỗi HTTP Request đến server đó, vì vậy nó được gọi là request handler. Thực tế createServer tạo một Server object hay chính là một EventEmitter, cái chúng ta có ở trên chỉ là một tốc ký cho việc tạo một server object và sau này sẽ thêm listener sau.
*/
var server = http.createServer();

server.on('request', function(request, response) {
   // the same kind of magic happens here! 
});

/*
Khi một HTTP request táng vào server, node gọi request handler function với một vài handy objects để làm việc với transaction, request và response. Chúng ta sẽ tìm hiểu chúng sớm.

Để phục vụ các request, cái listen method cân được gọi trên server object. Trong tất cả các trường hợp, tất cả cái bạn cần truyền đến listen là port number bạn muốn cái server lắng nghe trên đó. Có một vài lựa chọn khác, có thể tham khảo API reference.

Method, URL và Headers

Khi xử lý một request, điều đầu tiên bạn có thể muốn làm là nhìn vào method và URL, bởi vậy các action phù hợp sẽ được lựa chọn. Node làm cho việc này chút nào đó bớt đau đớn hơn bằng việc đưa các handy property lên request object.
*/

var method = request.method;

var url = request.url;

/*
Lưu ý: request object là một instance của IncomingMessage

"method" ở đây luôn luôn là một HTTP method/verb thông thường. "url" là một URL đầy đủ (không bao gồm: server, protocol và port). Với một URL điển hình, nó sẽ bao gồm toàn bộ mọi thứ từ forward slash thứ 3.
Headers cũng không ở quá xa. Chúng ở ngay trong chính object headers (request.headers)
*/

var headers = request.headers;

var userAgent = headers['user-agent'];

/*
Lưu ý quan trọng: tất cả các headers đều được biểu diễn theo lower-case, không phụ thuộc vào thực tế các client gửi chúng đến như thế nào. Việc này làm đơn giản hoá nhiệm vụ parse header cho mục đích nào đó.

Nếu một vài header bị lặp lại, các giá trị của chúng sẽ bị overwritten hoặc joined cùng nhau theo dạng string phân tách nhau bởi dấu phấy (comma), tuỳ thuộc trên header cụ thể. Trong một vài trường hợp, việc này có thể là vấn đề, bởi vậy rawHeaders vẫn sẵn sàng phục vụ.

Request Body

Khi nhận một POST hoặc PUT request, request body có thể quan trọng đối với ứng dụng của bạn. Lấy dữ liệu trong body có thể mất công hơn là lấy thông tin headers. Cái request object được truyền đến một handler phải được kế thừa ReadableStream interface. Stream này có thể được xử lý(listened to) hoặc cho vào ống đợi (piped) như các thằng Stream khác. Chúng ta có thể tóm ngay được data của stream khi nó đang truyền đến bằng các event 'data' và 'end'. (right out of)

Cái thùng(the chunk) nơi chứa các thứ mà 'data' events phát (emit) ra là một Buffer. Nếu bạn biết nó sẽ là một string data, tốt nhất là collect nó vào một array, sau đó đến 'end' event thì concatenate và stringify nó.
*/

var body = [];
request.on('data', function(chunk) {
    body.push(chunk);
}).on('end', function() {
    body = Buffer.concat(body).toString();
    // at this point, 'body' has the entire request body stored in it as a string
})

/*
Lưu ý: Xử lý này có vẻ tẻ nhạt, và trong nhiều trường hợp, đúng là như vậy. Nhưng may mắn làm sao, có một số module như 'concat-stream' và 'body' trên npm, chúng có thể giúp chúng ta ẩn đi một vài logic này. Tuy nhiên quan trọng là bạn phải hiểu cái gì đang chạy ngầm bên dưới con đường đẹp đó, đó là tại sao bạn đang đọc những dòng này.

A Quick Thing About Error (Một suy nghĩ nhanh về error)

Do 'request' object là một ReadableStream, nó cũng là một EventEmitter nên nó hành xử tương tự EventEmitter khi có error xảy ra.
Một error trong 'request' stream show hàng bằng việc phát tán (emit) một 'error' event trên sàn biểu diễn (stream)

Nếu bạn không có một ông listener cho event đó, error sẽ bị ném ra (throw), nó có thể làm cho ứng dụng Node.js của bạn tiêu đời. Vì vậy bạn nên add một 'error' listener trên request, thậm chí bạn chỉ log nó và tiếp tục công việc bình thường. (Mặc dù nó có thể là tốt nhất để gửi một vài kiểu lỗi HTTP response. Sẽ đến với vấn đề này sau).

*/

request.on('error', function(err) {
    // This prints the error message and stack trace to 'stderr'
    console.error(err.stack);
});

/*
Có một vài cách khác để xử lý các error này như: other abstractions và tools. Nhưng một điều luôn luôn cần ghi nhớ rằng error có thể và sẽ xảy ra, và bạn sẽ phải chơi với nó.

What We've Got so Far (Đến đây chúng ta đã có gì rồi?)


*/
