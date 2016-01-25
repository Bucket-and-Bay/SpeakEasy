var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('./routes');
var app = express();
var port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  mongoose.connect('mongodb://localhost/speakEasy');
} else {

}

// app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

///api/analyze

app.use(express.static(__dirname + './../client'));
app.listen(port, function () {
  console.log('Listening on port: ', port);
});

app.use('/', router);

