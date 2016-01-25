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

module.exports = {
  submitVideo: submitVideo,
  sendCode: sendCode
};