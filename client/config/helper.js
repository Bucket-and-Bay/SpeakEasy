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
  putPrivacy: putPrivacy,
  getPublicVideos: getPublicVideos,
  getVideoComments: getVideoComments,
  submitComment: submitComment,
  wpmWatson: wpmWatson
};

