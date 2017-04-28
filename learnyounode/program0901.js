var http = require('http')
var bl = require('bl')

var results = [];
var count = 0;

function printResult(){
  for (var i = 0; i < 3; i++) {
    console.log(results[i]);
  }
}

function getData(index){
  http.get(process.argv[2 + index], (response) => {
    response.pipe(bl(function(err, data){
      if(err) {
        return console.error(err)
      }
      data = data.toString()
      
      results[index] = data
      count++

      if (count == 3){
        printResult()
      }

    }))
  })
}

/*
(function () {
  for (var i = 0; i < 3; i++) {
    getData(i)
  }
})()
*/
for (var i = 0; i < 3; i++) 
{
    getData(i)
}