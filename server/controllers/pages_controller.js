/*global Models*/
var Utils = require('../lib/utils.js');

exports.index = function(req, res){
  res.render('index', { title: 'FG' });
};

exports.app = function(req, res){
  Utils.authenticate(req, function(err, currentUser){
    var bscu = 'null';
    if(currentUser instanceof Models.User){
      bscu = currentUser.toJSON();
      console.log("%j", bscu);
    }
    res.render('app', { title: 'FG', bscu:bscu});
  });
};
