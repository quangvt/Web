var fs = require('fs');
//var buf = fs.readFileSync(process.argv[2]);
var buf = fs.readFile(process.argv[2],'utf8', function callback(err, data){
  if (err) return console.log(err);
  console.log(data.split('\n').length - 1);
});

