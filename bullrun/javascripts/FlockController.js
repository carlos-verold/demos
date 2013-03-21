FlockController = function( veroldApp ) {

  this.veroldApp = veroldApp;
  this.localFlockRange = 2;
  this.centreOfFlockMultiplier = 0.5;

  //Controls the distance that drivers need to get to each other before they try to move away.
  this.flockSpread = 2;
  this.spreadStrength = 3;
  window.flock = this;
}

FlockController.prototype = {

  constructor: FlockController,

  initialize : function( physicsSim, track, numDrivers, numHumanDrivers ) {

    this.track = track;

    this.physicsSim = physicsSim;
    this.physicsSim.createVehicleBodies( numDrivers );
    this.initDrivers( numDrivers );
    this.initVehicles( numDrivers );

    if ( numHumanDrivers ) {
      this.drivers[0].isHuman = true;
    }

    //Vector to record
    this.tempVector2D = new b2Vec2();
    
    //Bind to main update loop
    this.veroldApp.on("update", this.update, this );    
  },

  uninitialize : function() {
	
    this.veroldApp.off("update", this.update, this );
  },

  update : function( delta ) {
    //Run flocking rules for each boid
    //First, we'll update the local information for each driver
    for ( var x in this.drivers ) {
      this.updateLocalFlockInfo( x );

      if ( this.drivers[x].vehicle ) {
      
        var paceRabbitVec = this.drivers[x].tendToPaceRabbit();
        this.tempVector2D.Set( paceRabbitVec.x, paceRabbitVec.y );

        //For each boid, calculate the "centre of mass" of nearby boids and get a vector that represents the desired direction of travel
        this.tempVector2D.Add( this.drivers[x].tendToCentreOfFlock( this.centreOfFlockMultiplier ) );

        this.tempVector2D.Add( this.drivers[x].tendToMaintainDistance( this.flockSpread, this.spreadStrength ) );

        this.tempVector2D.Add( this.drivers[x].tendToMatchVelocity() );
      
        //Using the combined vector, tell the driver where to go (via the vector)
        this.drivers[x].driveTowards( this.tempVector2D );
      }
    }
  },

  fixedUpdate : function( delta ) {

  },

  initDrivers : function( numDrivers ) {
    this.numDrivers = numDrivers;
    this.drivers = [];
    for ( var x = 0; x < numDrivers; x++ ) {
      this.drivers.push( new Driver( this.veroldApp, this ) );
      this.drivers[x].initialize( x, this.track );
    }
  },

  initVehicles : function( numDrivers ) {

    function _initVehicle( num ) {
      //Create the car and place it on the track
      var physicsFixture = that.physicsSim.getVehicleFixture( num );
      physicsFixture.driverID = num;
      var physicsBody = that.physicsSim.getVehicleBody( num );
      var newCar = new Vehicle( veroldApp, that.drivers[num] );
      newCar.initialize( that.track, {
        success: function( newVehicle ) {
          that.drivers[ num ].setVehicle( newVehicle );
          that.vehicles.push( newVehicle );
          that.track.spawnVehicle( newVehicle );
        }
      }, physicsBody, physicsFixture );
    };

    var that = this;
    this.vehicles = [];
    
    for ( var x = 0; x < numDrivers; x++ ) {
      
      _initVehicle( x );
      
    }
  },

  updateLocalFlockInfo: function( driverID ) {

    this.drivers[ driverID ].localFlockIDs = [];
    this.drivers[ driverID ].localStaticCollision = [];
    var that = this;
    var vehicle = this.drivers[ driverID ].vehicle;
    if ( vehicle ) {
      var position = vehicle.getPosition2D();
      this.drivers[ driverID ].localFlockBB.lowerBound.Set( position.x - this.localFlockRange, position.y - this.localFlockRange);
      this.drivers[ driverID ].localFlockBB.upperBound.Set( position.x + this.localFlockRange, position.y + this.localFlockRange);
      this.physicsSim.world.QueryAABB( function( fixture ) {
        //console.log("Fixture ", fixture, " is near driver # " + driverID );
        if ( fixture.driverID !== undefined ) {
          that.drivers[ driverID ].localFlockIDs.push( fixture.driverID );
        }
        else {
          that.drivers[ driverID ].localStaticCollision.push( fixture );
        }
      }, this.drivers[ driverID ].localFlockBB );
    }
  },

  getHumanDriver: function( playerNum ) {
    return this.drivers[0];
  }

}

