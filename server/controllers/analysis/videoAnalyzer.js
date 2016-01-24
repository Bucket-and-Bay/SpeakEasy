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
    }
  });
}

// https://api.kairos.com/media/id => GET request with time interval until video processing returns object