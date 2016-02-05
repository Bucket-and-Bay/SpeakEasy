var Promise = require('bluebird');
var analysis = require('./analysis.controller.js');
var util = require('./utils.js');
var Analysis = require('../models/analysis.model.js');
var audio = require('./audio.controller.js');
var kairos = require('./analysis/videoAnalyzer.js');
var beyondVerbal = require('./analysis/beyondVerbalAnalysis.js');

module.exports.recordAnalysis = function(audioFile, data, user){ 
  var shortcode = data.video;
  var analysis = new Analysis ({username : user, title: data.title, description: data.description});
  util.poll('https://api.streamable.com/videos/'+shortcode, 10000, streamableDoneProcessing, 'streamable'+shortcode)
    .then(function(res){
      var videoURL = 'https:'+res.files.mp4.url;
      Promise.all([kairos.videoAnalysis(videoURL), audio.watsonAndAlchemy(audioFile), beyondVerbal.beyondVerbalAnalysis(audioFile)])
        .then(function(data){
          console.log(data[0], "KAIROS DATA");
          console.log(data[1][0], "ALCHEMY");
          console.log(data[1][1], "WATSON");
          console.log(data[3], 'BEYOND VERBAL')
        })
    })

};


function streamableDoneProcessing (data){return data.percent === 100;}
