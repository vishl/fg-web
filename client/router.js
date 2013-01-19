/*global App Backbone*/
App.Routers.Router = Backbone.Router.extend({
  routes:{
    "" :"home",
    "signup" : "signup",
  },

  initialize:function(){
    this.currentView = null;
  },

  home:function(){
    console.log("route home");
    if(!App.currentUser.isLoggedIn()){
      this.currentView = new App.Views.HomeLoggedOut();
    }else{
      this.currentView = new App.Views.Home();
    }
    this.currentView.render();
  },

  signup:function(){
    if(App.currentUser.isLoggedIn()){
      this.navigate("", {trigger:true});
    }else{
      console.log("route signup");
      this.currentView = new App.Views.Signup();
      this.currentView.render();
    }
  },
});
