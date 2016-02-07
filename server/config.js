var config;

if(process.env.NODE_ENV ==='development'){
  var localConfig = require('./config/localConfig.js');
  config ={
    mode: 'local',
    port: 3000,
    mongoUri:localConfig.mongoURI,
    kairosID:localConfig.kairosID,
    kairosKey:localConfig.kairosKey,
    alchemyKey: localConfig.alchemyKey,
    watsonUsername: localConfig.watsonUsername,
    watsonPassword: localConfig.watsonPassword,
    beyondVerbalKey:localConfig.beyondVerbalKey,
    alchemyKey:localConfig.alchemyKey
  };
}else{
  config = {
    mode: 'production',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGOLAB_URI,
    kairosID: process.env.kairosID,
    kairosKey: process.env.kairosKey,
    alchemyKey: process.env.alchemyKey,
    watsonUsername: process.env.watsonUsername,
    watsonPassword: process.env.watsonPassword,
    beyondVerbalKey:process.env.beyondVerbalKey,
    alchemyKey:process.env.alchemyKey
  };
}


module.exports = config;