var Promise = require('bluebird');
var shortid = require('shortid');
var FormData = require('form-data');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var exec = require('child_process').exec;
var all = require('./analysis.controller.js');

module.exports.merge = function(req, audioFile, videoFile){
  var randomID = shortid.generate();
  mergeAudioAndVideo(audioFile, videoFile, randomID)
    .then(function(mergedFile){
      console.log('merged audio and video file COMPLETE');
      uploadToStreamable(mergedFile)
        .then(function(shortcode){
          console.log('streamable video uploaded');
          fs.unlink(mergedFile);
          req.body.shortcode = shortcode;
          all.analyze(req.body, req.session.user)
        })
    });
}


function mergeAudioAndVideo (audioFile, videoFile, uniqID){
  return new Promise (function(resolve, reject){
    var mergedFile =path.join(__dirname + '/wavFiles/' + uniqID + 'merged.webm');
    //-itsoffset takes an argument which is a duration  (hr:min:sec) to offset the file immediately before it.
    // var command = "ffmpeg -i " + audioFile + ' -strict -2 ' + videoFile + " " + mergedFile; 
    var command = "ffmpeg -i " + audioFile + " -itsoffset -00:00:01 -i " + videoFile + " -map 0:0 -map 1:0 " + mergedFile;
    console.log('merging audio and video files')
    exec(command, function (error, stdout, stderr) {
        if (stdout) console.log(stdout, 'stdout');
        if (stderr) console.log(stderr, 'stderr');
        if (error) {
          console.log(error, 'merge error');
        } else {
          console.log('complete merge');
          fs.unlink(audioFile);
          fs.unlink(videoFile);
          resolve(mergedFile);
        }
    });
  });
};

function uploadToStreamable(file){
  return new Promise(function(resolve, reject){  
    var form = new FormData();
    form.append('file', fs.createReadStream(file))
    form.submit('https://api.streamable.com/upload', function(err, res){
      if(err){
        reject('error submitting to streamable')
      } else {
        var string = ''
        res.on('data', function(chunk){
          string += chunk
        })
        res.on('end', function(){
          console.log(string, 'response from streamable');
          resolve(JSON.parse(string).shortcode);
        })
      }
    })
  })
}