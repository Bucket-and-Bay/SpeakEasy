var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var videoAnalysisSchema = new mongoose.Schema({
  videoUrl : String,
  userID   : {type: ObjectId, ref: 'User'},
  date     : {type: Date, default: Date.now},
  title    : String,
  comments : [{ //TODO: we may need a comments model
    text     : String,
    date     : {type: Date, default: Date.now},
    username : String
  }],
  analysis : String
});

module.exports = mongoose.model('VideoAnalysis', videoAnalysisSchema);