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
      var videoURL = 'https:'+res.files.mp4.url;
      analysis.thumbnail_url = 'https:'+res.thumbnail_url;
      analysis.videoUrl = 'https:'+res.files.mp4.url;
      Promise.all([kairos.videoAnalysis(videoURL), audio.audioAnalysis(videoURL)])
        .then(function(data){
          
          console.log(data[1][0], "!!!!!BEYOND VERBAL GETANALYSIS DATA!!");
          console.log(data[1][1], "!!!!BEYOND VERBAL UPSTREAM DATA!!!")
          console.log(data[1][2], '!!!!ALCHEMY RESULTS !!!!!');
          console.log(data[1][3], '!!!!WATSON RESULTS!!!!!!!!')
          console.log(data[0], 'kairos data');
        })
    })
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
    response.send(200, analysisData);
  });
};
