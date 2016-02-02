var Promise = require('bluebird');
var fs = require('fs');
var watson = require('watson-developer-cloud');
var apiKeys = require('../../config/localConfig.js');

// var speechToText = watson.speech_to_text(apiKeys.watsonCredentials);
var speechToText = watson.speech_to_text({
  username: apiKeys.watsonUsername,
  password: apiKeys.watsonPassword,
  version: 'v1', 
  url: "https://stream.watsonplatform.net/speech-to-text/api"
})

var getText = function(data) {
  var results = [];
  data.forEach(function(item) {
    results.push(item['results'][0]['alternatives'][0]['transcript']);
  });
  return results.join('');
};

module.exports.watsonSpeechToText = function(audioFile) {
  return new Promise(function(resolve, reject){
    var text = [];
    var results = [];
    var params = {
      content_type: 'audio/wav',
      timestamps: true,
      continuous: true
    };
    console.log('running watsonAnalysis');
    
    //create stream
    var recognizeStream = speechToText.createRecognizeStream(params);
    //pipe in audio

    fs.createReadStream(audioFile).pipe(recognizeStream);
    // to get strings instead of Buffers from `data` events
    recognizeStream.setEncoding('utf8');
    recognizeStream.on('results', function(e){
      if(e.results[0].final) {
        results.push(e);
      }
    });

    recognizeStream.on('error', function(err) {
      console.log('Error writing to transcript.json: ' + err);
    });

    recognizeStream.on('connection-close', function() {
      var watsonResults = results;
      var transcript = getText(watsonResults);
      //TODO: save watsonResults to db
      resolve(transcript);
    });
  });
};

