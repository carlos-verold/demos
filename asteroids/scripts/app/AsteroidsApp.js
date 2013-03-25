AsteroidsApp = function(veroldApp,ui) {

  this.veroldApp = veroldApp;  
  this.mainScene;
  this.camera;

  this.ship;

  this.asteroid_template;

  var width = $(window).width(), height = $(window).height();
  this.orthTop = 14;
  this.orthBottom = this.orthTop;
  this.ui = ui;
  
}

AsteroidsApp.prototype.startup = function( gameCallback ) {

  var that = this;

	this.veroldApp.loadScene( null, {
    
    success_hierarchy: function( scene ) {

      // hide progress indicator
      that.veroldApp.hideLoadingProgress();

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
      scene.set({"payload.environment.skyboxOn" : false });
      var renderer = that.veroldApp.getRenderer();
      renderer.setClearColorHex(0x000000, 0);
      
      var models = that.mainScene.getAllObjects( { "filter" :{ "model" : true }});

      // saving reference to asteroid model (template)
      that.asteroid_template = that.mainScene.getObject('514d18e34ad09902000005a9');
      // remove initial model
      that.mainScene.removeChildObject(that.asteroid_template);

      var model = models[ _.keys( models )[0] ].threeData;
      that.ship = model;
      
      //Create the camera
      var width = $(window).width();
      var height = $(window).height();
      var topAndBottom = 14;
      var leftAndRight = topAndBottom * (width/height);
      that.camera = new THREE.OrthographicCamera(-leftAndRight,leftAndRight,topAndBottom,-topAndBottom, 0.1, 10000 );
      that.camera.up.set( 0, 1, 0 );
      that.camera.position.set( 0, 0, 20);

      var lookAt = new THREE.Vector3();
      lookAt.add( model.center );
      lookAt.multiply( model.scale );
      lookAt.applyQuaternion( model.quaternion );
      lookAt.add( model.position );

      that.camera.lookAt( lookAt );
      
      //Tell the engine to use this camera when rendering the scene.
      that.veroldApp.setActiveCamera( that.camera );

      if(!!gameCallback) { gameCallback(); }

    },

    progress: function(sceneObj) {
      var percent = Math.floor((sceneObj.loadingProgress.loaded_hierarchy / sceneObj.loadingProgress.total_hierarchy)*100);
      that.ui.setLoadingProgress(percent); 
    }

  });
	
}

AsteroidsApp.prototype.getShipModel = function() {
  return this.ship;
};

AsteroidsApp.prototype.createAsteroidModel = function(callback) {

  var angles = [];
  for(i=0;i<3;i++) {
    angles[i] = Math.random() * (2*Math.PI);
  }

  var that = this;
  this.asteroid_template.clone({
    success_hierarchy: function(clonedAsteroid) {
      that.mainScene.addChildObject(clonedAsteroid);
      clonedAsteroid.traverse(function(obj) {
        if(obj.entityModel.get('name').match(/^default.*/) && obj.type === "mesh") {
          var vec3 = new THREE.Vector3(angles[0],angles[1],angles[2])
          obj.threeData.quaternion.setFromEuler(vec3);
        }
      });
      if(!!callback) { callback(clonedAsteroid.threeData); }
    }
  })

};

AsteroidsApp.prototype.shutdown = function() {
	
  this.veroldApp.off("keyDown", this.onKeyPress, this);
  this.veroldApp.off("mouseUp", this.onMouseUp, this);

  this.veroldApp.off("update", this.update, this );
}

  

AsteroidsApp.prototype.update = function( delta ) {

}

AsteroidsApp.prototype.fixedUpdate = function( delta ) {

}

AsteroidsApp.prototype.onMouseUp = function( event ) {
  
  if ( event.button == this.inputHandler.mouseButtons[ "left" ] && 
    !this.inputHandler.mouseDragStatePrevious[ event.button ] ) {
    
    var mouseX = event.sceneX / this.veroldApp.getRenderWidth();
    var mouseY = event.sceneY / this.veroldApp.getRenderHeight();
    var pickData = this.picker.pick( this.mainScene.threeData, this.camera, mouseX, mouseY );
    if ( pickData ) {
      //Bind 'pick' event to an asset or just let user do this how they want?
      if ( pickData.meshID == "51125eb50a4925020000000f") {
        //Do stuff
      }
    }
  }
}

AsteroidsApp.prototype.onKeyPress = function( event ) {
	
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
