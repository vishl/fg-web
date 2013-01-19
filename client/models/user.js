/*global App Backbone*/

App.Models.User = Backbone.Model.extend({
  
  url:"/users",

  login:function(options){
    options = options || {};
    options.url="/users/login";
    this.save(null, options);
  },

  isLoggedIn:function(){
    return !!this.attributes.loginToken;
  },

  logOut:function(){
    $.cookie('accesstoken', '');
  },

});
