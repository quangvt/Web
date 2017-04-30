var net = require('net')
var server = net.createServer(function(socket){
  // socket handling logic
  var date = new Date()
  var yy = date.getFullYear()
  var mm = formatText((date.getMonth() + 1).toString())
  var dd = formatText((date.getDate()).toString())
  var hh = formatText((date.getHours()).toString())
  var mi = formatText((date.getMinutes()).toString())
  var result = yy + "-" + mm + "-" + dd + " " + hh + ":" + mi
  socket.write(result + "\n")
  socket.end()
})

function formatText (str){
    var reg = /^([1-9]){1}$/
    return str.replace(reg, "0" + "$1")
}

server.listen(process.argv[2])
