var b2Vec2 = Box2D.Common.Math.b2Vec2
  , b2BodyDef = Box2D.Dynamics.b2BodyDef
  , b2Body = Box2D.Dynamics.b2Body
  , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  , b2Fixture = Box2D.Dynamics.b2Fixture
  , b2World = Box2D.Dynamics.b2World
  , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
  , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  , b2Listener = Box2D.Dynamics.b2ContactListener
  , b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

MyApp = function( veroldApp ) {
  this.veroldApp = veroldApp;
  this.mainScene;
  this.camera;

  this.velocityIterations = 10;
  this.positionIterations = 10;
  this.puck = undefined;
  this.board = undefined;
  this.puckBody = undefined;
  this.puckFixture = undefined;
  this.debugDraw = undefined;

  // move, active, done
  this.state = 'move';
  this.score = 0;
  this.highScore = 0;

  this.debugEnabled = false;

  this.woodSound = document.createElement('audio');
  var source = document.createElement('source');
  source.src = 'assets/4121__patchen__atik-2-187-stereoatik.wav';
  this.woodSound.appendChild(source);
}

MyApp.prototype.createPuck = function() {
  var fixDef, bodyDef, x = 4.99, y = 0, radius = 0.3;

  bodyDef = new b2BodyDef;

  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.x = x;
  bodyDef.position.y = y;

  fixDef = new b2FixtureDef;
  fixDef.shape = new b2CircleShape(radius);
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

  this.puckBody = this.world.CreateBody(bodyDef);
  this.puckFixture = this.puckBody.CreateFixture(fixDef);
  this.puckBody.SetActive(false);

  this.puckBody.SetUserData('puck');
}

MyApp.prototype.resetPuck = function() {
  this.state = 'move';
  this.puckBody.SetPositionAndAngle({ x: 4.99, y: 0 }, 0);
  this.puckBody.SetActive(false);
}

MyApp.prototype.createWall = function(x1, y1, w, h) {
  var bodyDef, fixDef, body;

  bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = x1;
  bodyDef.position.y = y1;

  fixDef = new b2FixtureDef;
  fixDef.shape = new b2PolygonShape.AsBox(w, h);
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.2;

  body = this.world.CreateBody(bodyDef).CreateFixture(fixDef);

  body.SetUserData('wall');
}

MyApp.prototype.createPeg = function(x, y) {
  var fixDef, bodyDef, radius = 0.09, body;

  bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = x;
  bodyDef.position.y = y;

  fixDef = new b2FixtureDef;
  fixDef.shape = new b2CircleShape(radius);
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.5;

  body = this.world.CreateBody(bodyDef).CreateFixture(fixDef);
  body.SetUserData('peg');
}

MyApp.prototype.createSlot = function(x, y) {
  var fixDef, bodyDef, body;

  bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = x;
  bodyDef.position.y = y;

  fixDef = new b2FixtureDef;
  fixDef.shape = new b2PolygonShape.AsBox(0.1, 0.5);
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.5;

  body = this.world.CreateBody(bodyDef).CreateFixture(fixDef);
  body.SetUserData('slot');
}

MyApp.prototype.createPegs = function() {
  var distance = 1.25, y, x;

  // 7 PEG ROWS
  for (y = 0; y < 7; y++) {
    for (x = 0; x < 7; x++) {
      this.createPeg((distance * 1.5) + (x * distance), (distance / 2) + (y * distance) + 0.3);
    }
  }

  // 8 PEG ROWS
  for (y = 0; y < 6; y++) {
    for (x = 0; x < 8; x++) {
      this.createPeg(distance + (x * distance), distance + (y * distance) + 0.3);
    }
  }

  // SLOTS
  y = 7;
  for (x = 0; x < 8; x++) {
    this.createSlot(distance + (x * distance), distance + (y * distance) - 0.45);
  }
}

MyApp.prototype.createSlotSensor = function(n) {
  var body, fixDef, bodyDef;

  bodyDef = new b2BodyDef;
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = ((10/8) * n) + 0.65;
  bodyDef.position.y = 9.5;

  fixDef = new b2FixtureDef;
  fixDef.shape = new b2PolygonShape.AsBox(0.35, 0.35);
  fixDef.density = 1.0;
  fixDef.friction = 0.5;
  fixDef.restitution = 0.5;
  fixDef.isSensor = true;

  body = this.world.CreateBody(bodyDef);

  body.CreateFixture(fixDef);
  
  body.SetUserData('sensor'+n);
}

MyApp.prototype.createSensors = function() {
  var i;
  for (i = 0; i < 9; i++) {
    this.createSlotSensor(i);
  }
}

MyApp.prototype.addScore = function(amt) {
  var that = this;

  this.score += amt;

  if (this.score > this.highScore)
    this.highScore = this.score;

  $('#high-score').text(this.highScore);
  $('#score').text(this.score);

  setTimeout(function() {
    that.resetPuck();
  }, 1000);
}

MyApp.prototype.gameOver = function() {
  var that = this;

  this.score = 0;
  $('#score').text(this.score);
  //alert('You suck, try again!');
  setTimeout(function() {
    that.resetPuck();
  }, 1000);
}

MyApp.prototype.sensorContact = function(index) {
  //alert('sensor contacted: ' + index);
  switch (index) {
    case 0: case 8: case 3: case 5:
      this.gameOver();
      break;

    case 1:
    case 7:
      this.addScore(100);
      break;

    case 2:
    case 6:
      this.addScore(500);
      break;

    case 4:
      this.addScore(1000);
      break;
  }
}

