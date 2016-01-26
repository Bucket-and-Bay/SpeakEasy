var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();
var user = require('./controllers/users/users.js');

// eventually use Auth


router.post('/api/analyze', function(req, res){
  console.log('anon req.body: ', req.body);
  analysis.getVideo(req.body.shortcode, res);
});

router.post('/user/login', function(req, res){

})

router.post('/user/signup', function(req, res){

})
module.exports = router;
