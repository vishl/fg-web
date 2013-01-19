/*global App Backbone JST*/
App.Views.Signup = Backbone.View.extend({
  events:{
    'submit form#signup':'signup',
    'submit form#login':'login',
  },

  initialize:function(){
    this.model = App.currentUser;
    $('#main_window').html(this.el);
  },

  render:function(){
    this.$el.html(JST['signup']());
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

    this.model.set(attrs);
    this.model.save(null, {
      success:function(){
        console.log("success");
        App.router.navigate("", {trigger:true});
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

    this.model.set(attrs);
    this.model.login({
      success:function(){
        console.log("success");
        App.router.navigate("", {trigger:true});
      },
      error:function(model, resp){
        console.log("error: "+resp.responseText);
      },
    });
  },

});

