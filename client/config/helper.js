var axios = require('axios');

var serverURI = 'http://localhost:3000';
// var serverURI = 'https://bab-speakeasy.herokuapp.com';

var submitRecorded = function(videoData){
  console.log(videoData);
  var data = new FormData();
  data.append('audio', videoData.audioFile);
  data.append('video', videoData.videoFile);
  data.append('title', videoData.title);
  data.append('description', videoData.description);
  return axios.post(serverURI + '/api/record', data)
    .then(function(response){
      return response;
    })
    .catch(function(err){
      throw err;
    })
}

var submitVideo = function(video){
  var formData = new FormData();
  formData.append('file', video);
  return axios.post('https://api.streamable.com/upload', formData)
    .then(function(response){
      console.log(response.data.shortcode, 'line 10 in helper')
      return response.data.shortcode;
    })
    .catch(function(err){
      throw err;
    })
}

var sendCode = function(data) {
  return axios.post(serverURI + '/api/analyze', data)
    .then(function(response) {
      return response
    })
    .catch(function(err) {
      throw err;
    })
}

var login = function(user){
  console.log(user, 'line 30')
  return axios.post(serverURI + '/user/login', user)
    .then(function(response){
      return response;
    })
    .catch(function(err){
      throw err;
    })
}

var signup = function(user){
  console.log('line 40 signup')
  return axios.post(serverURI + '/user/signup', user)
  .then(function(response){
    return response;
  })
  .catch(function(err){
    throw err;
  })
}

var logout = function() {
  return axios.get(serverURI + '/user/logout')
    .then(function(response) {
      return response;
    })
    .catch(function(err) {
      throw err;
    })
}

var getUserVideos = function(){
  return axios.get(serverURI + '/api/fetchAnalyses')
    .then(function(response){
      return response;
    })
    .catch(function(err){
      throw err;
    })
}

var getPublicVideos = function() {
  return axios.get(serverURI + '/api/getPublicVideos')
    .then(function(response){
      return response;
    })
    .catch(function(err){
      throw err;
    })
}

var getVideoAnalysis = function(id) {
  return axios.get(serverURI + '/api/getAnalysisById/' + id)
    .then(function(response){
      return response;
    })
    .catch(function(err){
      return err;
    })
}


var deleteVideo = function(videoID){
  var options = {
    videoID: videoID
  };
  return axios.post(serverURI + '/api/delete', options)
    .then(function(response){
      return response
    })
    .catch(function(err){
      throw err;
    })
}

var getBeyondVerbalData = function (bvData) {
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
      low: 'Low Arousal, conveys low levels of alertness and can be registered in cases of sadness, comfort, relief or sleepiness.',
      medium: 'Mid Arousal, conveys a medium level of alertness and can be registered in cases of normal conduct, indifference or self-control.',
      neutral: ' Arousal neutral perhaps not needed...',
      high: 'High Arousal, conveys a high level of alertness such as excitement, surprise, passionate communication, extreme happiness or anger.'
    },
    temper : {
      low: 'Low temper occurs when the speaker experiences and expresses depressive emotions in an inhibited fashion, such as sadness, pain, suffering, insult, inferiority, self-blame, self-criticism, regret, fear, anxiety and concern (can also be interpreted as fatigued). It is as though the speaker is waning, growing smaller or pulling back.',
      medium: 'Medium temper occurs when the speaker experiences and expresses the following three types of emotions: Embracive “positive” emotions, communicated in a warm and friendly manner, such as positivity, empathy, acceptance, friendliness, closeness, kindness, affection, love, calmness, and motivation. Self-controlled “neutral” emotions communicated in a “matter-of-fact” intonation. No significant emotions are evident in the speaker’s voice.',
      neutral: 'Temper neutral perhaps not needed...',
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



var wpmWatson = function (script, videoLength) {
  script = script.split(' ');
  script.forEach(function (word, i) {
    if (word === '' || word === ' ') {
      script.splice(i, 1);
    }
  });

  return [script.length, (script.length / videoLength * 60).toFixed()];
};

var putPrivacy = function(isPrivate, videoId) {
  if (isPrivate === true || isPrivate === false) {
    var options = {
      isPrivate: isPrivate,
      videoId: videoId
    }
    return axios.put(serverURI + '/api/updatePrivacy/' + videoId, options)
      .then(function(response) {
        return response;
      })
      .catch(function(err) {
        throw err;
      })
  }
};

var getVideoComments = function(videoId) {
  var options = { videoId: videoId }
  return axios.get(serverURI + '/api/getComments/' + videoId, options)
    .then(function(response) {
      return response;
    })
    .catch(function(err) {
      throw err;
    })
};

var submitComment = function(videoId, username, text) {
  var options = {
    videoId: videoId,
    username: username,
    text: text
  }
  return axios.put(serverURI + '/api/addComment', options)
    .then(function(response) {
      return response;
    })
    .catch(function(err) {
      throw err;
    })
};


module.exports = {
  submitVideo: submitVideo,
  sendCode: sendCode,
  login: login,
  signup: signup,
  logout: logout,
  getUserVideos: getUserVideos,
  getVideoAnalysis: getVideoAnalysis,
  submitRecorded: submitRecorded,
  deleteVideo: deleteVideo,
  getBeyondVerbalData: getBeyondVerbalData,
  putPrivacy: putPrivacy,
  getPublicVideos: getPublicVideos,
  getVideoComments: getVideoComments,
  submitComment: submitComment,
  wpmWatson: wpmWatson
};

