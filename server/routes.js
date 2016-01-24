var express = require('express');
var analysis = require('./controllers/analysis/analysis.js');
var router = express.Router();

// eventually use Auth


router.post('/api/analyze', function(req){
  console.log('anon req.body: ', req.body);

  analysis.getVideo(req.body.shortcode);
});

module.exports = router;
