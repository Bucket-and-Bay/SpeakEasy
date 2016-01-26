var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
  username      : String,
  password      : String,
  firstName     : String,
  lastName      : String
});

module.exports = mongoose.model('User', UserSchema);