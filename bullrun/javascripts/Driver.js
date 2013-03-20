Driver = function( veroldApp, flockingController ) {

  this.veroldApp = veroldApp;
  this.flockController = flockingController;
}

Driver.prototype = {

  constructor: Driver,

  initialize : function( ID, track ) {

    this.driverID = ID;
    this.track = track;
    //Bind to input events
    //this.veroldApp.on("keyDown", this.onKeyPress, this);
    this.inputHandler = this.veroldApp.getInputHandler();

    this.localFlockBB = new b2AABB();
    this.localFlockIDs = [];
    this.tempVector2D = new b2Vec2();
    this.tempVector = new THREE.Vector3();
  },

  uninitialize : function() {
	
    this.veroldApp.off("update", this.update, this );
  },

  //Boid rule to get flock to follow the road at the set pace
  tendToPaceRabbit : function() {
    //Get the vector from this driver to the rabbit.
    var rabbit = this.track.getPaceRabbit();
    this.tempVector.copy( rabbit.getPosition() );
    this.tempVector.sub( this.vehicle.getPosition() );
    //Clamp the vector to a maximum
    var distance = this.tempVector.length();
    if ( distance > rabbit.maxDriverDistance ) {
      this.tempVector2D.x = this.tempVector.x / distance * rabbit.maxDriverDistance;
      this.tempVector2D.y = this.tempVector.z / distance * rabbit.maxDriverDistance;
    }
    else {
      this.tempVector2D.x = this.tempVector.x;
      this.tempVector2D.y = this.tempVector.z;
    }
    
    return this.tempVector2D;
  },

  //
  tendToCentreOfFlock : function() {
    this.tempVector2D.Set(0,0);
    var localDrivers = 0;
    for ( var x in this.localFlockIDs ) {
      //total up positions of drivers
      if ( this.localFlockIDs[x] !== this.driverID ) {
        var position = this.flockController.drivers[this.localFlockIDs[x]].vehicle.getPosition2D();
        this.tempVector2D.Add( position );
        localDrivers++;
      }
    }
    if ( localDrivers > 0 ) {
      this.tempVector2D.Multiply( 1.0 / localDrivers );
      this.tempVector2D.Subtract( this.vehicle.getPosition2D() );
    }
    return this.tempVector2D;
  },

  tendToMaintainDistance : function() {
    return this.tempVector2D;
  },

  tendToMatchVelocity : function() {
    return this.tempVector2D;
  },

  driveTowards : function( driveVector ) {
    //Using the given vector, try to match our velocity to it.
    var currentDirection = this.vehicle.getDirectionVector();
    if ( currentDirection ) {
      var requiredSpeed = driveVector.Length();
      driveVector.Normalize();
      var steer = driveVector.x * currentDirection.x + driveVector.y * currentDirection.y;
      if  ( driveVector.x * currentDirection.y - currentDirection.x * driveVector.y > 0) {
        steer = steer * 0.5 - 0.5;
      }
      else {
        steer = 1.0 - (steer * 0.5 + 0.5);
      }
      this.vehicle.ai_steering = steer;

      var speed = this.vehicle.getVelocity().Length();
      if ( requiredSpeed > speed ) {
        this.vehicle.ai_accel = true;
      }
      else {
        this.vehicle.ai_accel = false;
      }
    }
  },

  update : function( delta ) {
    //var keyCodes = this.inputHandler.keyCodes;
    if ( this.inputHandler.keyDown( 'upArrow') ) {
      this.vehicle.accel = true;
    }
    else this.vehicle.accel = false;

    if ( this.inputHandler.keyDown( 'downArrow') ) {
      this.vehicle.brake = true;
    }
    else this.vehicle.brake = false;

    if ( this.inputHandler.keyDown( 'N') ) {
      this.vehicle.moveLeft = true;
    }
    else this.vehicle.moveLeft = false;

    if ( this.inputHandler.keyDown( 'M') ) {
      this.vehicle.moveRight = true;
    }
    else this.vehicle.moveRight = false;

    if ( this.inputHandler.keyDown( 'leftArrow') ) {
      this.vehicle.steering = -1;
    }
    else if ( this.inputHandler.keyDown( 'rightArrow') ) {
      this.vehicle.steering = 1;
    }
    else {
      this.vehicle.steering = 0;
    }
    
  },

  setVehicle : function( vehicle ) {
    this.vehicle = vehicle;
    //Bind to main update loop
    this.veroldApp.on("update", this.update, this );
  },

  onKeyPress : function( event ) {
      
  }

}

