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

  tendToTrackDirection : function( speed ) {
    this.tempVector2D_1.Set(0,0);
    //if we have a track object nearby, it will have the track position (0-1) stored in it
    //and we can use that to get the direction of travel.
    var trackPos = undefined;
    var distance, minDistance = Number.MAX_VALUE;
    for ( var x in this.localStaticCollision ) {
      
      var myPosition = this.vehicle.getPosition2D();
      this.tempVector2D_1.Set( myPosition.x, myPosition.y );
      var position = this.localStaticCollision[x].GetBody().GetPosition();
      this.tempVector2D_1.Subtract( position );
      distance = this.tempVector2D_1.Length();
      if ( distance < minDistance ) {
        trackPos = this.localStaticCollision[x].trackPos;
        minDistance = distance;
      }
    }

    if ( trackPos !== undefined ) {
      var middlePos = this.track.trackCurve.getPointAt( trackPos );

      var segments = 1.0 * this.track.getNumSegments();
      trackPos *= segments;
      var prevIndex = Math.floor( trackPos );
      var nextIndex = (prevIndex + 1) % segments;
      var interpValue = trackPos % 1;
      if ( interpValue > 0.5 ) prevIndex = (prevIndex + 1) % segments;
      //if ( interpValue !== 0 ) console.log("Interp value is " + interpValue)
      var binormal1 = this.track.trackGeo.tangents[ prevIndex ];
      //var binormal2 = this.track.trackGeo.tangents[ nextIndex ];
      this.tempVector2D_1.x = binormal1.x;// * (1 - interpValue ) + binormal2.x * interpValue;
      this.tempVector2D_1.y = binormal1.z;// * (1 - interpValue ) + binormal2.z * interpValue;
      

      //Lean towards the centre of the track
      
      var myPosition = this.vehicle.getPosition2D();
      this.tempVector2D_2.x = middlePos.x - myPosition.x;
      this.tempVector2D_2.y = middlePos.z - myPosition.y;

      var dot = this.tempVector2D_1.x * this.tempVector2D_2.x + this.tempVector2D_1.y * this.tempVector2D_2.y;
      if ( dot > 0 ) {
        this.tempVector2D_1.Multiply( speed );
        //this.tempVector2D_2.Multiply( (1 - dot) )
        this.tempVector2D_1.Add( this.tempVector2D_2 );
      }
      else {
        this.tempVector2D_1.Multiply( speed );
      }
        
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
      if ( distance < spread * 2.0 ) {
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

    this.driveArrow.position.copy( this.vehicle.getPosition() );
    this.tempVector.set( driveVector.x, 0, driveVector.y )
    this.driveArrow.setDirection( this.tempVector )
    this.driveArrow.setLength( this.tempVector.length() )

    //Using the given vector, try to match our velocity to it.
    var currentDirection = this.vehicle.getDirectionVector2D();
    if ( currentDirection ) {
      var requiredSpeed = driveVector.Length();
      driveVector.Normalize();
      var steer = driveVector.x * currentDirection.x + driveVector.y * currentDirection.y;
      steer = steer * steer * steer;
      if  ( driveVector.x * currentDirection.y - currentDirection.x * driveVector.y > 0) {
        steer = -Math.min( 1.0 - steer, 1.0 );
      }
      else {
        steer = Math.min( 1.0 - steer, 1.0 );
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
    this.driveArrow = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), new THREE.Vector3(), 1, 0x0000ff );
    this.track.scene.threeData.add( this.driveArrow );
    //Bind to main update loop
    this.veroldApp.on("update", this.update, this );
  },

  onKeyPress : function( event ) {
      
  }

}

