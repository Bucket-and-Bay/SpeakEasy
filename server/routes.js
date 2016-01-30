var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();
var user = require('./controllers/user.controller.js');
var audio = require('./controllers/audio.controller.js');

// eventually use Auth


router.post('/api/analyze', function(req, res){
  console.log(req.session.user);
  analysis.analyze(req.body.shortcode, req.session.user);
  res.status(201);
  res.send("Your video has been successfully uploaded. You will be notified when your analysis is ready.");
});

router.get('/api/getAnalysisById/:analysisID', function(req,res){
  analysis.getAnalysisData(req.params.analysisID, res);
});

router.get('/api/fetchAnalyses', function(req,res){
  analysis.fetchAnalyses(req.session.user, res);
});

router.get('/api/speechToText/:videoURL', function(req, res){
  console.log('get req received');
  audio.audioAnalysis(req.params.videoURL, res);
});


router.post('/user/login', user.login)
router.post('/user/signup', user.createUser)
router.get('/user/logout', user.logout);

module.exports = router;
