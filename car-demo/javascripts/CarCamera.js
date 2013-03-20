CarCamera = function(  ) {
	this.threeCamera;
	this.threeCamera = new THREE.PerspectiveCamera( 30, 1.8, 0.01, 1500 );
	this.threeCamera.position.set( 0.0,0.15,0.75);
	this.threeCamera.useQuaternion = true;
	this.targetPosition = new THREE.Vector3( 0.0, 0.15, 0.0 );
};

CarCamera.prototype.initialize = function( fov, width, height, target ) {
	this.threeCamera.fov = fov;
	this.threeCamera.aspect = width / height;
	this.threeCamera.updateProjectionMatrix();
	window.verold.veroldEvents.on("engine::input::mouseMove", this.onMouseMove, this);
};

CarCamera.prototype.uninitialize = function( ) {
	window.verold.veroldEvents.off("engine::input::mouseMove", this.onMouseMove, this);
}

CarCamera.prototype.setTargetModel = function( target ) {
	this.targetPosition.add( target.position );
},

CarCamera.prototype.onMouseMove = function( params ) {
	this.threeCamera.position.x += ( params.mouseDelta.x - this.threeCamera.position.x ) * 0.0000750;
	this.threeCamera.position.y += ( - params.mouseDelta.y - this.threeCamera.position.y ) * 0.0005;
	this.threeCamera.position.y = Math.max( -0.05, this.threeCamera.position.y );
	this.threeCamera.position.y = Math.min( 0.2, this.threeCamera.position.y );
	this.threeCamera.position.x = Math.max( -0.125, this.threeCamera.position.x );
	this.threeCamera.position.x = Math.min( 0.075, this.threeCamera.position.x );

	this.threeCamera.lookAt( this.targetPosition );

}

CarCamera.prototype.getCamera = function() {
	return this.threeCamera;
}

// CarCamera.prototype.convertScreenPos = function( screenPos ) {
// 	// var vector = new THREE.Vector3( screenPos.x, screenPos.y, 0.0);
//  //  var projector = new THREE.Projector();
  
//  //  projector.unprojectVector( vector, this.threeCamera );
  
//  //  return new THREE.Vector2( vector.x, vector.y );

//   var sceneHalfHeight = Math.abs( this.threeCamera.position.z) * Math.tan( this.threeCamera.fov * Math.PI / 360.0 );
//   var sceneHalfWidth = sceneHalfHeight * this.threeCamera.aspect;
//   // console.log( screenPos.x * sceneHalfWidth );
//   // console.log( screenPos.y * sceneHalfHeight );
//   return new THREE.Vector2( screenPos.x * sceneHalfWidth, screenPos.y * sceneHalfHeight );
// }

