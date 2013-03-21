BullRun = function( veroldApp ) {

  this.veroldApp = veroldApp;  
  this.mainScene;
  this.camera;
  this.numDrivers = 20;
  this.numHumanPlayers = 1;
  this.physicsDebugOn = true;
}

BullRun.prototype.startup = function( ) {

  var that = this;

	this.veroldApp.loadScene( null, {
    
    success_hierarchy: function( scene ) {

      // hide progress indicator
      that.veroldApp.hideLoadingProgress();

      that.inputHandler = that.veroldApp.getInputHandler();
      that.renderer = that.veroldApp.getRenderer();
      that.picker = that.veroldApp.getPicker();
      
      //Bind to input events
      that.veroldApp.on("keyDown", that.onKeyPress, that);

      //Bind to main update loop
      that.veroldApp.on("update", that.update, that );

      //Store a pointer to the scene
      that.mainScene = scene;

      //Initialize the debug camera
      that.setupDebugCamera();

      that.physicsSim = new PhysicsController( that.veroldApp );
      that.physicsSim.initialize( );

      that.setupTrack();
      that.setupFlockController( that.track );

      that.setupDriverCamera( that.flock.getHumanDriver() );
      //that.setupHumanDriver( that.flock.getHumanDriver() );
      var lights = that.mainScene.getAllObjects( { filter: { "light" : true }});
      for ( var x in lights ) {
        if ( lights[x].threeData instanceof THREE.DirectionalLight && lights[x].threeData.parent ) {
          that.mainLight = lights[x];
          that.mainLight.threeData.shadowCameraLeft = -5.0;
          that.mainLight.threeData.shadowCameraRight = 5.0;
          that.mainLight.threeData.shadowCameraTop = 5.0;
          that.mainLight.threeData.shadowCameraBottom = -5.0;
        }
      }

      that.cycleCamera();
    },

    progress: function(sceneObj) {
      var percent = Math.floor((sceneObj.loadingProgress.loaded_hierarchy / sceneObj.loadingProgress.total_hierarchy)*100);
      that.veroldApp.setLoadingProgress(percent); 
    }
  });
	
}

BullRun.prototype.shutdown = function() {
	
  this.veroldApp.off("keyDown", this.onKeyPress, this);
  this.veroldApp.off("update", this.update, this );
}

BullRun.prototype.update = function( delta ) {
  if ( this.debugCameraController ) this.debugCameraController.update( delta );
  if ( this.driverCameraController ) this.driverCameraController.update( delta );

  if ( this.mainLight ) {
    var vehicle = this.flock.getHumanDriver().vehicle;
    if ( vehicle ) {
      var position = vehicle.getPosition();
      this.mainLight.threeData.target.position.set( position.x, position.y, position.z);
      this.mainLight.threeData.position.set( position.x + 2, 5, position.z + 2 );// updateMatrix();
      //this.mainLight.threeData.shadowCameraVisible = true;
    }
  }
}

BullRun.prototype.cycleCamera = function( ) {
  if ( !this.driverCameraController.enableUpdates ) {
    this.debugCameraController.enableUpdates = false;
    this.driverCameraController.enableUpdates = true;
    this.veroldApp.setActiveCamera( this.driverCamera );
  }
  else {
    this.debugCameraController.enableUpdates = true;
    this.driverCameraController.enableUpdates = false;
    this.veroldApp.setActiveCamera( this.debugCamera );
  }
}

BullRun.prototype.setupDebugCamera = function() {

  //Create the camera
  this.debugCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
  this.debugCamera.useQuaternion = true;
  
  //Tell the engine to use this camera when rendering the scene.
  this.veroldApp.setActiveCamera( this.debugCamera );

  this.debugCameraController = new DebugCameraController();
  var debugCameraParams =  {
    "camera": this.debugCamera, 
    "veroldEngine": this.veroldApp.veroldEngine,
    "initialXAngle" : Math.PI / 6.0,
    "initialYAngle" : -Math.PI / 11.0,
    "lookSpeed" : 1.5,
    "position" : { x: 0.5, y: 0.3, z: 0.9}
  };
  
  this.debugCameraController.initialize( debugCameraParams );
  
}

BullRun.prototype.setupDriverCamera = function( humanDriver ) {

  //Create the camera
  this.driverCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
  this.driverCamera.useQuaternion = true;
  
  //Tell the engine to use this camera when rendering the scene.
  //this.veroldApp.setActiveCamera( this.driverCamera );

  this.driverCameraController = new DriverCameraController();
  var driverCameraParams =  {
    "name": "DriverCamera1",
    "camera": this.driverCamera, 
    "veroldEngine": this.veroldApp.veroldEngine,
    "interpSpeed" : 1.5,
    "offset" : { x: -1.5, y: 1.0, z: 0.0 },
    "targetDriver" : humanDriver,
  };
  
  this.driverCameraController.initialize( driverCameraParams );
  
}

BullRun.prototype.setupTrack = function( ) {
  this.track = new Track( this.veroldApp );
  this.track.initialize( this.physicsSim, this.mainScene );
}

BullRun.prototype.setupFlockController = function( track ) {
  this.flock = new FlockController( this.veroldApp );
  this.flock.initialize( this.physicsSim, track, this.numDrivers, this.numHumanPlayers );
}

BullRun.prototype.onKeyPress = function( event ) {
	
	var keyCodes = this.inputHandler.keyCodes;
  if ( event.keyCode === keyCodes['C'] ) {
    this.cycleCamera();
  }
  else if ( event.keyCode === keyCodes['Z'] ) {
    this.physicsDebugOn = !this.physicsDebugOn;
    this.flock.physicsSim.toggleDebugDraw( this.physicsDebugOn );
  }
  else if ( event.keyCode === keyCodes['X'] ) {
    for ( var x in this.flock.vehicles ) {
      console.log( "Vehicle's velocity is ", this.flock.vehicles[x].physicsBody.GetLinearVelocity() );
    }
  }
    
}
