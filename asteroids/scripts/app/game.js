/*global define:true */

define([
  'app/stage',
  'app/actorfactory',
  'app/util',
  'app/customevents',
  'app/userinterface'
] , function(
  Stage,
  ActorFactory,
  util,
  CustomEvents,
  UserInterface
) {


  var stage = new Stage(),
      gameActions,
      veroldApps,
      ui = new UserInterface();

  // ui = new UserInterface(new CanvasWrapper($('<canvas id="ui">').appendTo('body')));

  window.asteroids = {};
  window.asteroids.events = new CustomEvents();

  stage.setContactListeners({
    BeginContact : function(contact) {
      var a = contact.GetFixtureA().GetBody().GetUserData(),
          b = contact.GetFixtureB().GetBody().GetUserData(),
          target;
          
      if(a.attributes.actorType === 'ship' || b.attributes.actorType === 'ship') {
        target = (a.attributes.actorType === 'ship') ? a : b;
        window.asteroids.events.trigger('collision:ship',target);
      }

      if((a.attributes.actorType === 'projectile' && b.attributes.actorType === 'asteroid') ||
        (a.attributes.actorType === 'asteroid' && b.attributes.actorType === 'projectile')) {
        stage.scheduleActorForRemoval(a);
        stage.scheduleActorForRemoval(b);
      }
    }
  });


  gameActions = {
    start : function(){

      stage.setVeroldApps(veroldApps);

      this.addShip();

      // adding asteroids
      var i = 0, l = 15;
      for(i=0;i<l;i+=1) {
        this.addAsteroid();
      }

      stage.initAnim();
    },

    initVAPI : function() {

      var that = this;
    
      VAPI.onReady(function(){

        var veroldApp = new VeroldApp(),
            asteroidsApp = new AsteroidsApp(veroldApp,ui);

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
              that.start();
            });
          }
        });

      });
    },

    addAsteroid : function() {
      var bnds = stage.getBounds(),
          position = {
            x: util.randRange(bnds.x1,bnds.x2),
            y: util.randRange(bnds.y1,bnds.y2)
          },
          angularVelocity = 15,
          asteroid;

      asteroid = stage.createActor({
        actorType: 'asteroid',
        position: position,
        angle: util.randRange(0,360),
        initialForce: util.randRange(10,20),
        angularVelocity: util.randRange(-angularVelocity,angularVelocity),
        radius: 4
      });

      veroldApps.asteroids.createAsteroidModel(function(model) {
        asteroid.setModel(model);
      });
    },

    addShip : function() {
      stage.createActor({
        actorType: 'ship',
        position: stage.getCenterPoint(),
        angle: 0,
        radius: 5,
        model: veroldApps.asteroids.getShipModel()
      });
    }
  };

  return {
    start : function() {
      gameActions.initVAPI();
    }
  };

});
