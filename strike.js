//load dependencies
var request = require('request');
var cheerio = require('cheerio');
var parser = require('./parser.js');
var fs = require('fs');
var _ = require('lodash');
//load
var url = process.argv[2];
var filename = process.argv[3] || "strikingled.html";
var conf;
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //replace relative links
    body = body.split("=\"//").join("=\"http://");
    body = body.split("='//").join("='http://");

    //load cheerio and remove unnecesary divs
    var $ = cheerio.load(body);   
    $('#strikingly-footer-logo').remove();
    $('navbar-drawer.strikingly-drawer.hidden').remove();
    $('.socialMedia.content').remove();
    
    //conf file
    fs.readFile('./strike.conf','utf8',function(err, data){
      if(err){
        return;
      }
      conf = JSON.parse(data);
      _.forEach(conf.url.modifyHTML,function(elem){
        $(elem.query).html(elem.newValue);
      } );
    } );


    //save file
    fs.writeFile(filename, $.html(), function(err){
      if(err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
      }
    });
  }
});


