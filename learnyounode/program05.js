var fs = require('fs');
var path = require('path');
var dir = process.argv[2];
var ext = "." + process.argv[3];
/*
fs.readdir(dir, (err, list) => {
  if (err) console.log(err);
  for (i = 0; i < list.length; i++) {
    if (path.extname(list[i]) === ext)
      console.log(list[i]);
  }
});
*/
fs.readdir(dir, (err, list) => {
  if (err) console.log(err);
  for (var i of list) {
    if (path.extname(i) === ext)
      console.log(i);
  }
});
