var Promise = require ('bluebird');
var request = require('request-promise')
var eventEmitter = require('./events.controller.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');

module.exports.poll = function(options, interval,condition, eventName){
  request(options)
    .then(function(res, err){
      var data = JSON.parse(res);
      if(err){
        console.log(err);
      }else{
        if(condition && condition(data)){
          eventEmitter.emit(eventName, data);
        }else{
          console.log('Polling', res.percent);
          setTimeout(function(){module.exports.poll(options, interval, condition, eventName);}, interval);
        }
      }
    });
};

