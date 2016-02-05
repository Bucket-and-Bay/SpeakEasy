//var config;
//if(process.env.NODE_ENV==='development'){
//  var localConfig = require('./config/localConfig.js');
//  config ={
//    mode: 'local',
//    port: 3000,
//    mongoUri:localConfig.mongoURI,
//    kairosID:localConfig.kairosID,
//    kairosKey:localConfig.kairosKey
//  };
//}else{

 var config = {
    mode: 'production',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGOLAB_URI,
    kairosID: process.env.kairosID,
    kairosKey: process.env.kairosKey
  };
//}


module.exports = config;
