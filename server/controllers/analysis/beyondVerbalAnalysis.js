var Promise = require('bluebird');
var apiKeys = require('../../config.js');
var request = require('request-promise');

/*
  http://www.beyondverbal.com/api-quick-integration-guide/
  Beyond Verbal Analysis includes:
    Temper value & group
    Valence value & group
    Arousal value & group
    Audio quality value & group
    Mood w/ phraseID & mood group
    Composit Mood w/ phraseID & composite mood group
*/

var options = {
  url: {
    tokenUrl: 'https://token.beyondverbal.com/token',
    serverUrl: 'https://apiv3.beyondverbal.com/v3/recording'
  },
  apiKey: apiKeys.beyondVerbalKey,
  token: '',
  interval: 0
};
// 1. Authentication POST request w/ API key to get auth token
function authenticate() {
  console.log('url token: ', options.url.tokenUrl);
  return $.ajax({
    url: options.url.tokenUrl,
    type: "POST",
    dataType: 'text',
    contentType: 'application/x-www-form-urlencoded',
    data: {
      grant_type: "client_credentials",
      apiKey: options.apiKey
    }
  });
};
//2. Start POST request w/ auth token to initialize analysis session
function analyzeFile(apiKey, content, interval) {
  var startUrl = options.url.serverUrl + "start";
  console.log('url: ' + startUrl + ' token: ' + options.token);

  var optionsAF = {
    method: 'POST',
    url: startUrl,
    headers: {'Authorization': "Bearer " + options.token },
    data: JSON.stringify({ dataFormat: { type: "WAV" } }),
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'text'
  }

  request(optionsAF)
    .then(function(data, err) {
      if (err) { console.log('Error: ', err) }
      upstreamRequest(data, content);
    })

}
//3. if response.status is 'success' then Upstream POST request w/ 
//   auth token and wav file to get response(response.analysisSegments)
function upstreamRequest(data, wavFile) {
  var recID = data.recordingId ? data.recordingId : JSON.parse(data).recordingId;
  console.log('recid: ' + recID);
  var upstreamUrl = options.url.serverUrl + recID;
  var optionsUR = {
    method: 'POST',
    url: upStreamUrl,
    headers: { 'Authorization': "Bearer " + options.token },
    data: wavFile,
    contentType: false,
    processData: false,
    dataType: 'text',
  }
  request(optionsUR)
    .then(function(data, err) {
      if (err) { console.log('Error: ', err) }
      getAnalysis(recID);
    })
}
// 4. Analysis GET request w/ auth token and recording id to get full analysis
function getAnalysis(recID) {
  var pTimer = null;
  var analysisUrl = options.url.serverUrl + recID + '/analysis?fromMs=' + options.interval;
  var optionsGA = {
    method: 'GET',
    url: analysisUrl,
    headers: { 'Authorization': "Bearer " + options.token },
  }

  pTimer = setInterval(function() {
    request(optionsGA)
      .then(function(res, err) {
        console.log(res);
        if (res.result.sessionStatus === "Done") {
          if (pTimer) {
            clearInterval(pTimer);
          }
        }
        //TODO: save to results to db
      }, interval);
  });
}

module.exports.beyondVerbalAnalysis = function(audioFile) {
  authenticate()
    .error(function(err){ console.log('error', err) })
    .success(function(data) {
      var token = JSON.parse(data);
      options.token = token.access_token;
      analyzeFile(options.apiKey, audioFile, 7000)
        .err(function(err) { console.log('error', err) })
        .success(function(res) {
          console.log('FINAL RESULTS', res);
        });
    });
}






