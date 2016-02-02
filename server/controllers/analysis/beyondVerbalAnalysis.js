var Promise = require('bluebird');
var apiKeys = require('../../config/config.js');
var request = require('request-promise');
var path = require('path');
var querystring = require('querystring');
var requests = require('request');
var fs = require('fs');

/*
  http://www.beyondverbal.com/api-quick-integration-guide/
  Beyond Verbal Analysis includes:
    Temper value & group
    Valence value & group
    Arousal value & group
    Audio quality value & group
    Mood w/ phraseID & mood group
    Composite Mood w/ phraseID & composite mood group
*/

var audioFile = path.join(__dirname + '/wavFiles/' + 'file.wav');
var options = {
  url: {
    tokenUrl: 'https://token.beyondverbal.com/token',
    serverUrl: 'https://apiv3.beyondverbal.com/v3/recording/'
  },
  apiKey: apiKeys.beyondVerbalKey,
  token: '',
  interval: 0
};
// 1. Authentication POST request w/ API key to get auth token
function authenticate(audioFile) {
  console.log('authenticate line 29 called');
  console.log('url token: ', options.url.tokenUrl);

  var optionsAuth = {
    method: 'POST',
    url: options.url.tokenUrl,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: querystring.stringify({
      grant_type: "client_credentials",
      apiKey: options.apiKey
    })
  }
  request(optionsAuth)
    .then(function(data, err) {
      if (err) { console.log('error', err) };
      var token = JSON.parse(data);
      console.log('token', token);
      analyzeFile(options.apiKey, audioFile, token);
    });
};
//2. Start POST request w/ auth token to initialize analysis session
function analyzeFile(apiKey, content, token) {
  console.log('analyzeFile line 49 called');
  var startUrl = options.url.serverUrl + "start";
  console.log('url: ' + startUrl + ' token: ' + options.token);

  var optionsAF = {
    method: 'POST',
    url: startUrl,
    headers: {
      'Authorization': "Bearer " + options.token
    },
    body: {
      dataFormat: { type: "WAV" },
    },
    json: true
  }

  request(optionsAF)
    .then(function(data, err) {
      if (err) { console.log('Error: ', err) }
      var recID = data.recordingId ? data.recordingId : JSON.parse(data).recordingId;
      upstreamRequest(recID, content, options.token);
    });
}
//3. if response.status is 'success' then Upstream POST request w/ 
//   auth token and wav file to get response(response.analysisSegments)
function upstreamRequest(recID, wavFile, token) {
  var content;
  console.log('line 84 upstreamRequest called. recID: ', recID);
  var upstreamUrl = options.url.serverUrl + recID;
  fs.readFile(wavFile, function(err, data) {
    console.log('readfile called line 88');
    if (err) { 
      console.log('error reading file: ', err) 
    } else {
      var content = data;
      console.log('wavFile content:', content);
      console.log('readfile ended');
      sendRequest(upstreamUrl, data);      
    }
  });
}
function sendRequest(url, data){
  console.log(options.token, 'token');
  var optionsUR = {
    method: 'POST',
    url: url,
    headers: {
      'Authorization': "Bearer " + options.token
    },
    body: data
  };
  console.log(request, 'line 114');
  request(optionsUR)
    .then(function(data){
      console.log(data, 'DATA FROM UPSTREAM REQUEST');
      getAnalysis(recID);
    })
    .catch(function(err){
      console.log('Err from upstreamRequest', err);
    });
}
// 4. Analysis GET request w/ auth token and recording id to get full analysis
function getAnalysis(recID, interval) {
  console.log('getAnalysis line 113 called');
  var pTimer;
  var analysisUrl = options.url.serverUrl + recID + '/analysis?fromMs=' + options.interval;
  var optionsGA = {
    method: 'GET',
    url: analysisUrl,
    headers: { 'Authorization': "Bearer " + options.token },
  }
  interval = interval || 10000;
  pTimer = setInterval(function() {
    console.log('pTimer interval started line 98')
    request(optionsGA)
      .then(function(res, err) {
        res = JSON.parse(res);
        console.log('ATTEMPTING getAnalysis res', res);
        if (res.result.sessionStatus === "Done") {
          console.log('getAnalysis res DONE', res);
          if (pTimer) {
            clearInterval(pTimer);
          }
        }
      });
        //TODO: save to results to db
    }, interval);
}

module.exports.beyondVerbalAnalysis = function(audioFile) {
  console.log('beyondVerbalAnalysis called line 119');
  authenticate(audioFile)
  //FOR TESTING:
  // analyzeFile(options.apiKey, audioFile, options.token);
  // upstreamRequest(recID, audioFile, options.token);
  // getAnalysis('d8e6a4a5-a59f-43ad-98c1-fd963e1f8f80');
}







