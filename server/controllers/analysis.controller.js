var mongoose = require('mongoose');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');
var eventEmitter = require('./events.controller.js')

// var shortcode = 'vhhl';

module.exports.analyze = function (shortcode, response, currentUser, title) {
  var thumbnail, url;

  getVideo(shortcode, response);

  eventEmitter.on('streamable', function(data){
    thumbnail = data.thumbnail_url;
    url = data.files.mp4.url;
    videoAnalyzer.postVideoForAnalysis(url)
  });

  eventEmitter.on('kairos', function(response){

     var analysis = new Analysis ({
        videoUrl : url,
        // userID   : currentUser._id,
        // date     : {type: Date, default: Date.now},
        title    : title || '',
        videoEmotionAnalysis : JSON.stringify(response)
      });
     console.log('ANALYSIS', analysis);
     analysis.save(function(err){
       console.log('in save method');
        if(err){
          console.log(err);
        }else{
          console.log("Analysis successfully saved.");
        }
     });
     Analysis.find(function(err, docs){
      if(!err){
        console.log('RETURNED ANALYSIS', docs);
      }else{
        console.log(err);
      }
    });
  });


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

