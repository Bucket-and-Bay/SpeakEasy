var Analysis = require('../models/analysis.model.js');
var mongoose = require('mongoose');

var updateVideo = function(data) {
 var videoId = data.videoId;
 var update = { isPrivate: data.isPrivate };
 Analysis.findByIdAndUpdate(videoId, update, {new: true}, function(err, model) {
   if(err) {console.log('Error updating model: ', err.message)} 
    console.log('Updated Video Privacy to: ', model.isPrivate)
 });
};

module.exports = {
  updateVideo: updateVideo
}
