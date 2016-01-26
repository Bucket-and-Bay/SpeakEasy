var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();

// eventually use Auth


router.post('/api/analyze', function(req, res){
  console.log('anon req.body: ', req.body);
  analysis.getVideo(req.body.shortcode, res);
});

module.exports = router;
