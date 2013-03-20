MyApp = function( veroldApp ) {

  this.veroldApp = veroldApp;  
  this.mainScene;
  this.camera;
  this.cameraControls;
  
}

MyApp.prototype.startup = function( ) {

  var that = this;

  // Turn off shadows; building is an interior; we could setup point lights, but this is much easier
  that.veroldApp.getRenderer().shadowMapEnabled = false;

	this.veroldApp.loadScene( null, {
    
    success_hierarchy: function( scene ) {

      // hide progress indicator
      AppUI.hideLoadingProgress();

      that.inputHandler = that.veroldApp.getInputHandler();
      that.renderer = that.veroldApp.getRenderer();
      that.picker = that.veroldApp.getPicker();
      
      //Bind to input events to control the camera
      that.veroldApp.on("keyDown", that.onKeyPress, that);
      that.veroldApp.on("mouseUp", that.onMouseUp, that);
      that.veroldApp.on("fixedUpdate", that.fixedUpdate, that );
      that.veroldApp.on("update", that.update, that );

      //Store a pointer to the scene
      that.mainScene = scene;
      
      var models = that.mainScene.getAllObjects( { "filter" :{ "model" : true }});
      var model = models[ _.keys( models )[0] ].threeData;
      
      //Create the camera
      that.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
      that.camera.up.set( 0, 1, 0 );
      that.camera.position.set(0, 0.1, 0);
      
      var lookAt = new THREE.Vector3();
      lookAt.add( model.center );
      lookAt.multiply( model.scale );
      lookAt.applyQuaternion( model.quaternion );
      lookAt.add( model.position );
     
      console.log("lookAt: ", lookAt);

      lookAt.x = 0.01;
      lookAt.y = 0.01;
      lookAt.z = 0;

      that.camera.lookAt( lookAt );
      
      //Tell the engine to use this camera when rendering the scene.
      that.veroldApp.setActiveCamera( that.camera );

      // Load controls
      veroldApp.loadScript("javascripts/controls/RollControls.js", function() {
        that.cameraControls = new THREE.RollControls(that.camera, that.veroldApp.getRenderer().domElement); 
        that.cameraControls.clickToMove = false;
      });

    },

    progress: function(sceneObj) {
      var percent = Math.floor((sceneObj.loadingProgress.loaded_hierarchy / sceneObj.loadingProgress.total_hierarchy)*100);
      that.veroldApp.setLoadingProgress(percent); 
    }
  });
	
}


MyApp.prototype.shutdown = function() {
  this.veroldApp.off("keyDown", this.onKeyPress, this);
  this.veroldApp.off("mouseUp", this.onMouseUp, this);
  this.veroldApp.off("update", this.update, this );
}


MyApp.prototype.update = function( delta ) {
  if (this.cameraControls) {
    this.cameraControls.update(delta);
  }
}


MyApp.prototype.fixedUpdate = function( delta ) {
}


MyApp.prototype.onMouseUp = function( event ) {
  
  if ( event.button == this.inputHandler.mouseButtons[ "left" ] && 
    !this.inputHandler.mouseDragStatePrevious[ event.button ] ) {
    
    var mouseX = event.sceneX / this.veroldApp.getRenderWidth();
    var mouseY = event.sceneY / this.veroldApp.getRenderHeight();
    var pickData = this.picker.pick( this.mainScene.threeData, this.camera, mouseX, mouseY );
    if ( pickData ) {

      if (pickData.meshID == "513f4c25014ba00200000135") {
        // Cathedrale
        $("#mesh513f4c25014ba00200000135").show();
      }
      else if (pickData.meshID == "513f4c26014ba0020000019e") {
        // Pantheon
        $("#mesh513f4c26014ba0020000019e").show();
      }
      else if (pickData.meshID == "513f4c26014ba002000001a1") {
        // Temple Athena
        $("#mesh513f4c26014ba002000001a1").show();
      }
      else if (pickData.meshID == "513f4c25014ba00200000149") {
        // Lions Gate
        $("#mesh513f4c25014ba00200000149").show();
      }
      else if (pickData.meshID == "513f4c24014ba00200000122") {
        // Abbey St Gilles
        $("#mesh513f4c24014ba00200000122").show();
      }
      
      console.log("Picked: " + pickData.meshID);

      //Bind 'pick' event to an asset or just let user do this how they want?
      if ( pickData.meshID == "51125eb50a4925020000000f") {
        //Do stuff
      }
    }
  }
}

MyApp.prototype.onKeyPress = function( event ) {
	
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
    
}
