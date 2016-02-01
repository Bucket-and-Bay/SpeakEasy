var Promise = require('bluebird');
var watsonAnalysis = require('./analysis/watsonAnalysis.js');
var alchemy = require('./analysis/alchemyAnalysis.js');
var apiKeys = require('../config/localConfig.js');
var watsonAnalysis = require('./analysis/recordWatsonAnalysis.js');
var analysis = require('./analysis.controller.js');

module.exports.recordAnalysis = function(req, res){
  watsonAnalysis.transcript(req)
    .then(function(data){
      console.log(data.transcript, 'transcript');
      var videoAnalysis = {
        shortcode: data.shortcode,
        title: 'test',
        description: 'test',
      }
      //need beyond verbal analysis
      //do all three of these analysis, then save to mongodb database
      //along with the audio file
      analysis.analyze(videoAnalysis, req.session.user);
      
      alchemy.alchemyAnalysis(data.transcript).then(function(alchemyResults){
        console.log(alchemyResults, 'recorded alchemyresults')
      })
    })
};





