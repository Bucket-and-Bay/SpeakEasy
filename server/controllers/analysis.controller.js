var mongoose = require('mongoose');
var Promise = require('bluebird');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
var videoAnalyzer = Promise.promisifyAll(require('./analysis/videoAnalyzer.js'));

// var shortcode = 'vhhl';

module.exports.analyze = function (shortcode, response, currentUser, title) {
  var thumbnail, url;

  videoAnalyzer.getVideo(shortcode, response)
    .catch(function(error){
      console.log("getVideo failed", error);
    })
    .then(function(data){
       console.log(data);
       thumbnail = data.thumbnail_url;
       url = data.files.mp4.url;
       return videoAnalyzer.postVideoForAnalysis(url);
    })
    .catch(function(error){
      console.log('videoAnalyzer failed', error);
    })
    // .then(function(videoId){
    //   console.log(videoId);
    //   return videoAnalyzer.getVideoAnalysis(videoId)
    // })
    .then(function(videoData){
      console.log('VIDEODATA', videoData);
       var analysis = new Analysis ({
         videoUrl : url,
         // userID   : currentUser._id,
         date     : {type: Date, default: Date.now},
         title    : title || '',
         videoEmotionAnalysis : videoData
       });
       analysis.save(function(err){
         if(err){
           return err;
         }else{
           console.log("Analysis successfully saved.");
         }
       });
  });
};


