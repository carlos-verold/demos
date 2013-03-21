DriverCameraController = function( properties ) {
  
  this.veroldEngine = undefined;
  this.name = undefined;

  //this._moveVector = new THREE.Vector3();
  this.tempVector1 = new THREE.Vector3();
  
  //this.enablePointerLock = false;
  this.enableUpdates = false;
}

DriverCameraController.prototype = {
  
  constructor: DriverCameraController,

  initialize: function( properties ) {
    
    this.veroldEngine = properties.veroldEngine;
    
    this.name = properties.name ? properties.name : "DriverCameraController";
    this.camera = properties.camera;
    
    this.offset = properties.offset ? properties.offset : { x: -1, y: 1, z: 0 };
    this.targetDriver = properties.targetDriver;
    
    this.currentTargetPos = new THREE.Vector3();

    // this.veroldEngine.on( 'mouseUp', this.onMouseUp, this );
    // this.veroldEngine.on( 'mouseDown', this.onMouseDown, this );
    // this.veroldEngine.on( 'mouseMove', this.onMouseMove, this );
    //this.veroldEngine.on( 'mouseScroll', this.onMouseScroll, this );

    //this.updateCameraRotation();
  },

  uninitialize: function() {
    
    this.name = undefined;
    this.camera = undefined;
    
    // this.veroldEngine.off( 'mouseUp', this.onMouseUp, this );
    // this.veroldEngine.off( 'mouseDown', this.onMouseDown, this );
    // this.veroldEngine.off( 'mouseMove', this.onMouseMove, this );
    //this.veroldEngine.off( 'mouseScroll', this.onMouseScroll, this );
    
    this.veroldEngine = undefined;
  },

  // updateCameraRotation: function( ) {
  //   //Look at driver

  //   if ( this._xAngle > Math.PI ) this._xAngle -= 2.0 * Math.PI;// {= Math.min( Math.PI, Math.max( -Math.PI, this._xAngle));
  //   if ( this._xAngle < -Math.PI ) this._xAngle += 2.0 * Math.PI;
  //   this._yAngle = Math.min( Math.PI / 2.0, Math.max( -Math.PI / 2.0, this._yAngle));
  //   this.lookVector.set( this._yAngle, this._xAngle, 0 );
  //   this.camera.quaternion.setFromEuler( this.lookVector, 'YXZ' );

  // },

  update: function( delta ) {
    
    if ( this.enableUpdates && this.targetDriver.vehicle ) {

      var targetPos = this.targetDriver.vehicle.getPosition();
      this.currentTargetPos.lerp( targetPos, 0.15 );

      var vehicleOrientation = this.targetDriver.vehicle.getOrientation();
      //this.camera.quaternion.slerp( targetOrientation, 0.5 );

      this.tempVector1.copy( this.offset );
      this.tempVector1.applyQuaternion( vehicleOrientation );
      this.tempVector1.add( targetPos );
      this.camera.position.lerp( this.tempVector1, 0.15 );

      //this.tempQuaternion1.lookAt( )

      //var targetOrientation.setFromEuler( this.tempVector1 );
      //this.camera.position.addVectors( this.tempVector1, this.currentTargetPos );
      this.camera.lookAt( this.currentTargetPos );
    }
    
  },


}
