var mongoose = require('mongoose');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');
var eventEmitter = require('./events.controller.js');
var util = require('./utils.js')
var notify = require('./notification.controller.js');
var apiKeys = require('../config.js');



module.exports.analyze = function (shortcode, currentUser) {
  var jobID = shortcode;
  var analysis = new Analysis ({username : currentUser});

  //Polling Function Sytanx: util.poll(cb, interval,condition, eventName, args)
  util.poll(getVideo, 10000, streamableDoneProcessing, 'streamable'+jobID, shortcode);

  eventEmitter.once('streamable'+jobID, function(data){
    analysis.thumbnail_url = data.thumbnail_url;
    analysis.videoUrl = data.files.mp4.url;
    videoAnalyzer.postVideoForAnalysis(data.files.mp4.url, jobID);   
  });

  eventEmitter.once('kairosProcessing'+jobID, function(videoID){
    var options={
      method    : 'GET',
      url       : 'https://api.kairos.com/media/'+videoID,
      headers:{
        app_id    : apiKeys.kairosID,
        app_key   : apiKeys.kairosKey
      }
    };
    util.poll(videoAnalyzer.getVideoAnalysis, 60000, kairosDoneProcessing, 'kairosComplete'+jobID, options);
  });

  eventEmitter.once('kairosComplete'+jobID, function(response){
     console.log('kairosComplete received', response);

     analysis.videoEmotionAnalysis = JSON.stringify(response);

     analysis.save(function(err){
        if(err){
          console.log(err);
        }else{
          console.log('You analysis has been saved:');
          notify.byText(analysis.username);
        }
     });
  });
};


function streamableDoneProcessing (data){return data.percent === 100;};

function kairosDoneProcessing (data){return data.status === "Complete";};

function getVideo(shortcode) {
  return request('https://api.streamable.com/videos/'+shortcode)
    .then( function (res, err) {
    if (err) {
      console.log('ERROR', err);
    } else {
      var data = JSON.parse(res);
      return data;
    }
  });
}

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
    '_id videoUrl date title thumbnail_url')
  .then(function (data) {
    var analysisData = JSON.stringify(data);
    response.send(200, analysisData);
  });
};
