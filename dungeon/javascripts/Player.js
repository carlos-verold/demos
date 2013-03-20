Player = function(model, scene, inputHandler, touchControls) {
  this.model = model;
  this.inputHandler = inputHandler;
  this.touchControls = touchControls;

  this.setAnimation('Idle');

  this.tmpQuaternion = new THREE.Quaternion();

  var light = new THREE.PointLight( 0xFFFFFF, 1.5, 5 );
  light.position.set( 0, 1, -1);

  this.object = new THREE.Object3D();
  this.object.useQuaternion = true;
  this.object.position = new THREE.Vector3(0,0,0);
  this.object.add(this.model.threeData);
  this.object.add(light);

  scene.threeData.add(this.object);

  this.createCamera();
}

Player.prototype.keyDown = function(key) {
  return this.inputHandler.keyDown(key) || (this.touchControls && this.touchControls.keyDown(key));
}

Player.prototype.fixedUpdate = function(delta) {
	var keyCodes = this.inputHandler.keyCodes;

  if (this.keyDown('W')) {
    this.object.translateZ(0.015);
  }

  if (this.keyDown('A')) {
    this.tmpQuaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), 0.05);
    this.object.quaternion.multiply(this.tmpQuaternion);
  }

  if (this.keyDown('S')) {
    this.object.translateZ(-0.010);
  }

  if (this.keyDown('D')) {
    this.tmpQuaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), -0.05);
    this.object.quaternion.multiply(this.tmpQuaternion);
  }
}

Player.prototype.update = function() {
	var keyCodes = this.inputHandler.keyCodes;

  if (this.keyDown('space')) {
    this.setAnimation('Attack');
  } else if (this.keyDown('W') || this.keyDown('A') || this.keyDown('S') || this.keyDown('D')) {
    this.setAnimation('Walk');
  } else {
    this.setAnimation('Idle');
  }
}

Player.prototype.setAnimation = function(animation) {
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

Player.prototype.getCamera = function() {
  return this.camera;
}

Player.prototype.createCamera = function() {
  this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
  this.camera.up.set(0, 1, 0);

  this.camera.position.y = 1;
  this.camera.position.z = -2;

  var lookAt = new THREE.Vector3(0, 1, 0);
  this.camera.lookAt(lookAt);

  this.object.add(this.camera);
}
