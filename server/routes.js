var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();
var user = require('./controllers/user.controller.js');
var audio = require('./controllers/audio.controller.js');
var record = require('./controllers/record.controller.js');
var path = require('path');
var wavFile = path.join(__dirname + '/controllers/record/');
var multer  = require('multer')
var upload = multer({ dest: wavFile })
var fs = require('fs')
var video = require('./controllers/video.controller.js');

router.post('/api/record', upload.any(), function(req,res){
  var analysisData = req.body;  
  var audioFile = wavFile+req.files[0].filename +'.wav';
  fs.rename(wavFile+req.files[0].filename, audioFile, function(err){
    if(err){
      console.log(err)
    } else{
      record.recordAnalysis(audioFile, analysisData);
    }
  })
  res.sendStatus(200);
})

router.post('/api/analyze', function(req, res){
  analysis.analyze(req.body, req.session.user);
  res.status(201);
  res.send("Your video has been successfully uploaded. You will be notified when your analysis is ready.");
});

router.post('/api/delete', analysis.delete)

router.get('/api/getAnalysisById/:analysisID', function(req,res){
  analysis.getAnalysisData(req.params.analysisID, res);
});

router.get('/api/getPublicVideos', function(req, res){
  video.getPublicVideos(req, res);
})

router.get('/api/fetchAnalyses', function(req,res){
  analysis.fetchAnalyses(req.session.user, res);
});

router.post('/api/speechToText', function(req, res){
  audio.audioAnalysis(req.body.videoURL, res);
});

router.put('/api/updatePrivacy/:id', function(req, res) {
  video.updateVideo(req.body, res);
});


router.post('/user/login', user.login)
router.post('/user/signup', user.createUser)
router.get('/user/logout', user.logout);

module.exports = router;
