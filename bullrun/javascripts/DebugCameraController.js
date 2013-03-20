DebugCameraController = function( properties ) {
  
  this.veroldEngine = undefined;
  this.name = undefined;
  this._xAngle = 0;
  this._yAngle = 0;
  this._moveVector = new THREE.Vector3();
  
  this.enablePointerLock = false;
  this.enableUpdates = true;
}

DebugCameraController.prototype = {
  
  constructor: DebugCameraController,

  initialize: function( properties ) {
    
    this.veroldEngine = properties.veroldEngine;
    
    this.name = properties.name ? properties.name : "DebugCameraController";
    this.camera = properties.camera;
    
    
    this.invertY = properties.invertY ? true : false;
    this.invertX = properties.invertX ? true : false;
    this.panSpeed = properties.panSpeed ? properties.panSpeed : 1.0;
    this.lookSpeed = properties.lookSpeed ? properties.lookSpeed : 1.0;
    this._xAngle = properties.initialXAngle ? properties.initialXAngle : 0.0;
    this._yAngle = properties.initialYAngle ? properties.initialYAngle : 0.0;
    this.enablePointerLock = properties.pointerLock ? properties.pointerLock : false;
    var position = properties.position ? properties.position : { x: 0, y: 0, z: 0 };
    this.camera.position.set( position.x, position.y, position.z );
    
    this.lookVector = new THREE.Vector3();

    this.veroldEngine.on( 'mouseUp', this.onMouseUp, this );
    this.veroldEngine.on( 'mouseDown', this.onMouseDown, this );
    this.veroldEngine.on( 'mouseMove', this.onMouseMove, this );
    //this.veroldEngine.on( 'mouseScroll', this.onMouseScroll, this );

    this.updateCameraRotation();
  },

  uninitialize: function() {
    
    this.name = undefined;
    this.camera = undefined;
    this.invertY = undefined;
    this.invertX = undefined;
    this.panSpeed = undefined;
    this.lookSpeed = undefined;

    this.enablePointerLock = false;

    this.veroldEngine.off( 'mouseUp', this.onMouseUp, this );
    this.veroldEngine.off( 'mouseDown', this.onMouseDown, this );
    this.veroldEngine.off( 'mouseMove', this.onMouseMove, this );
    //this.veroldEngine.off( 'mouseScroll', this.onMouseScroll, this );
    
    this.veroldEngine = undefined;
  },


  setCameraProperties: function( position, xAngle, yAngle ) {
    this.camera.position.set( position.x, position.y, position.z );
    this._xAngle = xAngle;
    this._yAngle = yAngle;

  },

  getCameraProperties: function( ) {
    if ( this.camera ) {
      return { 
        "position": { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z} , 
        "xAngle": this._xAngle, 
        "yAngle": this._yAngle,
      };
    }
    return null;
  },

  togglePointerLock: function( on ) {
    this.enablePointerLock = on;
    if ( !on ) {
      document.exitPointerLock();
    }
  },

  onMouseDown: function( event ) {
    if ( this.enableUpdates  ) {
      //this.enableUpdates = true;
      if ( this.enablePointerLock ) {
        event.target.requestPointerLock();
      }
    }
    
  },

  onMouseUp: function( event ) {
    if ( this.enableUpdates ) {
      //this.enableUpdates = true;
      if ( this.veroldEngine.Input.mouseButtonUp("left") && this.veroldEngine.Input.mouseButtonUp("right") ) {
        if ( this.enablePointerLock ) {
          document.exitPointerLock();
        }
      }
    }
    
  },

  onMouseMove: function( event ) {
    if ( this.enableUpdates  ) {
      var input = this.veroldEngine.Input;
      var rightButton = input.mouseButtonDown("right");
      var leftButton = input.mouseButtonDown("left");
      var middleButton = input.mouseButtonDown("middle");
      var ctrlKey = input.keyDown("ctrl");
      var mouseDelta = {};
      mouseDelta.x = event.mouseDelta.x;
      mouseDelta.y = event.mouseDelta.y;
    
      if ( leftButton ) {
        
        if ( rightButton || ctrlKey ) {
          //mouse pan
          var panAmountX = Math.pow( Math.abs( mouseDelta.x ), 1.25 ) * 0.0025 * this.panSpeed * (mouseDelta.x < 0 ? -1.0 : 1.0);;
          var panAmountY = Math.pow( Math.abs( mouseDelta.y ), 1.25 ) * 0.0025 * this.panSpeed * (mouseDelta.y < 0 ? 1.0 : -1.0);
          this._moveVector.set( panAmountX, panAmountY, 0);
          this._moveVector.x *= this.invertX ? -1.0 : 1.0;
          this._moveVector.y *= this.invertY ? -1.0 : 1.0;
          this._moveVector.applyQuaternion( this.camera.quaternion );
          this.camera.position.add( this._moveVector );

        }
        else {
          //mouse look
          var yAngleChange = mouseDelta.y * 0.0025 * this.lookSpeed;
          yAngleChange *= this.invertY ? 1.0 : -1.0;
          var xAngleChange = mouseDelta.x * 0.0025 * this.lookSpeed;
          xAngleChange *= this.invertX ? 1.0 : -1.0;

          this._xAngle += xAngleChange;
          this._yAngle += yAngleChange;

        }
        this.hasChanged = true;
      }
      else if ( rightButton || ctrlKey ) {
        
        //mouse look left/right
        var xAngleChange = mouseDelta.x * 0.0025 * this.lookSpeed;
        xAngleChange *= this.invertX ? 1.0 : -1.0;
        this._xAngle += xAngleChange;

        //mouse move forwards/backwards
        this._moveVector.set( 0, 0, mouseDelta.y * 0.005 * this.panSpeed );
        this._moveVector.z *= this.invertY ? -1.0 : 1.0;
        
        this._moveVector.applyQuaternion( this.camera.quaternion );
        this.camera.position.add( this._moveVector );

        this.hasChanged = true;
      }

      this.updateCameraRotation();
    }
  },

  // onMouseScroll: function( delta ) {
  //   if ( this.enableUpdates ) {
      
  //     //mouse move forwards/backwards
  //     this._moveVector.set( 0, 0, delta * -0.1 * this.panSpeed);
  //     this._moveVector.z *= this.invertY ? -1.0 : 1.0;
      
  //     this._moveVector.applyQuaternion( this.camera.quaternion );
  //     this.camera.position.add( this._moveVector );
  //     this.updateCameraRotation();
  //     this.hasChanged = true;
  //   }
  // },

  updateCameraRotation: function( ) {
    if ( this._xAngle > Math.PI ) this._xAngle -= 2.0 * Math.PI;// {= Math.min( Math.PI, Math.max( -Math.PI, this._xAngle));
    if ( this._xAngle < -Math.PI ) this._xAngle += 2.0 * Math.PI;
    this._yAngle = Math.min( Math.PI / 2.0, Math.max( -Math.PI / 2.0, this._yAngle));
    this.lookVector.set( this._yAngle, this._xAngle, 0 );
    this.camera.quaternion.setFromEuler( this.lookVector, 'YXZ' );

  },

  update: function( delta ) {
    
    if ( this.enableUpdates ) {
      //Check WASD state and move camera appropriately
      var input = this.veroldEngine.Input;
      var forwardKey = input.keyDown("W");
      var backwardKey = input.keyDown("S");
      var leftKey = input.keyDown("A");
      var rightKey = input.keyDown("D");

      if ( forwardKey || backwardKey || leftKey || rightKey ) {
        
        this._moveVector.set( 0, 0, 0);
        
        if ( forwardKey ) {
          this._moveVector.z = -2.0 * delta * this.panSpeed;
        }
        else if ( backwardKey ) {
          //mouse move forwards/backwards
          this._moveVector.z = 2.0 * delta * this.panSpeed;
        }
        if ( rightKey ) {
          
          this._moveVector.x = 2.0 * delta * this.panSpeed;
        }
        else if ( leftKey ) {
          //mouse move forwards/backwards
          this._moveVector.x = -2.0 * delta * this.panSpeed;
        }
        this._moveVector.applyQuaternion( this.camera.quaternion );
        this.camera.position.add( this._moveVector );

        this.hasChanged = true;
        
      }
      
    }
    
  },


}
