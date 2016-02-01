var Promise = require('bluebird');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var path = require('path');
var watsonAnalysis = require('./analysis/watsonAnalysis.js');
var alchemy = require('./analysis/alchemyAnalysis.js');

var extractAudio = function(videoURL, jobID) {
  return new Promise(function(resolve, reject){
    var wavFile = path.join(__dirname + '/wavFiles/' + jobID+'.wav');
    ffmpeg(videoURL)
      .output(wavFile)
      .on('end', function(){
        console.log('extractAudio resolved');
        resolve(wavFile);
      })
      .on('error', function(err){
        reject(err);
      })
      .run();
  })
};

module.exports.audioAnalysis = function(videoURL, jobID){
  extractAudio(videoURL, jobID)
  .then(function(wavFile){
    // beyondVerbal(wavFile);              //save beyondVerbalResults to db
    console.log('line 10 extractAudio promise');
    watsonAnalysis.watsonSpeechToText(wavFile)         //save watsonResults to db
      .then(function(watsonResults){
        fs.unlink(wavFile);
        alchemy.alchemyAnalysis(watsonResults,jobID); //save alchemyResults to db
      })
  });
};






