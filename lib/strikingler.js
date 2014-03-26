#! /usr/bin/env node
/*
 * strikingler
 * https://github.com/ejramire/strikingler
 *
 * Copyright (c) 2014 Eduardo Ramírez
 * Licensed under the MIT license.
 */

'use strict';

//load dependencies
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
//load
var url = process.argv[2];
var filename = process.argv[3] || "strikingled.html";
var conf;

request(url, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    //replace relative links
    body = body.split("=\"//").join("=\"http://");
    body = body.split("='//").join("='http://");
  
    //load cheerio and remove unnecesary divs
    var $ = cheerio.load(body);   
    $('#strikingly-footer-logo').remove();
    $('navbar-drawer.strikingly-drawer.hidden').remove();
    $('.socialMedia.content').remove();
    
    //conf file
    conf = JSON.parse(fs.readFileSync('./strike.json','utf8'))[url];
    console.log("conf =");
    console.log(conf);
    if (conf.title){
      $('title').html(conf.title);
    }
    if (conf.favicon){
      $('link[href="http://assets.strikingly.com/assets/favicon.ico"]').attr('href', conf.favicon);
    }


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
