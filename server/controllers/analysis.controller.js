var mongoose = require('mongoose');
var Promise = require('bluebird');
var Analysis = require('../models/analysis.model.js');
var kairos = require('./analysis/videoAnalyzer.js');
var eventEmitter = require('./events.controller.js');
var util = require('./utils.js')
var notify = require('./notification.controller.js');
var apiKeys = require('../config.js');
var audio = require('./audio.controller.js');


module.exports.analyze = function (userData, currentUser) {

  var jobID = userData.shortcode;
  var analysis = new Analysis ({username : currentUser, title: userData.title, description: userData.description, isPrivate: true});
  var audioLocation;
  //Polling Function Sytanx: util.poll(options, interval, condition)
  util.poll('https://api.streamable.com/videos/'+jobID, 10000, streamableDoneProcessing, 'streamable'+jobID)
    .then(function(res){
      var videoURL = 'https:'+res.files.mp4.url;
      analysis.thumbnail_url = 'https:'+res.thumbnail_url;
      analysis.videoUrl = 'https:'+res.files.mp4.url;
      Promise.all([kairos.videoAnalysis(videoURL), audio.audioAnalysis(videoURL, jobID)])
        .then(function(data){
          //beyond verbal tends to send back no data if the analysis doesnt catch audio, error checking
          var beyondVerbalData;
          if(data[1][0]){
            if(data[1][0].result.analysisSegments){
              beyondVerbalData = util.formatBeyondVerbal(data[1][0].result)
            } else {
              beyondVerbalData = null
            }
          } else {
            beyondVerbalData = null
          }
          analysis.beyondVerbalAnalysis = [beyondVerbalData, data[1][1]];

          analysis.watsonAnalysis = data[1][3];
          analysis.alchemyAnalysis = util.getKeywords(data[1][2]);
          analysis.kairosAnalysis = util.kairosData(data[0].frames);
          analysis.kairosAnalysis.length = data[0].length;
          analysis.save(function(err){
            if(err){
              console.log(err)
            } else {
              console.log('Analysis saved')
            }
          })
        })
    });
 
};

function streamableDoneProcessing (data){return data.percent === 100;};

module.exports.getAnalysisData = function(req, response){
  var analysisId = req.params.analysisID;
  Analysis.findById(analysisId, function(err, analysis){
    if (err){
      console.log(err);
    }else{
      if(req.session.user === analysis.username){
        response.status(200).send(JSON.stringify(analysis));
      } else {
        //not authorized
        response.sendStatus(401)
        console.log('Not authorized')
      }

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

module.exports.delete = function(req, res){
  var id = req.body.videoID;
  Analysis.findOneAndRemove({_id: id}, function(err, data){
    if(err){
      console.log(err)
    } else {
      console.log('deleted successfully')
      res.sendStatus(204)
    }
  })
}


