var axios = require('axios');

var serverURI = 'http://localhost:3000';

var submitVideo = function(video){
  var formData = new FormData();
  formData.append('file', video);
  return axios.post('https://api.streamable.com/upload', formData)
    .then(function(response){
      //shortcode to send to server
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

var populateDashboard = function() {
  return axios.get(serverURI + '/api/fetch/Analyses')
    .then(function(response) {
      return response;
    })
    .catch(function(err) {
      return err;
    })
}

module.exports = {
  submitVideo: submitVideo,
  sendCode: sendCode,
  login: login,
  signup: signup,
  logout: logout,
  populateDashboard: populateDashboard
};