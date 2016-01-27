var request = require('request-promise');
// var apiKeys = require('../../config/config.js');

module.exports.getVideo = function (shortcode, response) {
  return request('https://api.streamable.com/videos/'+shortcode)
    .then( function (res, err) {
    if (err) {
      console.log('ERROR', err);
    } else {
      var data = JSON.parse(res);
      //Check if valid video url, because streamable stores other formats
      if(data.thumbnail_url===null){
        response.status(400);
        response.send('The video you uploaded is not the correct format. Please upload another video.');
      }else{
        response.status(201);
        response.send("Your video has been successfully uploaded. You will be notified when your analysis is ready.");
        return data;
      }
    }
  });
};

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
  return request(options)
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
      app_id    : apiKeys.kairosID,
      app_key   : apiKeys.kairosKey
    }
  };

   //make post request to emotional analyzer (kairos)
    return request(options)
     .then(function(res,err){
       if (err){
         console.log('ERROR',err);
       }else{
         res = JSON.parse(res);
         if (res.status === 'Complete') {
           return res;
         } else if (res.status_message === 'Processing'){
           console.log('STILL PROCESSING VIDEO');
           //TODO: Set timeout interval based on what happens when analysis is complete.
           setTimeout(function () {
             getVideoAnalysis(videoID);
           }, 10000);
         }
       }
     });
}