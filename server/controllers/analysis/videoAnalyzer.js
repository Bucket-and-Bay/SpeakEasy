var request = require('request-promise');
var apiKeys = require('../../config/config.js');


module.exports.postVideoForAnalysis = function (url) {
  console.log(url);
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
      getVideoAnalysis(videoID);
    }
  });
}

// https://api.kairos.com/media/id => GET request with time interval until video processing returns object
var count=0;
function getVideoAnalysis (videoID) {
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
         console.log('ATTEMPT RESPONSE FROM KAIROS: ', res);
         if (res.status_message === 'Complete') {
           console.log('The final response from Kairos: ', res);
         } else if (res.status_message === 'Processing'){
           //TODO: Set timeout interval based on what happens when analysis is complete.
           if (count<6){
            setTimeout(function () {
              getVideoAnalysis(videoID);
            }, 10000);
            count++;
           }
         }
       }
     });
}