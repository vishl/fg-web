/*global App Backbone JST*/
App.Views.HomeLoggedOut = Backbone.View.extend({
  events:{
    "click #signup":'signup'
  },

  initialize:function(){
    $('#main_window').html(this.el);
  },

  render:function(){
    this.$el.html(JST['home_logged_out']());
  },

  signup:function(){
    App.router.navigate('signup', {trigger:true});
  },
});

//pretty much the whole app is in here
App.Views.Home = Backbone.View.extend({
  initialize:function(){
    this.settingsBar = new App.Views.SettingsBar();
    this.selectionArea = new App.Views.SelectionArea();
    this.contentArea = new App.Views.ContentArea();
    $('#main_window').html(this.el);
  },

  render:function(){
    this.$el.html(JST['home']());
    this.$('#selection_area').html(this.selectionArea.el);
    this.selectionArea.render();
    this.$('#settings_area').html(this.settingsBar.el);
    this.settingsBar.render();
    this.$('#content_area').html(this.contentArea.el);
    this.contentArea.render();
  },
});

App.Views.SelectionArea = Backbone.View.extend({
  initialize:function(){
  },

  render:function(){
    this.$el.html(JST['selection_area']());
  },
});

App.Views.ContentArea = Backbone.View.extend({
  initialize:function(){
  },

  render:function(){
    this.$el.html(JST['content_area']());
  },
});

App.Views.SettingsBar = Backbone.View.extend({
  events:{
    "click #logout":'logout',
  },

  initialize:function(){
  },

  render:function(){
    this.$el.html(JST['settings_bar']({user:App.currentUser}));
  },

  logout:function(){
    App.currentUser.logOut();
    location.reload(true);
  },
});
