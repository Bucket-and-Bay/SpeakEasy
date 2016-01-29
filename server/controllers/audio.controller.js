var Promise = require('bluebird');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var fs = require('fs');
var watson = require('watson-developer-cloud');
var apiKeys = '../config/localConfig.js';

var speechToText = watson.speech_to_text(apiKeys.watsonCredentials);

/*
extractAudio(videoURL)
  .then(watsonSpeechToText, function() { console.log('rejected') });
  */

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

module.exports.watsonSpeechToText = function(audioFile) {
  return new Promise(function(resolve, reject){
    var results = [];
    var params = {
      content_type: 'audio/wav',
      timestamps: true,
      continuous: true
    };
    
    //create stream
    var recognizeStream = speechToText.createRecognizeStream(params);
    //pipe in audio
    fs.createReadStream(audioFile).pipe(recognizeStream);
    //saves text only to file
    recognizeStream.pipe(fs.createWriteStream(__dirname + '/wavFiles/' + 'transcription.txt'));
    // to get strings instead of Buffers from `data` events
    recognizeStream.setEncoding('utf8');
    recognizeStream.on('results', function(e){
      if(e.results[0].final) {
        results.push(e);
      }
    });

    recognizeStream.on('error', function(err) {
      console.log('Error writing to transcript.json: ' + err));
    });

    recognizeStream.on('connection-close', function() {
      var verbalAnalysis = JSON.stringify(results);
      resolve(verbalAnalysis);
    });
  });
};




