/*global define:true, my:true */

define([
  'myclass',
  'app/util',
  'app/actor',
  'app/ship',
  'app/asteroid',
  'app/projectile'
], function(
  my,
  util,
  Actor,
  Ship,
  Asteroid,
  Projectile
) {

  var actorTypes = {
    'Actor':Actor
  , 'Ship':Ship
  , 'Asteroid':Asteroid
  , 'Projectile':Projectile
  },

  ActorFactory = my.Class({

    constructor : function(config) {
      if(!(this instanceof ActorFactory)) {
        return new ActorFactory(config);
      }

      this.attributes = {},
      this.attributes = _.extend(this.attributes,config);

      // expose physics object
      this.attributes.physics = this.attributes.stage.getPhysics();
    },

    createActor : function(config) {
      var type = util.cap(config.actorType || 'actor');
      
      if(!(type in actorTypes)) return null;

      config = _.extend(config,this.attributes);

      // TODO: attach common default this.attributes to actors here for convenience

      return actorTypes[type](config);
    }

  });

  return ActorFactory;

});
