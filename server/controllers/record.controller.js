var Promise = require('bluebird');
var analysis = require('./analysis.controller.js');
var util = require('./utils.js');
var Analysis = require('../models/analysis.model.js');

module.exports.recordAnalysis = function(audioFile, data, user){ 
  var shortcode = data.video;
  var analysis = new Analysis ({username : user, title: data.title, description: data.description});
  util.poll('https://api.streamable.com/videos/'+shortcode, 10000, streamableDoneProcessing, 'streamable'+shortcode)
    .then(function(res){
      var videoURL = 'https:'+res.files.mp4.url;

    })

};






function streamableDoneProcessing (data){return data.percent === 100;}