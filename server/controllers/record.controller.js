var Promise = require('bluebird');
var watsonAnalysis = require('./analysis/watsonAnalysis.js');
var alchemy = require('./analysis/alchemyAnalysis.js');
var apiKeys = require('../config/localConfig.js');
var recordWatsonAnalysis = require('./analysis/recordWatsonAnalysis.js');
var analysis = require('./analysis.controller.js');
var multiparty = require('multiparty');

module.exports.recordAnalysis = function(req, res){ 
  recordWatsonAnalysis.transcript(req)
    .then(function(data, rejected){
      if(data.transcript.length > 0){
        alchemy.alchemyAnalysis(data.transcript).then(function(alchemyResults){
          console.log(alchemyResults, 'recorded alchemyresults')
        })
      } else {
        console.log('watsonToSpeech audio to Text fail');
      }
      var videoAnalysis = {
        shortcode: data.shortcode,
        title: data.title,
        description: data.description,
      }
      //data.audio64 is the audiofile string in base 64
      //need beyond verbal analysis
      //do all three of these analysis, then save to mongodb database
      //along with the audio file
       analysis.analyze(videoAnalysis, req.session.user); 
      
    })
};





