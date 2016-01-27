var mongoose = require('mongoose');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');
var eventEmitter = require('./events.controller.js')

// var shortcode = 'vhhl';

module.exports.analyze = function (shortcode, currentUser) {
  var thumbnail, url;

  getVideo(shortcode);

  eventEmitter.on('streamable', function(data){
    thumbnail = data.thumbnail_url;
    url = data.files.mp4.url;
    videoAnalyzer.postVideoForAnalysis(url)
  });

  eventEmitter.on('kairos', function(response){

     var analysis = new Analysis ({
        videoUrl : url,
        username   : currentUser,
        thumbnail_url : thumbnail,
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


function getVideo(shortcode) {
  request('https://api.streamable.com/videos/'+shortcode)
    .then( function (res, err) {
    if (err) {
      console.log('ERROR', err);
    } else {
      var data = JSON.parse(res);
      //Check if valid video url, because streamable stores other formts
      if(data.thumbnail_url===null){
        console.log('Checking with streamable.');
        setTimeout(function(){getVideo(shortcode)}, 5000);
      }else{
        eventEmitter.emit('streamable',data);
        //return data;
      }
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
  console.log(currentUser);
  Analysis.find({username: currentUser},
    '_id videoUrl date title thumbnail_url')
  .then(function (data) {
    var analysisData = JSON.stringify(data);
    console.log(analysisData);
    response.send(200, analysisData);
  });
};
