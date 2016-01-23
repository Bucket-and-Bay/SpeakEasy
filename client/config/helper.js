var axios = require('axios');


var submitVideo = function(video){
  var formData = new FormData();
  formData.append('file', video);
  return axios.post('https://api.streamable.com/upload', formData)
    .then(function(response){
      //shortcode to send to server
      return response.data.shortcode;
    })
}

module.exports = submitVideo;