//include all the controllers so we can create routes
var pagesController = require('./controllers/pages_controller');
var usersController = require('./controllers/users_controller');

module.exports = function(app){
  //static pages
  app.get('/', pagesController.index);
  app.get('/app', pagesController.app);

  //User resource
  app.get('/users/:id', usersController.show);
  app.put('/users/:id', usersController.update);
  app.post('/users', usersController.create);
  app.post('/users/login', usersController.authenticate);
  app.delete('/users/:id', usersController.destroy);
};
