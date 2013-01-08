/*global Backbone*/
var App = {
  Views:       {},
  Routers:     {},
  Models:      {},
  Collections: {},
  init: function() {
    this.router = new App.Routers.Router();
    Backbone.history.start();
  },
};

