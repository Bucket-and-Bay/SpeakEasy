var express = require('express');
var analysis = require('./controllers/analysis.controller.js');
var router = express.Router();

// eventually use Auth


router.post('/api/analyze', function(req, res){
  analysis.analyze(req.body.shortcode, res);
});

module.exports = router;
