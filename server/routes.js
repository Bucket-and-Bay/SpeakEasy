var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();
var user = require('./controllers/user.controller.js');
var audio = require('./controllers/audio.controller.js');
var path = require('path');
var wavFile = path.join(__dirname + '/controllers/record/');
var webmFile = path.join(__dirname+'/controllers/record/');
var multer  = require('multer')
var upload = multer({ dest: wavFile })
var video = require('./controllers/video.controller.js');

//Routes to Analyze videos
router.post('/api/record', upload.any(), function(req,res){
  var audioFile = wavFile+req.files[0].filename;
  var videoFile = webmFile+req.files[1].filename;
  analysis.merge(req, audioFile, videoFile);
  res.sendStatus(201);
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
  res.send('PUT request to update privacy');
});
router.get('/api/getComments/:videoId', function(req, res) {
  video.getComments(req.params.videoId, res);
})
router.put('/api/addComment', function(req, res) {
  video.addComment(req.body, req.session.user);
  res.send('PUT request to add comment');
})

//Routes for user authentication
router.post('/user/login', user.login)
router.post('/user/signup', user.createUser)
router.get('/user/logout', user.logout);

module.exports = router;
