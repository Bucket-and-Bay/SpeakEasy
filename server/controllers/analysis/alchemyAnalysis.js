var Promise = require('bluebird');
var apiKeys = require('../../config.js');
var request = require('request-promise');
var AlchemyAPI = require('../../alchemyapi.js');

var alchemyapi = new AlchemyAPI();

module.exports.alchemyAnalysis = function(watsonText) {

  var transcript = watsonText;
  var alchemyResults = {};
  return new Promise(function(resolve, reject){
    alchemyapi.keywords('text', transcript, {sentiment: 1}, function(response){
      alchemyResults["keywords"] = response["keywords"];
      alchemyapi.concepts('text', transcript, {}, function(response){
        alchemyResults["concepts"] = response["concepts"];
        alchemyapi.sentiment('text', transcript, {}, function(response){
          if(response["docSentiment"] === undefined){
            reject('alchemy analysis error')
          } else {

            alchemyResults["sentiment"] = response["docSentiment"]["type"]
            resolve(alchemyResults);
          }
        });
      });
    })
  })
};