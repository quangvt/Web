var http = require('http')
var url = process.argv[2]
http.get(url, (res) => {
  res.setEncoding('utf8')
  res.on('error', console.error)
  var rawData = ''
  res.on('data', (chunk) => {
    rawData += chunk
  })
  res.on('end', () => {
    console.log(rawData.length)
    console.log(rawData )
  })
}).on('error', console.error)
