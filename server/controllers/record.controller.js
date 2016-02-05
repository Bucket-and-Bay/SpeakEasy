var Promise = require('bluebird');
var analysis = require('./analysis.controller.js');
var util = require('./utils.js');
var Analysis = require('../models/analysis.model.js');
var audio = require('./audio.controller.js');
var kairos = require('./analysis/videoAnalyzer.js');
var beyondVerbal = require('./analysis/beyondVerbalAnalysis.js');

module.exports.recordAnalysis = function(audioFile, data, user){ 
  console.log(typeof audioFile, 'is this  astring?')
  var shortcode = data.video;
  var analysis = new Analysis ({username : user, title: data.title, description: data.description});
  util.poll('https://api.streamable.com/videos/'+shortcode, 30000, streamableDoneProcessing, 'streamable'+shortcode)
    .then(function(res){
      var videoURL = 'https:'+res.files.mp4.url;
      analysis.thumbnail_url = 'https:'+res.thumbnail_url;
      analysis.videoUrl = 'https:'+res.files.mp4.url;
      Promise.all([kairos.videoAnalysis(videoURL), audio.audioAnalysis(audioFile, shortcode)])
        .then(function(data){
          analysis.beyondVerbalAnalysis = [data[1][0], data[1][1]];
          analysis.watsonAnalysis = data[1][3];
          analysis.alchemyAnalysis = data[1][2];
          analysis.kairosAnalysis = data[0];
          analysis.audioFile = audioFile;
          analysis.isRecorded = true;
          analysis.save(function(err, data){
            if(err){
              console.log(err)
            } else {
              console.log('Analysis saved')
            }
          })
        })
    })

};

function streamableDoneProcessing (data){return data.percent === 100;};
