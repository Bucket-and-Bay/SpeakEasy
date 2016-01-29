var Promise = require('bluebird');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var fs = require('fs');
var watson = require('watson-developer-cloud');

var speechToText = watson.speech_to_text({
  username: "e2d415ae-2afe-433d-9964-9c68addb8056",
  password: "1o7EBDH1sxxB",
  url: "https://stream.watsonplatform.net/speech-to-text/api"
});

/*
getAudio(videoURL)
  .then(watsonSpeechToText, function() { console.log('rejected') });
  */

module.exports.getAudio = function(videoURL) {
  return new Promise(function(resolve, reject){
    var wavFile = path.join(__dirname + '/wavFiles/' + 'file.wav');
    ffmpeg(videoURL)
      .output(wavFile)
      .on('end', function(){
        console.log('getAudio resolved');
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
    recognizeStream.setEncoding('utf8');
    recognizeStream.on('results', function(e){
      if(e.results[0].final) {
        results.push(e);
      }
    });

    recognizeStream.on('error', function(err) {
      util.handleError('Error writing to transcript.json: ' + err);
    });

    recognizeStream.on('connection-close', function() {
      var transcriptFile = path.join(__dirname + '/wavFiles/' + 'transcript.json');

      fs.writeFile(transcriptFile, JSON.stringify(results), function(err) {
        if (err) {
          util.handleError(err);
        }
        //TODO: get text from transcriptFile and pass as parameter to resolve
        resolve(text);
      });
    });
  });
};




