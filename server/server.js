var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('./routes');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json({type: 'application/*+json'}));


///api/analyze

app.use(express.static(__dirname + './../client'));
app.listen(port, function () {
  console.log('Listening on port: ', port);
});

app.use('/', router);

