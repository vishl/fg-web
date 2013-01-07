//include all the controllers so we can create routes
var pagesController = require('./controllers/pages');
var usersController = require('./controllers/user');

module.exports = function(app){
  app.get('/', pagesController.index);
};
