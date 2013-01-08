global.nap = require('nap');

nap({
  assets: {
    js: {
      lib: [
        '/client/lib/jquery.js',
        '/client/lib/underscore.js',
        '/client/lib/backbone.js',
      ],
      app: [
        '/client/application.js',
        '/client/router.js',
        '/client/models/*',
        '/client/views/**/*'
      ]
    },
    css: {
      less: [
        '/public/stylesheets/bootstrap/bootstrap.less',
        '/public/stylesheets/style.less',
      ]
    },
    jst: {
      templates: [
        '/client/templates/**/*.jade'
      ]
    }
  }
});

//TODO production
