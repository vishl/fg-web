/*global mongoose */
var troop = require('mongoose-troop');
var bcrypt = require('bcrypt');

////////////////////////////////// Model Definition ////////////////////////////
var UserSchema = mongoose.Schema({
  name: String,
  //email and passwordHash are added via the basicAuth plugin
  loginToken: {type:String, index:{unique:true}},
  loginTokenExpire: Date
});

//Add created and modified timestamps
UserSchema.plugin(troop.timestamp);
//Add password hashing to the model
UserSchema.plugin(troop.basicAuth, {loginPath:'email', hashPath:'passwordHash'});

////////////////////////////////// Validations /////////////////////////////////
//UserSchema.path('name').required(true);
UserSchema.path('email').match(/^[\w+\-]+(\.[\w+\-]+)*@([\w\-]+\.)+\w+$/i);

////////////////////////////////// Methods /////////////////////////////////////
UserSchema.methods.toJSON = function(options){
  return JSON.stringify({
    id:this.id,
    name:this.name,
    email:this.email,
    loginToken:this.loginToken
  });
};

//Sets the log in token if necessary
UserSchema.methods.logIn = function(next){
  if(this.loginToken && this.loginTokenExpire> new Date()){
    //do nothing
  }else{
    this.setLoginToken(true, next);
  }
  return this;
};

//Set the log in token and expire value
UserSchema.methods.setLoginToken = function(save, next){
  var self = this;
  console.log('setting login token');
  bcrypt.genSalt(function(err, salt){
    self.loginToken = salt;
    var exp = new Date();
    exp.setFullYear(exp.getFullYear()+1);
    self.loginTokenExpire = exp;
    if(save){
      self.save(next);
    }else{
      next();
    }
  });

  return this;
};

//Change token when password changes
UserSchema.pre('save', function (next) {
  var self=this;
  if (self._password){
    self.setLoginToken(false, function(){
      if(self.passwordHash){
        self.setPassword(self._password, next);
      }else{
        next();
      }
    });
  }else{
    next();
  }
});

////////////////////////////////// Export //////////////////////////////////////
module.exports = mongoose.model('User', UserSchema);
