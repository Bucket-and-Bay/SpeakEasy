var mongoose = require('mongoose');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');
var eventEmitter = require('./events.controller.js')

// var shortcode = 'vhhl';

module.exports.analyze = function (shortcode, response, currentUser, title) {
  var thumbnail;

  getVideo(shortcode, response);

  eventEmitter.on('streamable', function(data){
    thumbnail = data.thumbnail_url;
    videoAnalyzer.postVideoForAnalysis(data)
  });

  eventEmitter.on('kairos', function(response){
    console.log('Inside of kairos event');
    // var analysis = new Analysis ({
    //    videoUrl : url,
    //    // userID   : currentUser._id,
    //    date     : {type: Date, default: Date.now},
    //    title    : title || '',
    //    videoEmotionAnalysis : videoData
    //  });
    // analysis.save(function(err){
    //    if(err){
    //      return err;
    //    }else{
    //      console.log("Analysis successfully saved.");
    //    }
    // });
  });

  //var thumbnail, url;

  // videoAnalyzer.getVideo(shortcode, response)
  //   .catch(function(error){
  //     console.log("getVideo failed", error);
  //   })
  //   .then(function(data){
  //      console.log(data);
  //      thumbnail = data.thumbnail_url;
  //      url = data.files.mp4.url;
  //      return videoAnalyzer.postVideoForAnalysis(url);
  //   })
  //   .catch(function(error){
  //     console.log('videoAnalyzer failed', error);
  //   })
  //   // .then(function(videoId){
  //   //   console.log(videoId);
  //   //   return videoAnalyzer.getVideoAnalysis(videoId)
  //   // })
  //   .then(function(videoData){
  //     console.log('VIDEODATA', videoData);
  //      var analysis = new Analysis ({
  //        videoUrl : url,
  //        // userID   : currentUser._id,
  //        date     : {type: Date, default: Date.now},
  //        title    : title || '',
  //        videoEmotionAnalysis : videoData
  //      });
  //      analysis.save(function(err){
  //        if(err){
  //          return err;
  //        }else{
  //          console.log("Analysis successfully saved.");
  //        }
  //      });
  // });
};


function getVideo(shortcode, response) {
  request('https://api.streamable.com/videos/'+shortcode)
    .then( function (res, err) {
    if (err) {
      console.log('ERROR', err);
    } else {
      var data = JSON.parse(res);
      //Check if valid video url, because streamable stores other formts
      if(data.thumbnail_url===null){
        console.log('Checking with streamable.');
        setTimeout(function(){getVideo(shortcode, response)}, 5000);
      }else{
        response.status(201);
        response.send("Your video has been successfully uploaded. You will be notified when your analysis is ready.");
        eventEmitter.emit('streamable',data);
        //return data;
      }
    }
  });
};

