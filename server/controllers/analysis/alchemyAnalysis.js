var apiKeys = require('../../config.js');
var request = require('request-promise');
var AlchemyAPI = require('../../alchemyapi.js');

var alchemyapi = newAlchemyAPI();

module.exports.alchemyAnalysis = function (transcript) {
  alchemyapi.sentiment('text', transcript, {}, function(response){
    console.log("Sentiment: " + response["docSentiment"]["type"]);
  });
}