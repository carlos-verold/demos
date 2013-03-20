/*global define:true */

define(['app/stage','app/actorfactory','app/util','app/customevents'],
function(Stage,ActorFactory,util,CustomEvents) {

  var stage = new Stage(),
      gameActions;

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
    start : function(veroldApps){

      stage.setVeroldApps(veroldApps);

      this.addShip();

      // adding asteroids
      var i = 0, l = 10;
      for(i=0;i<l;i+=1) {
        this.addAsteroid();
      }

      stage.initAnim();
    },

    addAsteroid : function() {
      var bnds = stage.getBounds(),
          position = {
            x: util.randRange(bnds.x1,bnds.x2),
            y: util.randRange(bnds.y1,bnds.y2)
          },
          angularVelocity = 15;

      stage.createActor({
        actorType: 'asteroid',
        position: position,
        angle: util.randRange(0,360),
        initialForce: util.randRange(10,20),
        angularVelocity: util.randRange(-angularVelocity,angularVelocity),
        radius: 5
      });
    },

    addShip : function() {
      stage.createActor({
        actorType: 'ship',
        position: stage.getCenterPoint(),
        angle: 0,
        radius: 4
      });
    }
  };

  return {
    start : function(asteroidsApp) {
      gameActions.start(asteroidsApp);
    }
  };

});
