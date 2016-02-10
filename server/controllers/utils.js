var Promise = require ('bluebird');
var request = require('request-promise')
var eventEmitter = require('./events.controller.js');
var videoAnalyzer = require('./analysis/videoAnalyzer.js');

module.exports.poll = function(options, interval,condition){
 return new Promise (function(resolve, reject){
  function sub (){
  request(options)
    .then(function(res, err){
      var data = JSON.parse(res);
      if(err){
        reject(err);
      }else{
        if(condition && condition(data)){
          console.log(data);
          resolve(data);
        }else{
          console.log('Polling');
          setTimeout(function(){sub(options, interval, condition);}, interval);
        }
      }
    });
  };
  sub();
  });

 }


module.exports.kairosData = function(videoEmotionAnalysis) {             
  var attentionData = [];
  var negativeData = [];
  var surpriseData = [];
  var smileData = [];

  videoEmotionAnalysis.forEach(function(item) {
    attentionData.push([item.person.time, item.person.emotions.attention]);
    negativeData.push([item.person.time, item.person.emotions.negative]);
    surpriseData.push([item.person.time, item.person.emotions.surprise]);
    smileData.push([item.person.time, item.person.emotions.smile]);
  });
  return  {
            title: {
              text: 'Video Emotional Analysis'
            },
            yAxis: {
              title: {
                text: ''
              }
            },
            xAxis: {
              title: {
                text: ''
              }
            },
            series:[{
              data: attentionData,
              name: 'attention',
              visible: false,
              color:'rgba(0, 150, 136, 0.8)' //teal
            },
            {
              data: negativeData,
              name: 'negative',
              color: 'rgba(233, 30, 99, 0.8)' //pink
            },
            {
              data: smileData,
              name: 'smile',
              color: 'rgba(255, 152, 0, 0.8)' //orange
            },
            {
              data: surpriseData,
              name:'surprise',
              color: 'rgba(103, 58, 183, 0.8)' //purple
            }]
          }
}

module.exports.getKeywords = function (alchemyData) {
  var sentiment = [];
  var text = [];
  var relevance = [];
  alchemyData.keywords.forEach(function (item) {
    text.push(item.text || '');
  });
  alchemyData.keywords.forEach(function (item) {
    relevance.push(item.relevance || '');
  });
  alchemyData.keywords.forEach(function (item) {
    sentiment.push(item.sentiment.type || '');
  });
  return {
    alchemyAPIKeywordsText: text,
    alchemyAPIKeywordsRelevance: relevance,
    alchemyAPIKeywordsSentiment: sentiment
  }
};


