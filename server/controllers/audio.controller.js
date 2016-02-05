var Promise = require('bluebird');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var watsonAnalysis = require('./analysis/watsonAnalysis.js');
var alchemy = require('./analysis/alchemyAnalysis.js');
var beyondVerbal = require('./analysis/beyondVerbalAnalysis.js');
var fs = require('fs');
/*
  Extract audio from video URL to .wav File.
    wav File is sent for analysis to Beyond Verbal & Watson Speech to Text
      results of both are saved to database
    text from watson speech to text is sent to alchemy api
      to get keyword, sentiment and concept analysis
      results are saved to db
    ??personality insights from text??
    ??erase wav and text file??
*/

var extractAudio = function(videoURL, uniqueID) {
  return new Promise(function(resolve, reject){
    console.log("extracting audio")
    var wavFile = path.join(__dirname + '/wavFiles/' + uniqueID + 'file.wav');
    ffmpeg(videoURL)
      .output(wavFile)
      .on('end', function(){
        resolve(wavFile);
      })
      .on('error', function(err){
        reject(err);
      })
      .run();
  })
};

module.exports.audioAnalysis = function(videoURL, uniqueID){
  return new Promise(function(resolve, reject){

    extractAudio(videoURL, uniqueID)
    .then(function(wavFile){
      Promise.all([beyondVerbal.beyondVerbalAnalysis(wavFile), watsonAndAlchemy(wavFile)])
        .then(function(data){
          console.log('Audio Analysis data done!!!!!!');
          resolve([data[0][0], data[0][1], data[1][0], data[1][1]]);
          fs.unlink(wavFile, function(err){
            if(err){
              console.log(err)
            } else {
              console.log('deleted extracted audio file')
            }
          })
        })
    });
  })
};



var watsonAndAlchemy = function(wavFile){
  return new Promise(function(resolve, reject){
    watsonAnalysis.watsonSpeechToText(wavFile)       //save watsonResults to db
      .then(function(watsonResults){
        alchemy.alchemyAnalysis(watsonResults)
          .then(function(alchemyResults){
            resolve([alchemyResults, watsonResults])
          }); //save alchemyResults to db
      })
  })
};
