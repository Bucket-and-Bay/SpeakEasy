var Promise = require('bluebird');
var apiKeys = require('../../config.js');
var request = require('request-promise');
var AlchemyAPI = require('../../alchemyapi.js');
var eventEmitter = require('../events.controller.js');

var alchemyapi = new AlchemyAPI();
var alchemyResults = {}
//change to use watson results.
var transcript = 'there is an interesting story about how this institution came to be the father of Wake Forest Samuel it was trying to raise money for a different school but during his travels his horse ran off any became standing nearby so the locals ask them to leave their new university it was a simpler time back then they just handed out universities to whoever is horse had run off most recently this man has no control over his animals surely he has something to teach us all'

var analyze = function(watsonResults){
  return new Promise(function(resolve, reject){
    alchemyapi.keywords('text', watsonResults, {}, function(response){
      alchemyResults["keywords"] = response["keywords"];
      alchemyapi.concepts('text', watsonResults, {}, function(response){
        alchemyResults["concepts"] = response["concepts"];
        alchemyapi.sentiment('text', watsonResults, {}, function(response){
          alchemyResults["sentiment"] = response["docSentiment"]["type"]
          resolve(alchemyResults);
        });
      });
    })
  });
};

module.exports.alchemyAnalysis = function(watsonResults, jobID) { 
  analyze(watsonResults)
  .then(function(results){
    console.log('AR', alchemyResults);
    //TODO: save alchemyResults
    eventEmitter.emit('alchemyComplete'+jobID, alchemyResults);
  });
};

