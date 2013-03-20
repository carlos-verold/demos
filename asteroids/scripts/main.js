/*global requirejs:true */

requirejs.config({
  baseUrl : './scripts/lib',
  paths : {
    app : '../app',
    jquery : 'jquery-1.8.1.min',
    underscore : 'underscore-min',
    handlebars : 'handlebars-1.0.0.beta.6',
    myclass : 'my.class',
    Box2D : 'Box2D'
  },
  shim : {
    underscore : {
      exports : '_' 
    },
    handlebars : {
      exports : 'Handlebars' 
    },
    myclass : {
      exports : 'my' 
    },
    Box2D : {
      exports : 'Box2D'
    }
  }
});

// load all dependencies here
requirejs([
  'app/game',
  'Box2D',
  'jquery',
  'underscore',
  'handlebars'
],
function(app) {
  $(document).ready(function() {
    VAPI.onReady(function(){
      var veroldApp = new VeroldApp(),
          asteroidsApp = new AsteroidsApp(veroldApp),
          veroldApps = {
            verold: veroldApp,
            asteroids: asteroidsApp
          };

      veroldApp.initialize({
        container: null,
        projectId: '514219ce0b4e5d0200000344',
        enablePostProcess: false,
        enablePicking: false,
        handleInput: false,
        clearColor: 0xff0000,
        success: function() {
          asteroidsApp.startup();
          app.start(veroldApps);
        }
      })

    })
  })
});
