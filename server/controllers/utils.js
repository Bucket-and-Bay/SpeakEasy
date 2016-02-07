var Promise = require ('bluebird');
var request = require('request-promise')
var eventEmitter = require('./events.controller.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');

module.exports.poll = function(options, interval,condition){
 return new Promise (function(resolve, reject){
  function sub (){
  request(options)
    .then(function(res, err){
      var data = JSON.parse(res);
      if(err){
        reject(err);
      }else{
        if(condition && condition(data)){
          resolve(data);
        }else{
          console.log('Polling');
          setTimeout(function(){sub(options, interval, condition);}, interval);
        }
      }
    });
  };
  sub();
  });

 }


