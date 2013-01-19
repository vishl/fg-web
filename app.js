/*global mongoose:true Models:true*/

//libs
require('log-timestamp')('[%s] %s', function(){ return new Date().toJSON(); });
var express = require('express');
var http = require('http');
var path = require('path');
var _ = require('underscore');
mongoose = require('mongoose');

//create app
var app = module.exports = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3002);
  app.set('views', __dirname + '/server/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(/*favicon path here*/));
  app.use(express.logger('dev'));
//  app.use(express.logger());   more detailed log entries
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(process.env.NODE_SECRET || 'supersecret'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function (err, req, res, next) {
    console.log(err);
    res.send(500, { error: err });
  });
});
app.configure('development', function(){
  app.use(express.errorHandler());
});

//connect to database
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  //connection success

  //establish routes
  require('server/routes.js')(app);

  //compile models
  Models = require('./server/models');  //global models object

  //Start server or console
  if(process.argv.indexOf('-c')>=0){  //command line
    console.log("Starting command prompt");
    var repl = require("repl");
    repl.start("> ");
  }else{  //start server
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
  }
});

//TODO dev only
require('client/assets.js');
