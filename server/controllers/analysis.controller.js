var mongoose = require('mongoose');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
var kairos = require('./analysis/videoAnalyzer.js');
var eventEmitter = require('./events.controller.js');
var util = require('./utils.js')
var notify = require('./notification.controller.js');
var apiKeys = require('../config.js');
var audio = require('./audio.controller.js');

module.exports.analyze = function (userData, currentUser) {
  var jobID = userData.shortcode;
  var processCount = 0;
  var analysis = new Analysis ({username : currentUser, title: userData.title, description: userData.description});

  //Polling Function Sytanx: util.poll(options, interval, condition)
  util.poll('https://api.streamable.com/videos/'+jobID, 10000, streamableDoneProcessing, 'streamable'+jobID)
    .then(function(res){
      console.log(res)
      analysis.thumbnail_url = 'https:'+res.thumbnail_url;
      analysis.videoUrl = 'https:'+res.files.mp4.url;
      return kairos.videoAnalysis('https:'+res.files.mp4.url);
    }).then(function(kairosResults){
      console.log('KAIROS SUCCESSFUL');
      analysis.kairosAnalysis = kairosResults;
      return audio.audioAnalysis(analysis.videoUrl);
    }).then(function(audioResults){
      console.log('ALCHEMY RESULTS', audioResults);
      analysis.beyondVerbalAnalysis = [audioResults[0], audioResults[1]];
      analysis.watsonAnalysis = audioResults[3];
      analysis.alchemyAnalysis = audioResults[2];
      analysis.save(function(err){
        if(err){
         consol.elog(err) 
       }else{
        console.log('Analysis saved')
       }
      });
    });
 
};

function streamableDoneProcessing (data){return data.percent === 100;};

function kairosDoneProcessing (data){return data.status === "Complete";};

module.exports.getAnalysisData = function(analysisId, response){
  Analysis.findById(analysisId, function(err, analysis){
    if (err){
      console.log(err);
    }else{
      response.send(200, JSON.stringify(analysis));
    }
  })
};

module.exports.fetchAnalyses = function(currentUser, response){
  Analysis.find({username: currentUser},
    '_id videoUrl date title thumbnail_url description')
  .then(function (data) {
    var analysisData = JSON.stringify(data);
    response.status(200).send(analysisData);
  });
};
