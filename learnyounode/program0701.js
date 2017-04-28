var http = require('http');

module.exports = function(url) {
  http.get(url, (res) => {
    /*
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    
    let error;
    if (statusCode != 200) {
      error = new Error(`Request Failed.\n` + 
                       `Status Code: ${statusCode}`);
    }
    
    else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Invalid content-type.\n` + 
                         `Expected application/json but receive ${contentType}`);
    }
    
      
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }
    */
    
    res.setEncoding('utf8');
    //let rawData = '';
    //res.on('data', (chunk) => { rawData += chunk; });
    res.on('data', (chunk) => { console.log(chunk); });
    res.on('end', () => {
      try {
        // const parseData = JSON.parse(rawData);
        // console.log(parseData);
        //console.log(rawData);
      }
      catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  })
}
