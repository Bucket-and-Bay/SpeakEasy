var mongoose = require('mongoose');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
var kairos = require('./analysis/videoAnalyzer.js');
var eventEmitter = require('./events.controller.js');
var util = require('./utils.js')
var notify = require('./notification.controller.js');
var apiKeys = require('../config.js');
var audio = require('./audio.controller.js');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var exec = require('child_process').exec;
 var util = require('util');

module.exports.merge = function(audioFile, videoFile){
  var videoLocation = path.join(__dirname + '/wavFiles/testfile.webm');
  var audioLocation = path.join(__dirname + '/wavFiles/testfile.wav');
  ffmpeg(videoFile)
    .output(videoLocation)
    .on('end', function(){
      console.log('Video saved');
    })
    .on('error', function(err){
      console.log(err);
    })
    .run();
  ffmpeg(audioFile)
    .output(audioLocation)
    .on('end', function(){
      console.log('audio q  saved');
    })
    .on('error', function(err){
      console.log(err);
    })
    .run();
  var mergedFile =path.join(__dirname + '/wavFiles/merged.webm');
  var command = "ffmpeg -i " + audioFile + " -itsoffset -00:00:01 -i " + videoFile + " -map 0:0 -map 1:0 " + mergedFile;

  exec(command, function (error, stdout, stderr) {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);

        if (error) {
            console.log('exec error: ' + error);
            response.statusCode = 404;
            response.end();

        } else {
            fs.unlink(audioFile);
            fs.unlink(videoFile);
        }

  });
}

module.exports.analyze = function (userData, currentUser, audioFile) {
  var jobID = userData.shortcode;
  var analysis = new Analysis ({username : currentUser, title: userData.title, description: userData.description, isPrivate: true});
  var audioLocation;
  //Polling Function Sytanx: util.poll(options, interval, condition)
  util.poll('https://api.streamable.com/videos/'+jobID, 10000, streamableDoneProcessing, 'streamable'+jobID)
    .then(function(res){
      var videoURL = 'https:'+res.files.mp4.url;
      analysis.thumbnail_url = 'https:'+res.thumbnail_url;
      analysis.videoUrl = 'https:'+res.files.mp4.url;
      if(audioFile !== undefined){
        analysis.isRecorded = true;
        analysis.audioFile = audioFile;
        audioLocation = audioFile;
      } else {
        audioLocation = videoURL
      }
      Promise.all([kairos.videoAnalysis(videoURL), audio.audioAnalysis(audioLocation, jobID)])
        .then(function(data){
          analysis.beyondVerbalAnalysis = [data[1][0], data[1][1]];
          analysis.watsonAnalysis = data[1][3];
          analysis.alchemyAnalysis = data[1][2];
          analysis.kairosAnalysis = data[0];
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
      if(data.isRecorded){
        fs.unlink(data.audioFile, function(err){
          if(err){
            console.log(err)
          } else {
            console.log('audio file deleted from fs')
          }
        })
      }
      console.log('deleted successfully')
      res.sendStatus(204)
    }
  })
}




