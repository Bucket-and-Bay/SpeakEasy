var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
  username      : String,
  password      : String,
  firstName     : String,
  lastName      : String,
  videoAnalyses : [{
    videoID:{
      type: ObjectId,
       ref: 'Analysis'
     },
      thumbnailUrl : String,
      date         : {type: Date, default: Date.now},
      title        : String
    }]
});

module.exports = mongoose.model('User', UserSchema);