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
    this.localStaticCollision = [];
    this.tempVector2D_1 = new b2Vec2();
    this.tempVector2D_2 = new b2Vec2();
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
      this.tempVector2D_1.x = this.tempVector.x / distance * rabbit.maxDriverDistance;
      this.tempVector2D_1.y = this.tempVector.z / distance * rabbit.maxDriverDistance;
    }
    else {
      this.tempVector2D_1.x = this.tempVector.x;
      this.tempVector2D_1.y = this.tempVector.z;
    }
    
    return this.tempVector2D_1;
  },

  //
  tendToCentreOfFlock : function( strength ) {
    this.tempVector2D_1.Set(0,0);
    var localDrivers = 0;
    for ( var x in this.localFlockIDs ) {
      //total up positions of drivers
      if ( this.localFlockIDs[x] !== this.driverID ) {
        var position = this.flockController.drivers[this.localFlockIDs[x]].vehicle.getPosition2D();
        this.tempVector2D_1.Add( position );
        localDrivers++;
      }
    }
    if ( localDrivers > 0 ) {
      this.tempVector2D_1.Multiply( 1.0 / localDrivers );
      this.tempVector2D_1.Subtract( this.vehicle.getPosition2D() );
      this.tempVector2D_1.Multiply( strength );
    }
    return this.tempVector2D_1;
  },

  tendToMaintainDistance : function( spread, strength ) {
    var myPosition = this.vehicle.getPosition2D();
    var distance = 0;
    this.tempVector2D_1.Set( myPosition.x, myPosition.y);
    this.tempVector2D_2.Set( 0, 0);
    //var localDrivers = 0;
    for ( var x in this.localFlockIDs ) {
      //Check each driver position against our own. If it's close enough, steer us away
      if ( this.localFlockIDs[x] !== this.driverID ) {
        var position = this.flockController.drivers[this.localFlockIDs[x]].vehicle.getPosition2D();
        this.tempVector2D_1.Subtract( position );
        distance = this.tempVector2D_1.Length();
        if ( distance < spread ) {
          this.tempVector2D_1.Multiply( (spread / distance) * (spread / distance) * strength );
          this.tempVector2D_2.Add( this.tempVector2D_1 );
        }
        this.tempVector2D_1.Set( myPosition.x, myPosition.y);
        //localDrivers++;
      }
    }

    //Also maintain distance from track objects
    for ( var x in this.localStaticCollision ) {
      
      var position = this.localStaticCollision[x].GetBody().GetPosition();
      this.tempVector2D_1.Subtract( position );
      distance = this.tempVector2D_1.Length();
      if ( distance < spread ) {
        this.tempVector2D_1.Multiply( (spread / distance) * (spread / distance) * strength );
        this.tempVector2D_2.Add( this.tempVector2D_1 );
      }
      this.tempVector2D_1.Set( myPosition.x, myPosition.y);
    
      
    }
  
    return this.tempVector2D_2;
  },

  tendToMatchVelocity : function() {
    this.tempVector2D_1.Set(0,0);
    var localDrivers = 0;
    for ( var x in this.localFlockIDs ) {
      //Check each driver velocity against our own.
      if ( this.localFlockIDs[x] !== this.driverID ) {
        var velocity = this.flockController.drivers[ this.localFlockIDs[x] ].vehicle.getVelocity2D();
        this.tempVector2D_1.Add( velocity );
        localDrivers++;
      }
    }
    if ( localDrivers > 0 ) {
      this.tempVector2D_1.Multiply( 1.0 / localDrivers );
      this.tempVector2D_1.Subtract( this.vehicle.getVelocity2D() ); 
    }

    return this.tempVector2D_1;
  },

  driveTowards : function( driveVector ) {
    //Using the given vector, try to match our velocity to it.
    var currentDirection = this.vehicle.getDirectionVector2D();
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

      var speed = this.vehicle.getVelocity2D().Length();
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
    if ( this.isHuman ) {
      if ( this.inputHandler.keyDown( 'upArrow') ) {
        this.vehicle.accel = true;
        //this.vehicle.underHumanControlTimer = 0;
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
        this.vehicle.steering = -0.5;
      }
      else if ( this.inputHandler.keyDown( 'rightArrow') ) {
        this.vehicle.steering = 0.5;
      }
      else {
        this.vehicle.steering = 0;
      }
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

