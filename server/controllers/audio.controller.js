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
    var extractedLocation = path.join(__dirname + '/wavFiles/' + uniqueID + 'file.wav');
    
    ffmpeg(videoURL)
      .output(extractedLocation)
      .on('end', function(){
        resolve(extractedLocation);
      })
      .on('error', function(err){
        reject('extracted audio error');
      })
      .run();
  })
};

module.exports.audioAnalysis = function(videoURL, uniqueID){
  return new Promise(function(resolve, reject){

    extractAudio(videoURL, uniqueID)
    .then(function(wavFile){
      var promises = [beyondVerbal.beyondVerbalAnalysis(wavFile), watsonAndAlchemy(wavFile)]
      Promise.all(promises.map(function(promise){
        return promise.reflect();
      })).then(function(inspections){
        var results = [];
        if(inspections[0].isFulfilled()){
          results[0] = inspections[0].value()[0];
          results[1] = inspections[0].value()[1];
        } 
        if(inspections[1].isFulfilled()){
          results[2] = inspections[1].value()[0];
          results[3] = inspections[1].value()[1];      
        }
        //if Watson gets rejected, then there is no [beyond, beyond, undefined, undefined]
        //if alchemy gets rejected, [beyond, beyond, undefined, watson]
        //if beyond gets rejected, [undefined, undefined, alchemy, watson]
        resolve(results);
        deleteWav(wavFile);
      })
    }, function(extractAudioError){
      reject(extractAudioError);
      deleteWav(wavFile)
    });
  })
};

var deleteWav = function(fileLocation){
  fs.unlink(fileLocation, function(err){
    if(err){
      console.log(err)
    } else {
      console.log('delete extracted audio file from fs')
    }
  })
}

var watsonAndAlchemy = function(wavFile){
  return new Promise(function(resolve, reject){
    watsonAnalysis.watsonSpeechToText(wavFile)       //save watsonResults to db
      .then(function(watsonResults){
        alchemy.alchemyAnalysis(watsonResults).reflect()
          .then(function(alchemyData){
            if(alchemyData.isFulfilled()){
              console.log('alchemy data')
              resolve([alchemyData.value(), watsonResults])
            } else {
              console.log('error alchemy')
              resolve([undefined, watsonResults])
            }
          
          //error catching
          }); //save alchemyResults to db
      }, function(watsonReject){
        reject(watsonReject);
      })
  })
};
