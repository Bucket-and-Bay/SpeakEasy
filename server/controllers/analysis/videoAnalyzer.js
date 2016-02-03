var request = require('request-promise');
var apiKeys = require('../../config.js');
var eventEmitter = require('../events.controller.js');
var util = require('../utils.js');

var conditions = {
  post:function (res) {
    return res.id;
  },
  get:function (res) {
    return res.status === 'Complete';
  }
};


module.exports.videoAnalysis = function(url){
  return new Promise(function(resolve, reject){
    console.log('url',url);
    request({
      method    : 'POST',
      url       : 'https://api.kairos.com/media?source='+url,
      headers:{
        app_id    : process.env.KAIROS_ID || apiKeys.kairosID,
        app_key   : process.env.KAIROS_KEY || apiKeys.kairosKey
      }
    })
    .then(function(data){
        util.poll({
          method    : 'GET',
          url       : 'https://api.kairos.com/media/'+JSON.parse(data).id,
          headers:{
            app_id    : apiKeys.kairosID,
            app_key   : apiKeys.kairosKey
          }
        }, 10000,conditions.get)
        .then(function(data){
          resolve(data)
        });
      });
    });
  };
