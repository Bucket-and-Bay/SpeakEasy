var request = require('request-promise');
var apiKeys = require('../../config/config.js');
var eventEmitter = require('../events.controller.js');

module.exports.postVideoForAnalysis = function (url) {
  console.log('VIDEO URL', url);
  var options={
    method    : 'POST',
    url       : 'https://api.kairos.com/media?source=http:'+url,
    headers:{
      app_id    : process.env.KAIROS_ID || apiKeys.kairosID,
      app_key   : process.env.KAIROS_KEY || apiKeys.kairosKey
      }
  };
  // make post request to emotional analyzer (kairos)
  // we will receive a response back (id for the video)
  request(options)
  .then(function(res,err){
    if (err){
      console.log('ERROR',err);
    }else{
      console.log('RESPONSE', res);
      var videoID = JSON.parse(res).id;
      getVideoAnalysis(videoID);
    }
  });
}

// https://api.kairos.com/media/id => GET request with time interval until video processing returns object

var getVideoAnalysis = function (videoID) {
  console.log('VIDEOID', videoID);
  var options={
    method    : 'GET',
    url       : 'https://api.kairos.com/media/'+videoID,
    headers:{
      app_id    : process.env.KAIROS_ID || apiKeys.kairosID,
      app_key   : process.env.KAIROS_KEY || apiKeys.kairosKey
    }
  };

   //make post request to emotional analyzer (kairos)
  request(options)
   .then(function(res,err){
     if (err){
       console.log('ERROR',err);
     }else{
       res = JSON.parse(res);
       if (res.status === 'Complete') {
         console.log('Res.status is Complete');
         eventEmitter.emit('kairos', res);
       // } else if (res.status_message === 'Processing'){
       }else{
         console.log('STILL PROCESSING VIDEO', res);
         //TODO: Set timeout interval based on what happens when analysis is complete.
         setTimeout(function () {
           getVideoAnalysis(videoID);
         }, 25000);
       }
     }
   });
};