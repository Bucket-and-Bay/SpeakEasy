var User = require('../models/user.model.js')
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Analysis = require('../models/analysis.model.js');
var bcrypt = require('bcrypt');

var createUser = function(req, res){
  var user = {
    username: req.body.username,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber
  }
  User.findOne({username: user.username})
    .then(function(exists){
      if(exists){
        res.sendStatus(409)
      } else {
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(user.password, salt, function(err, hash){
            user.password = hash;
            new User(user).save()
              .then(function(user){
                //successful signup
                req.session.regenerate(function() {
                  req.session.user = user.username;
                  res.sendStatus(201)
                })
              })
            
          })
        })
      }
    })
};

var login = function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var user = {
    username: req.body.username,
  }
  User.findOne(user)
  .then(function(userData){
    if(userData){
      bcrypt.compare(password, userData.password, function(err, correct){
        if(err){console.log('error checking password')}
        if(correct){
          console.log('liine 36 200 success')
          req.session.regenerate(function() {
            req.session.user = user.username;
            res.sendStatus(200);
          });

        } else {
          res.sendStatus(401)
          console.log('incorrect credentials')
          //incorrect password
        }
      })
      // set cookies?
      // login successful
    } else {
      console.log('line 40 401 failure login')
      res.sendStatus(401) // found no user
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

