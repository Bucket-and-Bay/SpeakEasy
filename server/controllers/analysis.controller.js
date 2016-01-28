var mongoose = require('mongoose');
var request = require('request-promise');
var Analysis = require('../models/analysis.model.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');
var eventEmitter = require('./events.controller.js');
var notify = require('./notification.controller.js');

var streamable=false;

module.exports.analyze = function (shortcode, currentUser) {
  var thumbnail, url, counter=0;

  streamable = false; 
  
  getVideo(shortcode);

  eventEmitter.on('streamable', function(data){
    console.log('Received streamable event');
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

     analysis.save(function(err){
        if(err){
          console.log(err);
        }else{
          counter++;
          console.log('You analysis has been saved:',counter);
          notify.byText(analysis.username);
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
        console.log("Polling streamable for video");
        setTimeout(function(){getVideo(shortcode)}, 30000);
      }else{
        if (!streamable){
        streamable=true;
        console.log('streamable is now true. event emitted'); 
        eventEmitter.emit('streamable',data);
        }
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
  Analysis.find({username: currentUser},
    '_id videoUrl date title thumbnail_url')
  .then(function (data) {
    var analysisData = JSON.stringify(data);
    response.send(200, analysisData);
  });
};
