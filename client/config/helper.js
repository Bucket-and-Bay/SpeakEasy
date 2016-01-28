var axios = require('axios');

<<<<<<< 195eaf4f0be5ed9db5a6557e6c55c3941f379613
// var serverURI = 'http://localhost:3000';
var serverURI = 'http://localhost:3000';
=======
var serverURI = 'http://localhost:3000';
// var serverURI = 'https://bab-speakeasy.herokuapp.com';
>>>>>>> Integrated twilio notifications.


var submitVideo = function(video){
  var formData = new FormData();
  formData.append('file', video);
  return axios.post('https://api.streamable.com/upload', formData)
    .then(function(response){
      console.log(response.data.shortcode, 'line 10 in helper')
      return response.data.shortcode;
    })
    .catch(function(err){
      return err;
    })
}

var sendCode = function(data) {
  return axios.post(serverURI + '/api/analyze', { shortcode: data })
    .then(function(response) {
      return response
    })
    .catch(function(err) {
      return err;
    })
}

var login = function(user){
  console.log(user, 'line 30')
  return axios.post(serverURI + '/user/login', user)
    .then(function(response){
      return response;
    })
    .catch(function(err){
      return err;
    })
}
var signup = function(user){
  console.log('line 40 signup')
  return axios.post(serverURI + '/user/signup', user)
  .then(function(response){
    return response;
  })
  .catch(function(err){
    return err;
  })
}

var logout = function() {
  return axios.get(serverURI + '/user/logout')
    .then(function(response) {
      return response;
    })
    .catch(function(err) {
      return err;
    })
}

var getUserVideos = function(){
  return axios.get(serverURI + '/api/fetchAnalyses')
    .then(function(response){
      return response;
    })
    .catch(function(err){
      return err;
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

module.exports = {
  submitVideo: submitVideo,
  sendCode: sendCode,
  login: login,
  signup: signup,
  logout: logout,
  getUserVideos: getUserVideos,
  getVideoAnalysis: getVideoAnalysis,
  getEmotionData: getEmotionData
};