/*global App Backbone*/
App.Routers.Router = Backbone.Router.extend({
  routes:{
    "" :"home",
  },

  initialize:function(){
    this.currentView = null;
  },

  home:function(){
    console.log("route home");
    this.currentView = new App.Views.Home();
    this.currentView.render();
  },
});
