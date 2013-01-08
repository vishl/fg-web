/*global Models*/

exports.ensureLoggedIn = function(req,res,next){
  //we use this later
  var failure = function(){
    res.statusCode = 401;
    res.send("Not logged in");
  };

  var token = null;
  token = req.cookies.accesstoken;
  if(!token){
    token = req.param('accesstoken');
  }
  if(token){
    Models.User.find({loginToken:token}, function(err, models){
      if(err){
        failure();
      }else{
        if(models.length===1){
          var user = models[0];
          if(user.loginTokenExpire<Date.now()){
            failure();
          }else{
            //success
            next(user);
          }
        }else{
          failure();
        }
      }
    });
  }else{
    failure();
  }

};
