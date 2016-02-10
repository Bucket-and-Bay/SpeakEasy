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
          resolve(data);
        }else{
          console.log('Polling', data);
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

module.exports.formatBeyondVerbal = function (bvData) {
  //response.data.beyondVerbalAnalysis[0].result.analysisSegments[0].analysis.Arousal.Value
  var emotions = {
    arousalData: 0,
    moodDataCompPrimary: [],
    moodDataCompSecondary: [],
    moodDataGroup11: [],
    temperData: 0,
    valenceData: 0,
    finalDataGroup11: {},
    summary: {},
    audioQData: 0
  };
  var count = 0;
  bvData.analysisSegments.forEach(function (item) {
    // Secondary moods may throw off the analysis?
    emotions.moodDataCompPrimary.push(item.analysis.Mood.Composite.Primary.Phrase + ' ');
    emotions.moodDataCompSecondary.push(item.analysis.Mood.Composite.Secondary.Phrase + ' ');

    emotions.moodDataGroup11.push(item.analysis.Mood.Group11.Primary.Phrase);
    emotions.moodDataGroup11.push(item.analysis.Mood.Group11.Secondary.Phrase);

    emotions.arousalData += (Number(item.analysis.Arousal.Value));
    emotions.temperData += (Number(item.analysis.Temper.Value));
    emotions.valenceData += (Number(item.analysis.Valence.Value));
    emotions.audioQData += (Number(item.analysis.AudioQuality.Value));

    count++;
  });

  emotions.summary['arousal'] = bvData.analysisSummary.AnalysisResult['Arousal'].Mode;
  emotions.summary['temper'] = bvData.analysisSummary.AnalysisResult['Temper'].Mode;
  emotions.summary['valence'] = bvData.analysisSummary.AnalysisResult['Valence'].Mode;

  emotions.summary = atvModes(emotions.summary);

  emotions.moodDataGroup11.forEach(function (group) {
    var obj = emotions.finalDataGroup11;

    if (!(group in obj)) {
      obj[group] = 1;
    } else {
      obj[group]++;
    }
  });

  // delete duplicates from Group11
  emotions.moodDataGroup11 = emotions.moodDataGroup11
    .reduce(function(accum, current) {
      if (accum.indexOf(current) < 0) {
        accum.push(current);
      }
      return accum;
    }, []);

  emotions.moodDataGroup11 = bvMoodPhrases(emotions.moodDataGroup11);

  emotions.arousalData = [emotions.arousalData / count];
  emotions.temperData = [emotions.temperData / count];
  emotions.valenceData = [emotions.valenceData / count];
  emotions.audioQData = [emotions.audioQData / count];

  return emotions;
};

var atvModes = function (summaries) {
  var moods = {
    arousal : {
      low: 'Low Energy, conveys low levels of alertness and can be registered in cases of sadness, comfort, relief or sleepiness.',
      medium: 'Mid Energy, conveys a medium level of alertness and can be registered in cases of normal conduct, indifference or self-control.',
      neutral: ' Your Energy was neutral.',
      high: 'High Energy, conveys a high level of alertness such as excitement, surprise, passionate communication, extreme happiness or anger.'
    },
    temper : {
      low: 'Low temper occurs when the speaker experiences and expresses depressive emotions in an inhibited fashion, such as sadness, pain, suffering, insult, inferiority, self-blame, self-criticism, regret, fear, anxiety and concern (can also be interpreted as fatigued). It is as though the speaker is waning, growing smaller or pulling back.',
      medium: 'Medium temper occurs when the speaker experiences and expresses the following three types of emotions: Embracive “positive” emotions, communicated in a warm and friendly manner, such as positivity, empathy, acceptance, friendliness, closeness, kindness, affection, love, calmness, and motivation. Self-controlled “neutral” emotions communicated in a “matter-of-fact” intonation. No significant emotions are evident in the speaker’s voice.',
      neutral: 'Your Temper was neutral.',
      high: 'High temper occurs when the speaker experiences and expresses aggressive emotions, such as active resistance, anger, hatred, hostility, aggressiveness, forceful commandment and/or arrogance.'
    },
    valence : {
      negative: 'Negative Valence. The speaker’s voice conveys emotional pain and weakness or aggressive and antagonistic emotions.',
      neutral: 'Neutral Valence. The speaker’s voice conveys no preference and comes across as self-control or neutral.',
      positive: 'Positive Valence. The speaker’s voice conveys affection, love, acceptance and openness.'
    }
  };

  var summaryAllData = {};

  for (var outerKey in moods) {
    var next = moods[outerKey];
    for (var innerKey in next) {
      if (innerKey === summaries[outerKey]) {
        summaryAllData[outerKey] = [innerKey, next[innerKey]];
      }
    }
  }

  return summaryAllData;

};

var bvMoodPhrases = function (moodPhrases) {
  var phrasesExplained = {
    'Supremacy, Arrogance': 'This group is typified by feelings of power, superiority, ascendancy, self-importance or self-entitlement. The feelings can range from a feeling of superiority to a tendency to assert control when dealing with others.',
    'Hostility, Anger': 'This group has negative emotions of antagonism, enmity or unfriendliness that can be directed against individuals, entities, objects or ideas. The feelings can range from aversion and offensiveness to open aggressiveness and incitement.',
    'Criticism, Cynicism': 'This group is typified by a feeling of general distrust or skepticism. The feelings can also be described as scornful and jaded negativity.',
    'Self-control, Practicality': 'Self-control and practicality. This group is typified by feelings of controlled emotions, behaviors and desires. The feelings can range from self-restraint to irrelevance.',
    'Leadership, Charisma': 'This group is typified by feelings of power, vision and motivation. The feelings can range from protectiveness, communication of ideas or ideology with an underline of motivation.',
    'Creative, Passionate': 'This group is typified by a feeling of eagerness and/or desire. The feelings can range from desire, want and craving with an underline of action to achieve goals. These emotions are highly correlated with vivid imagination, hopes and dreams.',
    'Friendly, Warm': 'This group is typified by positive feelings and pleasant accommodation. The feelings include approval, empathy and hospitability. The group can also include feelings of being approved or wanted by others (“being part of a team”) as well as being receptive to another person, idea or item.',
    'Love, Happiness': 'This group is typified by long term happiness, affiliation and pleasurable sensation. The group also includes feelings of strong affection for another person, idea or item as well as arising out of kinship or personal ties.',
    'Loneliness, Unfulfillment': 'This group is typified by feelings of inadequacy, lack of worth, disappointment or failure.',
    'Sadness, Sorrow': 'This group is typified by emotional pain such as unhappiness, self-pity and powerlessness.',
    'Defensivness, Anxiety': 'This group is typified by negative emotions of fear, worry and uneasiness. The group also includes low self-esteem and can also often be accompanied by inner turmoil and restlessness.'
  };

  var phrasesAllData = [];

  moodPhrases.forEach(function (phrase) {
    if (phrase in phrasesExplained) {
      phrasesAllData.push([phrase, phrasesExplained[phrase]]);
    }
  });
  return phrasesAllData;
};

