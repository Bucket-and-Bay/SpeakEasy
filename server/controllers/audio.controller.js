var Promise = require('bluebird');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var watsonAnalysis = require('../config/localConfig.js');


extractAudio(videoURL)
  .then(function(wavFile){
    beyondVerbal(wavFile);              //save beyondVerbalResults to db
    watsonAnalysis.watsonSpeechToText(wavFile)         //save watsonResults to db
      .then(function(watsonResults){
        alchemyAnalysis(watsonResults); //save alchemyResults to db
      })
  });

  

module.exports.extractAudio = function(videoURL) {
  return new Promise(function(resolve, reject){
    var wavFile = path.join(__dirname + '/wavFiles/' + 'file.wav');
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






