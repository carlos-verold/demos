GangnamApp = function( veroldApp ) {
  this.veroldApp = veroldApp;  
  this.mainScene;
  this.limitedFOVCamera;
  this.camera;

  this.shotgun;

  this.headshots = 0;
  this.youdeads = 10;

  this.bGameOver = false;



}

GangnamApp.prototype.startup = function( ) {

  var that = this;

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
      that.veroldApp.on("update", that.update, that );

      // Store a pointer to the scene
      that.mainScene = scene;
      
      // Setup the camera
      that.limitedFOVCamera = new LimitedFOVCamera(
        new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000));
      that.limitedFOVCamera.threeCamera.up.set(0,1,0);
      that.limitedFOVCamera.threeCamera.position.set(0, 0.5, 1);

      // Point the camera at the middle zombie
      var target = that.mainScene.getObject("512fae14161c230200000aad").threeData;
      that.limitedFOVCamera.setTarget(target);

      // load the camera
      that.limitedFOVCamera.initialize(that.veroldApp.veroldEngine);
      that.camera = that.limitedFOVCamera.threeCamera;
      that.veroldApp.setActiveCamera( that.camera );

    },

    progress: function(sceneObj) {
      var percent = Math.floor((sceneObj.loadingProgress.loaded_hierarchy / sceneObj.loadingProgress.total_hierarchy)*100);
      AppUI.setLoadingProgress(percent);    
    }
  });
	
}

GangnamApp.prototype.shutdown = function() {
  this.veroldApp.off("keyDown", this.onKeyPress, this);
  this.veroldApp.off("mouseUp", this.onMouseUp, this);
  this.veroldApp.off("update", this.update, this );
  this.limitedFOVCamera.uninitialize();
}


GangnamApp.prototype.update = function( delta ) {
  
  if (this.bGameOver) { return; }

  // update the scoreboard
  $("#scoreboard #headshots").text(this.headshots); 
  $("#scoreboard #youdeads").text(this.youdeads); 

  // update the camera
  this.limitedFOVCamera.updateCamera();
  
  // move the shotgun as the camera moves
  if (!this.shotgun) { this.shotgun = this.mainScene.getObject("5138ed52f5ea660200000995"); }
  this.shotgun.threeData.position.x = this.limitedFOVCamera.threeCamera.position.x;
  this.shotgun.threeData.position.y = this.limitedFOVCamera.threeCamera.position.y - .15;

  // move the zombies forward
  var models = this.mainScene.getAllObjects( { "filter" :{ "model" : true }});
  for (var i=0; i<_.keys(models).length; i++) {

    var model = models[ _.keys( models )[i]];
    if (model.id != this.shotgun.id) {

      model.threeData.position.z += .003;
      
      // once zombie goes too far back, respawn it
      if (model.threeData.position.z > 0.7
          && model.threeData.position.z < 6) {
          
          this.youdeads--;
          if (this.youdead == 0) {
            this.gameOver();
          }

          respawn(model);
      }
    }
  }

}

function respawn(zombie) {

        newX = Math.floor(Math.random()*201)/100 - 1;         // random between 1 and -1
        newY = 0;
        newZ = -1 * Math.floor(Math.random()*301)/100;           // random between 0 and -3

        // move the zombie out of the kill zone, then after a 2-5 second timeout move them back
        zombie.set({ "payload.position" : { x: 0, y: 0, z: 6 }  });
        setTimeout( function() { 
            zombie.set({ "payload.position" : { x: newX, y: newY, z: newZ }  }); 
          }, 
          (Math.floor(Math.random()*4001) + 2000)
        );
        
}

GangnamApp.prototype.gameOver = function(event) {
  console.log("GAME OVER");
  this.bGameOver = true;
  $('#gameover').show;
}


GangnamApp.prototype.onMouseUp = function( event ) {
  
  if ( event.button == this.inputHandler.mouseButtons[ "left" ] && 
    !this.inputHandler.mouseDragStatePrevious[ event.button ] ) {
    
    var mouseX = event.sceneX / this.veroldApp.getRenderWidth();
    var mouseY = event.sceneY / this.veroldApp.getRenderHeight();
    var pickData = this.picker.pick( this.mainScene.threeData, this.camera, mouseX, mouseY );
    if ( pickData  && pickData.modelID ) {

      //console.log("DEBUG: Picked " + pickData.modelID);

      // don't pick the shotgun
      if (pickData.modelID == this.shotgun.modelID) return;

      // kill the zombie, respawn!
      var deadZombie = this.mainScene.getObject(pickData.modelID);
      this.headshots++;
      respawn(deadZombie);

    }
  }
}

GangnamApp.prototype.onKeyPress = function( event ) {
	
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
