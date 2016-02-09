var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var AnalysisSchema = new mongoose.Schema({
  videoUrl : String,
  username : String,
  date     : {type: Date, default: Date.now},
  title    : String,
  description: String,
  thumbnail_url : String,
  isPrivate: Boolean,
  comments : [{ //TODO: we may need a comments model
    text     : String,
    date     : {type: Date, default: Date.now},
    username : String
  }],
  kairosAnalysis      : mongoose.Schema.Types.Mixed,
  beyondVerbalAnalysis: mongoose.Schema.Types.Mixed,
  watsonAnalysis      : mongoose.Schema.Types.Mixed,
  alchemyAnalysis     : mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Analysis', AnalysisSchema);