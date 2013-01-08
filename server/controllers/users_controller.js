/*global Models*/

var _ = require('underscore');
var Utils = require('../lib/utils.js');

function logIn(user, res, next){
  user.setLoginToken(true, function(){
    res.cookie('accesstoken', user.loginToken, {expires:new Date(Date.now()+3600000*24*365)});
    next();
  });
}

exports.create = function(req, res){
  //For some reason, requests from XHR have the paras in req.body
  var params = {name:req.param('name'), email:req.param('email'), password:req.param('password')};
  console.log("Create user: %j", params);
  Models.User.register(params, function(err, model){
    if(err){
      console.log("Error: %j", err);
      res.statusCode = 400;
      res.send(err.toString());
    }else{
      logIn(model, res, function(){
        res.send(model.toJSON());
      });
    }
  });
};

exports.authenticate = function(req, res){
  Models.User.authenticate(req.param('email'), req.param('password'), function(err, model){
    if(err){
      console.log("Error: %j", err);
      res.statusCode = 400;
      res.send(err.toString());
    }else{
      logIn(model, res, function(){
        res.send(model.toJSON());
      });
    }
  });
};

exports.update = function(req, res){
};

exports.destroy = function(req, res){
};

exports.show = function(req, res){
  Utils.ensureLoggedIn(req, res, function(user){
    //TODO render user JSON
    res.send(user.toJSON());
  });
};

