var Promise = require('bluebird');
var apiKeys = require('../../config.js');
var request = require('request-promise');
var AlchemyAPI = require('../../alchemyapi.js');
var alchemyapi = new AlchemyAPI();

module.exports.alchemyAnalysis = function(watsonText) { 
  // var transcript = 'there is an interesting story about how this institution came to be the father of Wake Forest Samuel it was trying to raise money for a different school but during his travels his horse ran off any became standing nearby so the locals ask them to leave their new university it was a simpler time back then they just handed out universities to whoever is horse had run off most recently this man has no control over his animals surely he has something to teach us all'
  console.log(watsonText, 'alchemyAnalysis');
  var transcript = watsonText;
  var alchemyResults = {};
  return new Promise(function(resolve, reject){
    alchemyapi.keywords('text', transcript, {}, function(response){
      alchemyResults["keywords"] = response["keywords"];
      alchemyapi.concepts('text', transcript, {}, function(response){
        alchemyResults["concepts"] = response["concepts"];
        alchemyapi.sentiment('text', transcript, {}, function(response){
          alchemyResults["sentiment"] = response["docSentiment"]["type"]
          resolve(alchemyResults);
        });
      });
    })
  })
};

