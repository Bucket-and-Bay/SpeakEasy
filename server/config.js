
var localConfig = require('./config/localConfig.js')

var config = {
  local: {
    mode: 'local',
    port: 3000,
    mongoUri:localConfig.mongoURI,
    kairosID:localConfig.kairosID,
    kairosKey:localConfig.kairosKey
  },
  production: {
    mode: 'production',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGOLAB_URI,
    kairosID: process.env.kairosID,
    kairosKey: process.env.kairosKey
  }
};

module.exports = function (mode) {
  return process.env.NODE_ENV === 'production' ? config.production : config.local;
}();