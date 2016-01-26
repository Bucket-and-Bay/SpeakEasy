var User = require('../models/user.model.js')
var mongoose = require('mongoose');
var Promise = require('bluebird');

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
            res.sendStatus(201)
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
    password: req.body.password
  }
  console.log(user, 'line 32')
  User.findOne(user)
    .then(function(exists){
      if(exists){
        console.log('liine 36 200 success')
        // set cookies?
        res.sendStatus(200); // login successful
      } else {
        console.log('line 40 401 failure login')
        res.sendStatus(401) // incorrect credentialss
      }
    })
};

module.exports = {
  createUser: createUser,
  login: login
}