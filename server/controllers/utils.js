var Promise = require ('bluebird');
var eventEmitter = require('./events.controller.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');

module.exports.poll = function(cb, interval,condition, eventName, args){
   cb(args)
    .then(function(data){
      if(condition && condition(data)){
        eventEmitter.emit(eventName, data);
      }else{
        console.log('Polling');
        Promise.delay(interval).then(setTimeout(function(){module.exports.poll(cb, interval,condition,eventName, args);}, interval)
        );
      }
    })

};

