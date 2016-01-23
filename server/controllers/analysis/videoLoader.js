var https = require('https');
var shortcode = 'ocf1';


module.exports.getVideo = function () {
  var data;
  https.get('https://api.streamable.com/videos/'+shortcode, function (res, err) {
    res.on('error', function (err) {
     console.log('ERROR', err);
    });

    res.on('data', function(chunk){
      data+=chunk;
    });

    res.on('end', function () {
     console.log('Our wanted data:', JSON.parse(data.slice(9)));
    });

  });
};