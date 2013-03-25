/*global define:true, my:true  */

define([
  'myclass',
  'app/actor',
  'app/util',
  'app/point'
] , function(
  my,
  Actor,
  util,
  Point
) {

  Ship = my.Class(Actor,{

    constructor : function(config) {
      if(!(this instanceof Ship)) {
        return new Ship(config);
      }

      this.attributes = {},
      this.attributes = _.extend(this.attributes,config);

      this.nose = new Point(40,0); 

      this.attributes.states = {
        'default':{
          'points':[
            {x:-20, y:  0}, // tail
            {x:-10, y: 15},
            {x: -2, y: 15},
            this.nose, // nose
            {x: -2, y:-15},
            {x:-10, y:-15}
          ],
          'scale':this.attributes.drawScale || 2,
          'drawStyles':{
            'lineWidth':3.0,
            'lineCap':'round',
            'lineJoin':'round',
            'strokeStyle':'#111',
            'fillStyle':'#666666'
          }
        }
      };

      this.attributes.shields = 100;
      this.attributes.force = 4000;
      this.attributes.torque = (!!this.attributes.torque) ?
        this.attributes.torque : 8000;

      this.attributes.angularDamping = 1;
      this.attributes.linearDamping = 0.4;

      Ship.Super.call(this,this.attributes);

      window.asteroids.events.on('collision:ship',function(e,actor) {
        this.depleteShields();
      },this);
  
    },

    update : function() {

      var keys = this.attributes.stage.getKeys(),
          localVector,
          worldVector,
          angle;

      if(keys.up) {
        localVector = this.attributes.physics.b2Vec2(this.attributes.force,0);
        worldVector = this.body.GetWorldVector(localVector);
        this.body.ApplyForce(worldVector,this.body.GetWorldCenter());
      }

      if(keys.left) {
        this.body.ApplyTorque(-this.attributes.torque);
      }

      if(keys.right) {
        this.body.ApplyTorque(this.attributes.torque);
      }

      if(keys.space) {
        this.propelProjectile();
      }

      Ship.Super.prototype.update.call(this);

    },

    adjustDirection : function(angle,step) {
      var d = angle + step;
      if(Math.abs(d) > Math.PI) { d = -(d - (d % Math.PI)); }
      return d;
    },

    propelProjectile : _.throttle(function() {
    
      var localNoseVector,
          worldNoseVector,
          bodyPosition,
          scale,
          nosePosition,
          projConf,
          localVector,
          worldVector,
          force;

      localNoseVector = this.attributes.physics.b2Vec2(this.nose.x*2.5,this.nose.y);
      worldNoseVector = this.body.GetWorldVector(localNoseVector);
      bodyPosition = this.attributes.physics.getBodyPosition(this.body);
      nosePosition = this.attributes.physics.addVector2(worldNoseVector,bodyPosition);

      localVector = this.attributes.physics.b2Vec2(10000,0);
      worldVector = this.body.GetWorldVector(localVector);
      force = this.attributes.physics.addVector2(this.body.GetLinearVelocity(),worldVector);

      // console.info(force.Length());

      projConf = {
        actorType: 'projectile',
        position: nosePosition,
        radius: 0.5,
        angle: this.body.GetAngle(),
        initialForce: force.Length()
      };

      this.attributes.stage.createActor(projConf);

    },100),

    depleteShields : function() {
      this.attributes.shields -= 5;
      if(this.attributes.shields <= 0)
        window.asteroids.events.trigger('game:gameover');
    },

    getShields : function() {
      return this.attributes.shields;
    },

    reset : function() {
      this.attributes.shields = 100;
    }

  });

  return Ship;

});
