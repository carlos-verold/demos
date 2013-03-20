MyApp = function( veroldApp ) {
  this.veroldApp = veroldApp;  
  this.mainScene;
  this.camera;
  this.ballRadius = 0.1;
  this.ballMass = 0.1;
  this.balls = [];

  window.app = this;
}

MyApp.prototype.initCannon = function() {
  this.world = new CANNON.World();
  this.world.gravity.set(0, -9.82, 0);
  this.world.broadphase = new CANNON.NaiveBroadphase();
  this.world.solver.iterations = 10;
  this.world.defaultContactMaterial.contactEquationStiffness = 1e6;
  this.world.defaultContactMaterial.contactEquationRegularizationTime = 4;

  this.defaultMaterial = new CANNON.Material('default');
  this.defaultContactMaterial = new CANNON.ContactMaterial(this.defaultMaterial, this.defaultMaterial, 0.5, 0.7);
  this.world.addContactMaterial(this.defaultContactMaterial);

  var groundShape = new CANNON.Plane();
  var groundBody = new CANNON.RigidBody(0,groundShape, this.defaultMaterial);
  groundBody.position.set(0,0,0);
  var q = new CANNON.Quaternion();
  q.setFromAxisAngle(new CANNON.Vec3(-1,0,0), 0.5 * Math.PI);
  groundBody.quaternion.set(q.x,q.y,q.z,q.w);
  this.world.add(groundBody);

  this.groundBody = groundBody;
}

MyApp.prototype.createBall = function(x,y,z) {
  var that = this
    , scene = this.mainScene.threeData
    , shape = new CANNON.Sphere(that.ballRadius)
    , body = new CANNON.RigidBody(this.ballMass,shape, this.defaultMaterial);

  body.position.set(x,y,z);
  body.linearDamping = 0.10;

  this.world.add(body);

  this.mainScene.createInstance(this.models['sphere_model'], { success: function(instance) {
    var mesh = instance.getChildObject(Object.keys(instance.entityModel.get('children'))[0]);

    mesh.entityModel.set('payload.material', '512e5dabae5ad502000007c3');

    window.mainScene = that.mainScene;
    window.instance = instance;
    instance.entityModel.set({ 'payload.scale': { x: 0.1, y: 0.1, z: 0.1 }});
    that.mainScene.addChildObject(instance);
    that.balls.push({ body: body, object: instance });
  }});
}

MyApp.prototype.resetBallPositions = function () {
  _.each(this.balls, function(ball) {
    var random = function() {
      return (Math.random() * 1) - 0.5;
    }

    ball.body.position.set(random(), 1 + Math.abs(10 * random()), random());
  });
}


MyApp.prototype.startup = function( ) {
  var that = this;

  this.veroldApp.veroldEngine.Renderer.stats.domElement.hidden = false

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

      that.veroldApp.on("update", that.update, that );
      that.veroldApp.on("fixedUpdate", that.updatePhysics, that);

      document.addEventListener('touchend', function() {
        that.resetBallPositions();
      }, false);

      that.mainScene = scene;

      that.models = veroldApp.veroldEngine.assetRegistry.getRegistryByType('model').getAllAssets();

      //Create the camera
      that.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
      that.camera.up.set( 0, 1, 0 );
      that.camera.position.set( 0, 0.75, -1.5 );

      var lookAt = new THREE.Vector3(0,0.2,0);
      that.camera.lookAt( lookAt );

      that.veroldApp.setActiveCamera( that.camera );

      that.initCannon();

      for (var i = 0; i < 5; i++) {
        that.createBall();
      }

      that.resetBallPositions();
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

  this.veroldApp.off("update", this.update, this);
  this.veroldApp.off("fixedUpdate", this.updatePhysics, this);
}

MyApp.prototype.updatePhysics = function(delta) {
  this.world.step(delta);
}

MyApp.prototype.update = function( delta ) {
  _.each(this.balls, function(ball) {
    ball.body.position.copy(ball.object.threeData.position);
    ball.body.quaternion.copy(ball.object.threeData.quaternion);
  });
}

MyApp.prototype.onMouseUp = function( event ) {
  this.resetBallPositions();
}

MyApp.prototype.onKeyPress = function( event ) {
	
	var keyCodes = this.inputHandler.keyCodes;
  if ( event.keyCode === keyCodes['space'] ) {
    this.resetBallPositions();
  } else if ( event.keyCode === keyCodes['B'] ) {
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
