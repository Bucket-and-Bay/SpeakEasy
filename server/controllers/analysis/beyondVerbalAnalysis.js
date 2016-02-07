var Promise = require('bluebird');
var apiKeys = require('../../config.js');
var request = require('request-promise');
var path = require('path');
var querystring = require('querystring');
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


var options = {
  url: {
    tokenUrl: 'https://token.beyondverbal.com/token',
    serverUrl: 'https://apiv3.beyondverbal.com/v3/recording/'
  },
  apiKey: apiKeys.beyondVerbalKey,
};
// 1. Authentication POST request w/ API key to get auth token
function authenticate(audioFile) {
  return new Promise(function(resolve, reject){
    console.log('authenticate line 29 called');
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
        if (err) { reject(err, 'beyondVerbal authenticate error') };
        var token = JSON.parse(data);
        resolve(token);
      });
  })
};
//2. Start POST request w/ auth token to initialize analysis session
function analyzeFile(content, token) {
  return new Promise(function(resolve, reject){

    console.log('analyzeFile line 49 called');
    var startUrl = options.url.serverUrl + "start";
    var optionsAF = {
      method: 'POST',
      url: startUrl,
      headers: {
        'Authorization': "Bearer " + token.access_token
      },
      body: {
        dataFormat: { type: "WAV" },
      },
      json: true
    }

    request(optionsAF)
      .then(function(data, err) {
        if (err) { reject(err, "BeyondVerbal Analyze File Reject") }
        var recID = data.recordingId ? data.recordingId : JSON.parse(data).recordingId;
        resolve(recID);
      });
  })
}
//3. if response.status is 'success' then Upstream POST request w/ 
//   auth token and wav file to get response(response.analysisSegments)
function upstreamRequest(recID, wavFile, token) {
  return new Promise(function(resolve, reject){
    console.log('line 84 upstreamRequest called');
    var upstreamUrl = options.url.serverUrl + recID;
    fs.readFile(wavFile, function(err, response) {
      if (err) {
        console.log('error reading file: ', err)
      } else {
        var optionsUR = {
          method: 'POST',
          url: upstreamUrl,
          headers: {
            'Authorization': "Bearer " + token.access_token
          },
          body: response
        };

        request(optionsUR)
          .then(function(data){
            resolve(data)

          })
          .catch(function(err){
            reject(err, 'Err from upstreamRequest');
          });
      }
    });
  })
}

// 4. Analysis GET request w/ auth token and recording id to get full analysis
function getAnalysis(recID, interval, token) {
  return new Promise(function(resolve, reject){

    console.log('getAnalysis line 113 called');
    var pTimer;
    var analysisUrl = options.url.serverUrl + recID + '/analysis?fromMs=' + options.interval;
    var optionsGA = {
      method: 'GET',
      url: analysisUrl,
      headers: { 'Authorization': "Bearer " + token.access_token },
    }
    interval = interval || 10000;
    pTimer = setInterval(function() {
      request(optionsGA)
        .then(function(res, err) {
          res = JSON.parse(res);
          if (res.result.sessionStatus === "Done") {
            resolve(res);
            if (pTimer) {
              clearInterval(pTimer);
            }
          }
        })
        .catch(function(err){
          reject(err, 'Err from Beyond Verbal get Analysis')
        })
          //TODO: save to results to db
      }, interval);
  })
}

module.exports.beyondVerbalAnalysis = function(audioFile) {
  return new Promise(function(resolve, reject){

    authenticate(audioFile)
      .then(function(token){
      analyzeFile(audioFile, token)
        .then(function(recID){
        upstreamRequest(recID, audioFile, token)
          .then(function(upstreamData){
          getAnalysis(recID, 10000, token)
            .then(function(getAnalysisData){
            console.log('DONE WITH BEYONDVERBAL');
            //get Analysisdata
              resolve([getAnalysisData, upstreamData])
          }, function(getAnalysisError){
            reject(getAnalysisError)
          })
        }, function(upstreamError){
          reject(upstreamError)
        })
      }, function(analyzeError){
        reject(analyzeError)
      })
    }, function(authError){
      reject(authError)
    })
  })
  //FOR TESTING:
  // analyzeFile(options.apiKey, audioFile, options.token);
  // upstreamRequest(recID, audioFile, options.token);
  // getAnalysis('d8e6a4a5-a59f-43ad-98c1-fd963e1f8f80');
}







