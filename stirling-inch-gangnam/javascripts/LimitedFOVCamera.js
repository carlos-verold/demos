//
// This camera is super ghetto - kinda works, but needs some love.
//

LimitedFOVCamera = function( perspectiveCamera ) {
	this.threeCamera = perspectiveCamera;
	this.targetPosition;

	this.mouseX;
	this.windowHalfX;
};

LimitedFOVCamera.prototype.setTarget = function(model) {
      
      var lookAt = new THREE.Vector3();
      lookAt.add( model.center );
      lookAt.multiply( model.scale );
      lookAt.applyQuaternion( model.quaternion );
      lookAt.add( model.position );
      this.threeCamera.lookAt( lookAt );
	  this.targetPosition = model.position;
}

LimitedFOVCamera.prototype.initialize = function(veroldEngine) {
	veroldEngine.on("mouseMove", this.onMouseMove, this);
}

LimitedFOVCamera.prototype.uninitialize = function( ) {
	window.verold.veroldEvents.off("engine::input::mouseMove", this.onMouseMove, this);
}

LimitedFOVCamera.prototype.onMouseMove = function( params ) {
	this.windowHalfX = window.innerWidth / 2;
	this.mouseX = ( params.clientX - this.windowHalfX ) * .0015;
	this.mouseY = (( window.innerHeight - params.clientY ) * .0003) + .3;
}

LimitedFOVCamera.prototype.updateCamera = function() {
	// TODO: Handle window resize
	if (this.mouseX) this.threeCamera.position.x = this.mouseX;
	if (this.mouseY) this.threeCamera.position.y = this.mouseY;

	var lookAt = new THREE.Vector3(this.mouseX, this.mouseY, 0);
	this.threeCamera.lookAt(lookAt);
}