MyApp.prototype.initializeContactListener = function() {
  var that = this
    , listener = new b2Listener;

  listener.BeginContact = function(contact) {
    var a = contact.GetFixtureA().GetBody().GetUserData()
      , b = contact.GetFixtureB().GetBody().GetUserData()
      , index;

    if (a && a == 'puck') {
      if (b && b.indexOf('sensor') >= 0) {
        that.sensorContact(parseInt(b.substring(6, 7)));
      }
    } else if (b && b == 'puck') {
      if (a && a.indexOf('sensor') >= 0) {
        that.sensorContact(parseInt(a.substring(6, 7)));
      }
    }
  }

  listener.EndContact = function(contact) { }

  listener.PostSolve = function(contact, impulse) { 
    if (impulse.normalImpulses[0] > 0.8) {
      that.woodSound.play();
    }
  }

  listener.PreSolve = function(contact, oldManifold) { }

  this.world.SetContactListener(listener);
}

MyApp.prototype.initPhysics = function() {
  this.world = new b2World(new b2Vec2(0, 10), true);

  this.createPuck();
  this.createWall(0, 10, 11.25, 0.1);
  this.createWall(0, 0, 0.1, 10);
  this.createWall(11.25, 0, 0.1, 10);
  this.createPegs();
  this.createSensors();
  this.initializeContactListener();

  this.debugDraw = new b2DebugDraw();
  this.debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
  this.debugDraw.SetDrawScale(10.0);
  this.debugDraw.SetFillAlpha(0.3);
  this.debugDraw.SetLineThickness(1.0);
  this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
}

MyApp.prototype.startup = function( ) {
  var that = this;

	this.veroldApp.loadScene( null, {
    success_hierarchy: function( scene ) {
      that.initPhysics();

      // hide progress indicator
      that.veroldApp.hideLoadingProgress();

      that.inputHandler = that.veroldApp.getInputHandler();
      that.renderer = that.veroldApp.getRenderer();
      that.picker = that.veroldApp.getPicker();

      //Bind to input events to control the camera
      that.veroldApp.on("keyDown", that.onKeyPress, that);
      that.veroldApp.on("mouseUp", that.onMouseUp, that);

      that.veroldApp.on("update", that.update, that );

      //Store a pointer to the scene
      that.mainScene = scene;

      var models = that.mainScene.getAllObjects( { "filter" :{ "model" : true }});

      that.puck = models[_.keys(models)[0]];
      that.board = models[_.keys(models)[1]];

      //Create the camera
      that.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10000 );
      that.camera.up.set( 0, 1, 0 );
      that.camera.position.set( 0.5, 0.5, 1.4 );

      var lookAt = new THREE.Vector3();
      lookAt.add( that.board.threeData.center );
      lookAt.multiply( that.board.threeData.scale );
      lookAt.applyQuaternion( that.board.threeData.quaternion );
      lookAt.add( that.board.threeData.position );

      that.veroldApp.setActiveCamera( that.camera );
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
  var xOffset = 0, yOffset = 1, ratio = 10;

  if (this.world) {
    this.world.Step(delta, this.velocityIterations, this.positionIterations);

    this.puck.threeData.position.x = xOffset + (this.puckBody.GetTransform().position.x / ratio);
    this.puck.threeData.position.y = yOffset - (this.puckBody.GetTransform().position.y / ratio);

    if (this.debugEnabled) {
      this.world.DrawDebugData();
    }
  }
}

MyApp.prototype.onMouseUp = function( event ) {
  /*
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
  */
}

MyApp.prototype.onKeyPress = function( event ) {
  var keyCodes = this.inputHandler.keyCodes
    , position
    , range = { x1: 0.35, y1: -1, x2: 10.85, y2: 0.5 }
    , newX, newY, positionUpdated = false;


  if ( event.keyCode === keyCodes['Z']) {
    this.veroldApp.veroldEngine.Renderer.stats.domElement.hidden = !this.veroldApp.veroldEngine.Renderer.stats.domElement.hidden;
  } else if (event.keyCode === keyCodes['x']) {
    this.debugEnabled = this.debugEnabled ? false : true;

    this.world.SetDebugDraw(this.debugEnabled ? this.debugDraw : null);
  } else if (this.state == 'move') {
    position = this.puckBody.GetTransform().position;

    newX = position.x;
    newY = position.y;

    if (event.keyCode === keyCodes['leftArrow']) {
      newX -= 0.1;
      positionUpdated = true;
    } else if (event.keyCode === keyCodes['rightArrow']) {
      newX += 0.1;
      positionUpdated = true;
    } else if (event.keyCode === keyCodes['downArrow']) {
      newY += 0.1;
      positionUpdated = true;
    } else if (event.keyCode === keyCodes['upArrow']) {
      newY -= 0.1;
      positionUpdated = true;
    } else if (event.keyCode === keyCodes['space']) {
      this.puckBody.SetActive(true);
      this.state = 'active';
    } 

    if (positionUpdated) {
      if (newX >= range.x1 && newX <= range.x2 && newY >= range.y1 && newY <= range.y2) {
        this.puckBody.SetPositionAndAngle({ x: newX, y: newY }, 0);
      }
    }
  }

  /*
  if (event.keyCode === keyCodes['esc']) {
    this.resetPuck();
  }
  */
}
