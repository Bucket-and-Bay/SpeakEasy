var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();
var user = require('./controllers/user.controller.js');
var audio = require('./controllers/audio.controller.js');
var path = require('path');
var wavFile = path.join(__dirname + '/controllers/record/');
var multer  = require('multer')
var upload = multer({ dest: wavFile })
var video = require('./controllers/video.controller.js');

//Routes to Analyze videos
router.post('/api/record', upload.any(), function(req,res){
  var analysisData = req.body;  
  var audioFile = wavFile+req.files[0].filename;
  analysis.analyze(analysisData, req.session.user, audioFile);
  res.sendStatus(200);
})
router.post('/api/analyze', function(req, res){
  analysis.analyze(req.body, req.session.user);
  res.status(201);
  res.send("Your video has been successfully uploaded. You will be notified when your analysis is ready.");
});

//Routes to fetch / delete dashboard and analysis page data
router.get('/api/fetchAnalyses', function(req,res){
  analysis.fetchAnalyses(req.session.user, res);
});
router.get('/api/getAnalysisById/:analysisID', analysis.getAnalysisData);
router.post('/api/delete', analysis.delete)

//Routes for Public / Private videos and commenting
router.get('/api/getPublicVideos', video.getPublicVideos)
router.put('/api/updatePrivacy/:id', function(req, res) {
  video.updateVideo(req.body, res);
});
router.get('/api/getComments/:videoId', function(req, res) {
  video.getComments(req.params.videoId, res);
})
router.put('/api/addComment', function(req, res) {
  console.log('add comment put route called ', req.body);
  console.log('add comment route ', req.params);
  video.addComment(req.params, req.body, res);
})

//Routes for user authentication
router.post('/user/login', user.login)
router.post('/user/signup', user.createUser)
router.get('/user/logout', user.logout);

module.exports = router;
