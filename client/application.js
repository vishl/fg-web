/*global Backbone*/
var BootstrapData = {};
var App = {
  Views:       {},
  Routers:     {},
  Models:      {},
  Collections: {},
  init: function() {
    this.setupCurrentUser();
    this.start();
  },

  setupCurrentUser:function(){
    this.currentUser = new App.Models.User();
    if(BootstrapData && BootstrapData.currentUser){
      this.currentUser.inject(BootstrapData.currentUser);
    }
  },

  start:function(){
    this.router = new App.Routers.Router();
    Backbone.history.start();
//    Backbone.history.start({pushState: true, root: "/app"});
  },
};

