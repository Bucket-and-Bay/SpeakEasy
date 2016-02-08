var axios = require('axios');

var serverURI = 'http://localhost:3000';
// var serverURI = 'https://bab-speakeasy.herokuapp.com';

var submitRecorded = function(videoData){
  console.log(videoData);
  var data = new FormData();
  data.append('shortcode', videoData.shortcode);
  data.append('audio', videoData.audioFile);
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

var getEmotionData = function(videoEmotionAnalysis) {
  var emotions = {
    attentionData: [],
    negativeData: [],
    surpriseData: [],
    smileData: []
  }
  videoEmotionAnalysis.forEach(function(item) {
    emotions.attentionData.push([item.person.time, item.person.emotions.attention]);
    emotions.negativeData.push([item.person.time, item.person.emotions.negative]);
    emotions.surpriseData.push([item.person.time, item.person.emotions.surprise]);
    emotions.smileData.push([item.person.time, item.person.emotions.smile]);
  });
  return emotions;
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
    moodDataComp: [],
    moodDataGroup11: [],
    temperData: 0,
    valenceData: 0,
    finalDataGroup11: {},
    summary: {}
  };
  var count = 0;
  bvData.analysisSegments.forEach(function (item) {

    emotions.moodDataComp.push(item.analysis.Mood.Composite.Primary.Phrase);
    emotions.moodDataGroup11.push(item.analysis.Mood.Group11.Primary.Phrase);

    emotions.arousalData += (Number(item.analysis.Arousal.Value));
    emotions.temperData += (Number(item.analysis.Temper.Value));
    emotions.valenceData += (Number(item.analysis.Valence.Value));
    count++;
  });

  emotions.summary['arousal'] = bvData.analysisSummary.AnalysisResult['Arousal'].Mode;
  emotions.summary['temper'] = bvData.analysisSummary.AnalysisResult['Temper'].Mode;
  emotions.summary['valence'] = bvData.analysisSummary.AnalysisResult['Valence'].Mode;

  //console.log(emotions.summary);


  emotions.summary = atvModes(emotions.summary);
  //console.log(emotions.summary);

  emotions.moodDataGroup11.forEach(function (group) {
    var obj = emotions.finalDataGroup11;

    if (!(group in obj)) {
      obj[group] = 1;
    } else {
      obj[group]++;
    }
  });

  emotions.arousalData = [emotions.arousalData / count];
  emotions.temperData = [emotions.temperData / count];
  emotions.valenceData = [emotions.valenceData / count];
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
  // Object {Arousal: "high", Temper: "medium", Valence: "neutral"}
  // return object with three moods and their data
  // {Arousal: ['high', 'big string']}

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

var getAlchemyData = function (alchemyData) {
  //var concepts = {};
  var conceptsText = [];
  var conceptsWebsites = [];


  alchemyData.concepts.forEach(function (item) {
    //concepts[item.text] = item.website || '';
    conceptsText.push(item.text);
    conceptsWebsites.push(item.website || '');
  });
  var concepts = [conceptsText,conceptsWebsites];
  //console.log('Concepts: ', concepts);
  return concepts;
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
  getEmotionData: getEmotionData,
  submitRecorded: submitRecorded,
  deleteVideo: deleteVideo,
  getBeyondVerbalData: getBeyondVerbalData,
  getAlchemyData: getAlchemyData,
  putPrivacy: putPrivacy,
  getPublicVideos: getPublicVideos,
  getVideoComments: getVideoComments,
  submitComment: submitComment
};

