var https = require('https');
var request = require('request-promise');
var videoAnalyzer = require('./videoAnalyzer.js');
var shortcode = 'ocf1';


module.exports.getVideo = function () {
  request('https://api.streamable.com/videos/'+shortcode)
    .then( function (res, err) {
    if (err) {
      console.log('ERROR', err);
    } else {
      var data = JSON.parse(res);
      videoAnalyzer.postVideoForAnalysis(data.files.mp4.url);
    }
  });
};

