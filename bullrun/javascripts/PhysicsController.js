PhysicsController = function( veroldApp, physicsDebugRenderScale ) {

  this.veroldApp = veroldApp;
  this.world = undefined;
  this.physicsDebugRenderScale = physicsDebugRenderScale;
  this.trackBodies = [];
  this.trackFixtures = [];
}

PhysicsController.prototype = {

  constructor: PhysicsController,

  initialize : function( ) {

    var that = this;
    //Bind to fixed update loop
    that.veroldApp.on("fixedUpdate", that.fixedUpdate, that );

    b2Vec2 = Box2D.Common.Math.b2Vec2
        ,       b2BodyDef = Box2D.Dynamics.b2BodyDef
        ,       b2Body = Box2D.Dynamics.b2Body
        ,       b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        ,       b2Fixture = Box2D.Dynamics.b2Fixture
        ,       b2World = Box2D.Dynamics.b2World
        ,       b2MassData = Box2D.Collision.Shapes.b2MassData
        ,       b2AABB = Box2D.Collision.b2AABB
        ,       b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        ,       b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
        ,       b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ;
         

    //Create the physics world and initialize it.
    this.world = new b2World( 
      new b2Vec2(0, 0) //gravity
      , true //allow sleep
    );
   
    //setup debug draw
    this.debugDraw = new b2DebugDraw();
    this.debugCanvas = document.createElement('canvas');
    this.debugCanvas.id = "box2d_debug_canvas";
    this.debugCanvas.width = this.veroldApp.getRenderWidth();
    this.debugCanvas.height = this.veroldApp.getRenderHeight();
    document.body.appendChild( this.debugCanvas );
    //var context = this.veroldApp.getRenderer().domElement.getContext("2d");
    this.debugDraw.SetSprite( this.debugCanvas.getContext("2d") );
    this.debugDraw.SetDrawScale( this.physicsDebugRenderScale );
    this.debugDraw.SetFillAlpha( 0.3 );
    this.debugDraw.SetLineThickness( 1.0 );
    this.debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_aabbBit );
    this.world.SetDebugDraw( this.debugDraw );
    this.toggleDebugDraw( false );
         
  },

  uninitialize : function() {
	
    this.veroldApp.off("fixedUpdate", this.fixedUpdate, this );

    for ( var x in this.vehicleFixtures ) {
      //this.vehicleFixtures.destroyBody()
    }
  },

  createVehicleBodies: function( numVehicles ) {
    //Spawn pool of physics bodies to be linked up with vehicles later
    //When supporting differently-sized vehicles, I think we'll need multiple
    //pools if we can't change fixture sizes on the fly.
    //create some objects
    this.vehicleBodies = [];
    this.vehicleFixtures = [];

    var fixDef = new b2FixtureDef;
       fixDef.density = 1.0;
       fixDef.friction = 0.01;
       fixDef.restitution = 0.4;
       
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;

    for(var i = 0; i < numVehicles; ++i) {
      
       fixDef.shape = new b2PolygonShape;
       fixDef.shape.SetAsBox(
             0.25 //half width
          ,  0.10 //half height
       );
      
      // bodyDef.position.x = Math.random() * 1;
      // bodyDef.position.y = Math.random() * 1;
      this.vehicleBodies.push( this.world.CreateBody(bodyDef) );
      this.vehicleFixtures.push( this.vehicleBodies[i].CreateFixture(fixDef) );
    }
  },

  createTrackSideBody: function( length, width, angle, position, trackPos ) {
    
    var fixDef = new b2FixtureDef;
       fixDef.density = 1.0;
       fixDef.friction = 0.01;
       fixDef.restitution = 0.2;
       
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;

    //for(var i = 0; i < number; ++i) {
      
       fixDef.shape = new b2PolygonShape;
       fixDef.shape.SetAsBox(
             length / 2 //half width
          ,  width / 2 //half height
       );
      
      var body = this.world.CreateBody(bodyDef)
      this.trackBodies.push( body );
      var fixture = body.CreateFixture(fixDef);
      this.trackFixtures.push( fixture );

      body.SetPosition( position );
      body.SetAngle( angle );

      //This will be used later to determine a driver's track progress
      fixture.trackPos = trackPos;
    //}
  },

  fixedUpdate : function( delta ) {
    this.world.Step(
         delta   //frame-rate
      ,  10       //velocity iterations
      ,  10       //position iterations
    );
    this.world.DrawDebugData();
    this.world.ClearForces();
  },

  toggleDebugDraw : function( on ) {
    if ( on ) {
      this.world.SetDebugDraw( this.debugDraw );
      $(this.debugCanvas).css("display", "");
    }
    else {
      this.world.SetDebugDraw( null );
      //this.debugCanvas.style = "display:none";
      $(this.debugCanvas).css("display", "none");
    }
  },

  // setVehicleSize : function( vehicleNum, width, height ) {
  //   this.vehicleFixtures[ vehicleNum ].
  // },

  setVehiclePosition : function( vehicleNum, x, y ) {
    this.vehicleFixtures[ vehicleNum ].setTransform( new b2Vec2( x, y ) );
  },

  setVehicleAngle : function( vehicleNum, radians ) {

  },

  getVehicleBody : function( vehicleNum ) {
    return this.vehicleBodies[ vehicleNum ];
  },

  getVehicleFixture : function( vehicleNum ) {
    return this.vehicleFixtures[ vehicleNum ];
  }

}

