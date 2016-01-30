var apiKeys = require('../../config.js');
var request = require('request-promise');

module.exports.alchemyAnalysis = function (transcript) {
  var options={
    method    : 'POST',
    text      : transcript,
    url       : 'http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment',
    apikey    : process.env.KAIROS_ID || apiKeys.alchemyKey,
    outputMode: json
  };
  request(options)
  .then(function(res,err){
    if (err){
      console.log('ERROR',err);
    }else{
      var alchemyResults = res;
      console.log(res)
    }
  });
}