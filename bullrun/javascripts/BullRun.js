BullRun = function( veroldApp ) {

  this.veroldApp = veroldApp;  
  this.mainScene;
  this.camera;
  this.numDrivers = 20;
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

      that.setupTrack();
      that.setupFlockController( that.track );

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
}

BullRun.prototype.setupDebugCamera = function() {

  // var models = this.mainScene.getAllObjects( { "filter" :{ "model" : true }});
  // var model = models[ _.keys( models )[0] ].threeData;
  
  //Create the camera
  this.debugCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
  this.debugCamera.useQuaternion = true;
  
  //Tell the engine to use this camera when rendering the scene.
  this.veroldApp.setActiveCamera( this.debugCamera );

  this.debugCameraController = new DebugCameraController();
  var debugCameraParams =  {
    "name": "EditorNavModule",
    "camera": this.debugCamera, 
    "veroldEngine": this.veroldApp.veroldEngine,
    "initialXAngle" : Math.PI / 6.0,
    "initialYAngle" : -Math.PI / 11.0,
    "lookSpeed" : 1.5,
    "position" : { x: 0.5, y: 0.3, z: 0.9}
  };
  
  this.debugCameraController.initialize( debugCameraParams );
  
}

BullRun.prototype.setupTrack = function() {
  this.track = new Track( this.veroldApp );
  this.track.initialize( this.mainScene );
}

BullRun.prototype.setupFlockController = function( track ) {
  this.flock = new FlockController( this.veroldApp );
  this.flock.initialize( track, this.numDrivers );
}

BullRun.prototype.onKeyPress = function( event ) {
	
	var keyCodes = this.inputHandler.keyCodes;
  if ( event.keyCode === keyCodes['B'] ) {
    var that = this;
    this.boundingBoxesOn = !this.boundingBoxesOn;
    var scene = veroldApp.getActiveScene();
    
    scene.traverse( function( obj ) {
      if ( obj.isBB ) {
        obj.visible = that.boundingBoxesOn;
      }
    });
  
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
