var User = require('../models/user.model.js')

var createUser = function(req, res){
  var user = {
    username: req.body.username,
    password: req.body.password
  }
  User.findOne(user)
    .then(function(user){
      if(user){
        res.sendStatus(409)
      } else {
        User(user).save()
          .then(function(user){
            //successful signup
            console.log(user);
            res.send(201)
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
  User.findOne(user)
      .then(function(user){
        if(user){
          // set cookies?
          res.sendStatus(200); // login successful
        } else {
          res.sendStatus(401) // incorrect credentials
        }
      })
      .catch(function(err){
        throw err;
      })
};

module.exports = {
  createUser: createUser,
  login: login
}