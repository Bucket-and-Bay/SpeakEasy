var mongoose = require('mongoose');
var request = require('request-promise');
var Promise = require('bluebird');
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

module.exports.merge = function(req, audioFile, videoFile){
  var videoLocation = path.join(__dirname + '/wavFiles/testfile.webm');
  var audioLocation = path.join(__dirname + '/wavFiles/testfile.wav');

  Promise.all([ffmpegWrite(videoFile, videoLocation), ffmpegWrite(audioFile, audioLocation)])
    .then(function(){
      console.log('SAVED');
      mergeAudioAndVideo(audioFile, videoFile)
      .then(function(mergedFile){
        console.log('MERGED');
        // uploadToStreamable(mergedFile)
        //   .then(function(shortcode){
        //     console.log('UPLOADED TO STREAMABLE', shortcode);
        //     module.exports.analyze(req.body, req.session.user, shortcode);
        //   });
      });
    });
}

function mergeAudioAndVideo (audioFile, videoFile){
  return new Promise (function(resolve, reject){
    var mergedFile =path.join(__dirname + '/wavFiles/merged.webm');
    //-itsoffset takes an argument which is a duration  (hr:min:sec) to offset the file immediately before it.
    var command = "ffmpeg -i " + audioFile + " -itsoffset -00:00:01 -i " + videoFile + " -map 0:0 -map 1:0 " + mergedFile; 
    console.log('AUDIO FILE', audioFile);
    console.log('VIDEO FILE', videoFile);
    console.log('MERGED FILE', mergedFile); 
    exec(command, function (error, stdout, stderr) {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);

        if (error) {
            console.log('exec error: ' + error);

        } else {
            fs.unlink(audioFile);
            fs.unlink(videoFile);
            resolve(mergedFile);
            
        }
    });
  });
};

function ffmpegWrite (file, location){
  return new Promise(function(resolve, reject){
   ffmpeg(file)
    .output(location)
    .on('end', function(){
      resolve(file);
    })
    .on('error', function(err){
      console.log(err);
    })
    .run();
  });
}

function uploadToStreamable (file){
 return new Promise(function(resolve, reject){
  var formData = new FormData();
  formData.append('file', video);
  request.post('https://api.streamable.com/upload', formData)
    .then(function(response){
      console.log(response.data.shortcode, 'line 10 in helper')
      resolve(response.data.shortcode);
    })
    .catch(function(err){
      throw err;
    })
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




