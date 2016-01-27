var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();
var user = require('./controllers/user.controller.js');

// eventually use Auth


router.post('/api/analyze', function(req, res){
  console.log(req.session.user);
  analysis.analyze(req.body.shortcode, req.session.user);
  res.status(201);
  res.send("Your video has been successfully uploaded. You will be notified when your analysis is ready.");
});

router.get('/api/getAnalysis', function(req,res){
  analysis.getAnalysisData(req.body._id, response);
});

router.post('/user/login', function(req, res){
	user.login(req, res);
})

router.post('/user/signup', function(req, res){
	user.createUser(req, res);
})

router.get('/user/logout', function(req, res){
  user.logout(req, res);
})
module.exports = router;
