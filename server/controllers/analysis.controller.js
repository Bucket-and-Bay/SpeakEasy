var mongoose = require('mongoose');
var Promise = require('bluebird');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
// var videoAnalyzer = Promise.promisifyall(require('./videoAnalyzer.js'));
// var shortcode = 'vhhl';

module.exports = function (shortcode, response, currentUser, title) {
  var thumbnail, url;

  getVideo(shortcode, response)
    .catch(function(error){
      console.log("getVideo failed", error);
    })
    .then(function(data){
       thumbnail = data.thumbnail_url;
       url = data.files.mp4.url;
       return videoAnalyzer.postVideoForAnalysis(url);
    })
    .catch(function(error){
      console.log('videoAnalyzer failed', error);
    })
    .then(function(videoData){
       var analysis = new Analysis ({
         videoUrl : url,
         userID   : currentUser._id,
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


var getVideo = function (shortcode, response) {
  return request('https://api.streamable.com/videos/'+shortcode)
    .then( function (res, err) {
    if (err) {
      console.log('ERROR', err);
    } else {
      var data = JSON.parse(res);
      //Check if valid video url, because streamable stores other formats
      if(data.thumbnail_url===null){
        response.status(400);
        response.send('The video you uploaded is not the correct format. Please upload another video.');
      }else{
        response.status(201);
        response.send("Your video has been successfully uploaded. You will be notified when your analysis is ready.");
        return data;
      }
    }
  });
};