var config;
console.log('------------------------- env: ',process.env.NODE_ENV);
if(process.env.NODE_ENV!=='production'){
  var localConfig = require('./config/localConfig.js');
  config ={
    mode: 'local',
    port: 3000,
    mongoUri:localConfig.mongoURI,
    kairosID:localConfig.kairosID,
    kairosKey:localConfig.kairosKey
  };
}else{
  config = {
    mode: 'production',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGOLAB_URI,
    kairosID: process.env.kairosID,
    kairosKey: process.env.kairosKey
  };
  console.log('------------------------- Id: ',process.env.kairosID);
  console.log('------------------------- Key: ',process.env.kairosKey);
  console.log('------------------------- mongo: ',process.env.MONGOLAB_URI);
}


module.exports = config;
