/*global requirejs:true */

requirejs.config({
  baseUrl : './scripts/lib',
  paths : {
    app : '../app',
    jquery : 'jquery-1.8.1.min',
    underscore : 'underscore-min',
    handlebars : 'handlebars-1.0.0.beta.6',
    myclass : 'my.class',
    Box2D : 'Box2D',
    verold_api_v1 : 'http://assets.verold.com/verold_api/verold_api_v1_norequire',
    VeroldApp : '../app/VeroldApp',
    AsteroidsApp : '../app/AsteroidsApp'
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
    },
    VeroldApp : {
      exports : 'VeroldApp'
    },
    AsteroidsApp : {
      exports : 'AsteroidsApp'
    }
  }
});

// load all dependencies here
requirejs([
  'app/game',
  'Box2D',
  'jquery',
  'underscore',
  'handlebars',
  'verold_api_v1',
  'VeroldApp',
  'AsteroidsApp'
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
          asteroidsApp.startup(function() {
            app.start(veroldApps);
          });
        }
      });

    });
  });
});
