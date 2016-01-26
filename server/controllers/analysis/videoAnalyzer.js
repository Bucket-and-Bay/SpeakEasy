var request = require('request-promise');
var apiKeys = require('../../config/config.js');


module.exports.postVideoForAnalysis = function (url, response) {
  var options={
    method    : 'POST',
    url       : 'https://api.kairos.com/media?source=http:'+url,
    headers:{
      app_id    : apiKeys.kairosID,
      app_key   : apiKeys.kairosKey
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
      return getVideoAnalysis(videoID, response);
    }
  });
}

// https://api.kairos.com/media/id => GET request with time interval until video processing returns object

function getVideoAnalysis (videoID, response) {
  var options={
    method    : 'GET',
    url       : 'https://api.kairos.com/media/'+videoID,
    headers:{
      app_id    : apiKeys.kairosID,
      app_key   : apiKeys.kairosKey
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
           console.log('The final response from Kairos: ', res);
           return response.end(JSON.stringify(res));
         } else if (res.status_message === 'Processing'){
           console.log('STILL PROCESSING VIDEO');
           //TODO: Set timeout interval based on what happens when analysis is complete.
           setTimeout(function () {
             getVideoAnalysis(videoID, response);
           }, 10000);
         }
       }
     });
}