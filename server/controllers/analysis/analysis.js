var https = require('https');
var request = require('request-promise');
var videoAnalyzer = require('./videoAnalyzer.js');
// var shortcode = 'vhhl';


module.exports.getVideo = function (shortcode, response) {
  request('https://api.streamable.com/videos/'+shortcode)
    .then( function (res, err) {
    if (err) {
      console.log('ERROR', err);
    } else {
      var data = JSON.parse(res);
      videoAnalyzer.postVideoForAnalysis(data.files.mp4.url, response);
    }
  });
};

