var Promise = require ('bluebird');
var eventEmitter = require('./events.controller.js');

module.exports.poll= function(cb, interval,condition, event, args){
   cb(args)
    .then(function(data){
      if(condition && condition(data)){
        eventEmitter.emit(event, data);
      }else{
      console.log("Polling");
      Promise.delay(interval).then(module.exports.poll(cb, interval,condition,args))
      }
    });
};
