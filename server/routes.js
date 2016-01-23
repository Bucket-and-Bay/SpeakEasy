var express = require('express');
var analysis = require('./controllers/analysis/analysis.js');
var router = express.Router();

// eventually use Auth


router.get('/api/analyze', analysis.getVideo);

module.exports = router;
