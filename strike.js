//load dependencies
var request = require('request');
var cheerio = require('cheerio');

//load
var url = process.argv[2];
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);   
  }
});


