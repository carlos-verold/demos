/*global define:true, my:true  */

define([
  'myclass',
  'app/actor',
  'app/util'
] , function(
  my,
  Actor,
  util
) {

  Asteroid = my.Class(Actor,{

    constructor : function(config) {
      if(!(this instanceof Asteroid)) {
          return new Asteroid(config);
      }

      this.attributes = {},
      this.attributes = _.extend(this.attributes,config);

      var points = util.generateCircPoints(8,this.attributes.radius);

      this.attributes.states = {
        'default':{
          'points':points,
          'scale':this.attributes.drawScale || 10,
          'drawStyles':{
            'lineWidth':9.0,
            'lineCap':'round',
            'lineJoin':'round',
            'strokeStyle':'#222',
            'fillStyle':'#333'
          }
        }
      };

      Asteroid.Super.call(this,this.attributes);
    }

  });

  return Asteroid;

});

