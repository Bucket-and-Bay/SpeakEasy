var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('./routes');
var app = express();
var port = process.env.PORT || 3000;

// if (process.env.NODE_ENV !== 'production') {
  mongoose.connect('mongodb://localhost/speakEasy');
// } else {

// }

// app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

///api/analyze

<<<<<<< 71e4e8799d86e39a96ce4cdd5c80d4d0e6f9f5fe
app.use(express.static(__dirname + '../../client/public'));
app.listen(port, function () {
  console.log('Listening on port: ', port);
});

app.use('/', router);

