var User = require('../models/user.model.js')
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Analysis = require('../models/analysis.model.js');


var createUser = function(req, res){
  var user = {
    username: req.body.username,
    password: req.body.password
  }
  User.findOne({username: user.username})
    .then(function(exists){
      if(exists){
        res.sendStatus(409)
      } else {
        new User(user).save()
          .then(function(user){
            //successful signup
            req.session.regenerate(function() {
              req.session.user = user.username;
              res.sendStatus(201)
            })
          })
          .catch(function(err){
            throw err;
          })
      }
    })
};

var login = function(req, res){
  
  var user = {
    username: req.body.username,
    password: req.body.password,
  }
  User.findOne(user)
  .then(function(exists){
    if(exists){
      console.log('liine 36 200 success')
      req.session.regenerate(function() {
        req.session.user = user.username;
        res.send(200, analysisData);
      });
      // set cookies?
      // login successful
    } else {
      console.log('line 40 401 failure login')
      res.sendStatus(401) // incorrect credentials
    }
  })
};

var logout = function(req, res) {
  req.session.destroy(function(){
    res.sendStatus(200); // session is destroyed
  });
}

module.exports = {
  createUser: createUser,
  login: login,
  logout: logout
}

