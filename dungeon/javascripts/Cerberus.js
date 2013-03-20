Cerberus = function(model) {
  this.model = model;
  this.animation = undefined;

  this.setAnimation('CIdle');
  console.log(this.model);
}

Cerberus.prototype.fixedUpdate = function(delta) {
}

Cerberus.prototype.update = function(delta) {
}

Cerberus.prototype.setAnimation = function(animation) {
  var that = this;
  if (this.animation != animation) {
    console.log('Setting animation', animation);

    this.model.traverse(function(obj) {
      if (obj instanceof SkinnedMeshObject) {

        that.animation = animation;

        obj.set('payload.animationState', 'pause');
        obj.set('payload.animationName', animation);
        obj.set('payload.animationState', 'play');
      }
    });
  }
}
