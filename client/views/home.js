/*global App Backbone JST*/
App.Views.Home = Backbone.View.extend({
  events:{
    'submit form#signup':'signup',
    'submit form#login':'login',
  },

  initialize:function(){
    $('#main_window').html(this.el);
  },

  render:function(){
    this.$el.html(JST['home']());
    this.delegateEvents();
  },

  signup:function(e){
    if(e){
      e.preventDefault();
    }

    var attrs = {};
    attrs.name = this.$('#signup').find('#name').val();
    attrs.email = this.$('#signup').find('#email').val();
    attrs.password = this.$('#signup').find('#password').val();

    var user = new App.Models.User(attrs);
    user.save(null, {
      success:function(){
        console.log("success");
      },
      error:function(model, resp){
        console.log("error: "+resp.responseText);
      },
    });
  },

  login:function(e){
    if(e){
      e.preventDefault();
    }

    var attrs = {};
    attrs.email = this.$('#login').find('#email').val();
    attrs.password = this.$('#login').find('#password').val();

    var user = new App.Models.User(attrs);
    user.login({
      success:function(){
        console.log("success");
      },
      error:function(model, resp){
        console.log("error: "+resp.responseText);
      },
    });
  },

});
