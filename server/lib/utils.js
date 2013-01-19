/*global Models*/
var Utils = module.exports;

Utils.authenticate = function(req, cb){
  var token = null;
  token = req.cookies.accesstoken;
  if(!token){
    token = req.param('accesstoken');
  }
  if(token){
    Models.User.find({loginToken:token}, function(err, models){
      if(err){
        cb(err);
      }else{
        if(models.length===1){
          var user = models[0];
          if(user.loginTokenExpire<Date.now()){
            cb(true);
          }else{
            //success
            cb(null, user);
          }
        }else{
          cb(true);
        }
      }
    });
  }else{
    cb(true);
  }
};

Utils.ensureLoggedIn = function(req,res,next){
  //we use this later
  var failure = function(){
    res.statusCode = 401;
    res.send("Not logged in");
  };

  Utils.authenticate(req, function(err, model){
    if(err){
      failure();
    }else{
      next(model);
    }
  });

};
