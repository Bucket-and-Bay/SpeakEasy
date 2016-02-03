var Promise = require('bluebird');
var multiparty = require('multiparty');
var watson = require('watson-developer-cloud');
var apiKeys = require('../../config/localConfig.js');

var speechToText = watson.speech_to_text({
  username: apiKeys.watsonUsername,
  password: apiKeys.watsonPassword,
  version: 'v1', 
  url: "https://stream.watsonplatform.net/speech-to-text/api"
})

var getText = function(data) {
  var results = [];
  data.forEach(function(item) {
    results.push(item['results'][0]['alternatives'][0]['transcript']);
  });
  return results.join('');
};

module.exports.transcript = function(req){
  return new Promise(function(resolve, reject){
    var title = '';
    var description = '';
    var audio64 = '';
    var shortcode = '';
    var text = '';
    var results = [];
    var params = {
      content_type: 'audio/wav',
      timestamps: true,
      continuous: true
    };
    console.log('running watsonAnalysis');
    var recognizeStream = speechToText.createRecognizeStream(params);
    var form = new multiparty.Form({maxFieldsSize : 100 * 1024 * 1024});
    form.parse(req)
    form.on('error', function(err) {
    console.log('Error parsing form: ' + err.stack);
    });
    form.on('field', function(fieldName, fieldValue){
      //video shortcode here
      if(fieldName === 'video'){
        shortcode = fieldValue;
      };
      if(fieldName === 'audio64'){
        audio64 = fieldValue;
      };
      if(fieldName === 'title'){
        title = fieldValue;
      };
      if(fieldName === 'description'){
        description = fieldValue;
      };
    })  
    form.on('part',function(part){
      if (!part.filename) {
        //video shortcode
        // filename is not defined when this is a field and not a file
        console.log('got field named ' + part.name);
        // ignore field's content
        part.resume();
      }

      if (part.filename) {
        // filename is defined when this is a file
        //audio file
        part.pipe(recognizeStream)
        console.log('got file named ' + part.name);
        // ignore file's content here
        part.resume();
      }

      part.on('error', function(err) {
        // decide what to do
      });
      
    })
    form.on('close', function(){
     
      recognizeStream.setEncoding('utf8');
      recognizeStream.on('results', function(e){
        if(e.results[0]){ 
          if(e.results[0].final) {
            results.push(e);
          } 
        }
      });
      recognizeStream.on('connection-close', function() {

        var transcript = getText(results);
        console.log(transcript);
        resolve({
          transcript: transcript, 
          shortcode:shortcode, 
          audio64: audio64,
          title: title,
          description: description
        })
      });

    })
  })
};





