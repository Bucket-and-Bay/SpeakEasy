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
    valenceData: 0
  }
  var count = 0;
  bvData.analysisSegments.forEach(function (item) {

    emotions.moodDataComp.push(item.analysis.Mood.Composite.Primary.Phrase);
    emotions.moodDataGroup11.push(item.analysis.Mood.Group11.Primary.Phrase);

    emotions.arousalData += (Number(item.analysis.Arousal.Value));
    emotions.temperData += (Number(item.analysis.Temper.Value));
    emotions.valenceData += (Number(item.analysis.Valence.Value));
    count++;
  });



  emotions.arousalData = [emotions.arousalData / count];
  emotions.temperData = [emotions.temperData / count];
  emotions.valenceData = [emotions.valenceData / count];

  return emotions;
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
  console.log(concepts);
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

