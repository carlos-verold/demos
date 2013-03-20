/*global define:true, my:true */
define([
    'myclass',
    'app/actor',
    'app/util'
] , function(
    my,
    Actor,
    util
) {
    
  Projectile = my.Class(Actor,{

    constructor : function(config) {
      if(!(this instanceof Projectile)) {
          return new Projectile(config);
      }

      this.attributes = {},
      this.attributes = _.extend(this.attributes,config);

      var points = util.generateCircPoints(16,this.attributes.radius);

      this.attributes.states = {
        'default':{
          'points':points,
          'scale':this.attributes.drawScale || 20,
          'drawStyles':{
            'lineWidth':2.0,
            'lineCap':'round',
            'lineJoin':'round',
            'strokeStyle':'#990000',
            'fillStyle':'#cc0000'
          }
        }
      };

      Projectile.Super.call(this,this.attributes);

      // specify lifespan for projectile
      setTimeout($.proxy(function() {
        this.destroy();
      },this), 500);

    }

  });

  return Projectile;

});
