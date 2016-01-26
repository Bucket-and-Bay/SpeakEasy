var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
  username      : String,
  password      : String,
  firstName     : String,
  lastName      : String,
  analyses : [{type: ObjectId,ref: 'Analysis'}]
});

module.exports = mongoose.model('User', UserSchema);