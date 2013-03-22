/*global define:true, my:true */

define([
  'myclass',
  'app/util'
] , function(
  my,
  util
) {

  Actor = my.Class({

    constructor : function(config) {
      if(!(this instanceof Actor)) {
        return new Actor(config);
      }

      this.attributes = {},
      this.attributes = _.extend(this.attributes,config);
      this.initialize();
    },

    initialize : function() {

      this.scale = this.attributes.physics.getScale();

      this.attributes.state = 'default';

      // create Box2D body object
      var bodyConfig = {
        shapeType: 'circle',
        bodyType: 'dynamic',
        position: this.attributes.position,
        angle: this.attributes.angle,
        radius: this.attributes.radius,
        angularDamping: this.attributes.angularDamping || 0,
        linearDamping: this.attributes.linearDamping || 0
      };

      var physElements = this.attributes.physics.createBody(bodyConfig);

      this.body = physElements.body;
      this.fixture = physElements.fixture;

      this.body.SetUserData(this);

      if(!!this.attributes.initialForce) {
        var localVector = this.attributes.physics.b2Vec2(this.attributes.initialForce,0),
            worldVector = this.body.GetWorldVector(localVector);
        this.body.SetLinearVelocity(worldVector,this.body.GetWorldCenter());
      }

      if(!!this.attributes.angularVelocity) {
        this.body.SetAngularVelocity(util.tr(this.attributes.angularVelocity));
      }

      if(!!this.attributes.model) {
        this.setModel(this.attributes.model);
      }

      // create vector graphic
      // if(!this.attributes.states) {
      //   this.attributes.states = {
      //     'default':{
      //       'points':util.generateCircPoints(8,this.attributes.radius*this.scale),
      //       'scale':this.attributes.drawScale || 1,
      //       'drawStyles':{
      //         'lineWidth':3.0,
      //         'lineCap':'round',
      //         'lineJoin':'round',
      //         'strokeStyle':'#111',
      //         'fillStyle':'#666666'
      //       }
      //     }
      //   };
      // }
      //
      this.rotationVector = new THREE.Vector3(0,0,1);

    },

    update : function() {
      var bpos = this.body.GetPosition(),
          apos = this.attributes.position,
          scaleConversion = 35.5,
          bounds = this.attributes.stage.getBounds(),
          mpos;

      // position based on b2 body
      apos.x = bpos.x * this.scale;
      apos.y = bpos.y * this.scale;
      this.attributes.angle = this.body.GetAngle();

      if(!!this.attributes.model) {
        model = this.attributes.model;
        model.position.x = (apos.x - (bounds.x2/2)) / scaleConversion;
        model.position.y = (-(apos.y - (bounds.y2/2))) / scaleConversion;

        model.quaternion.setFromAxisAngle(this.rotationVector,-this.attributes.angle);

        this.attributes.modelPosition = model.position;        
      }
    },

    getModelPosition : function() {
      return (!!this.attributes.modelPosition) ? this.attributes.modelPosition : null;
    },

    setModel : function(model) {
      model.scale.multiplyScalar(5);
      this.attributes.model = model;
    },

    setStates : function(states) {
      this.attributes.states = states;
    },

    getStates : function() {
      return this.attributes.states;
    },

    render : function() {
      // var canvas = this.attributes.stage.getCanvas();
      // canvas.drawShape(_.extend({
      //   direction: this.attributes.angle,
      //   position: this.attributes.position
      // },this.attributes.states[this.attributes.state]));
    },

    destroy : function() {
      this.body.DestroyFixture(this.fixture);
      this.attributes.physics.getWorld().DestroyBody(this.body);
      this.attributes.stage.removeActor(this);
      // this.attributes.model.parent.remove(this.attributes.model);
    }

  });

  return Actor;

});
