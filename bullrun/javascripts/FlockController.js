FlockController = function( veroldApp ) {

  this.veroldApp = veroldApp;
  this.localFlockRange = 1;
  this.centreOfFlockMultiplier = 0.5;
}

FlockController.prototype = {

  constructor: FlockController,

  initialize : function( track, numDrivers ) {

    this.track = track;

    this.physicsSim = new PhysicsController( this.veroldApp );
    this.physicsSim.initialize( numDrivers );
    this.initDrivers( numDrivers );
    this.initVehicles( numDrivers );

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
        var centreOfFlockVector = this.drivers[x].tendToCentreOfFlock();
        centreOfFlockVector.Multiply( this.centreOfFlockMultiplier );
        this.tempVector2D.Add( centreOfFlockVector );

        this.tempVector2D.Add( this.drivers[x].tendToMaintainDistance() );

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
      var newCar = new Vehicle( veroldApp );
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
    var that = this;
    var vehicle = this.drivers[ driverID ].vehicle;
    if ( vehicle ) {
      var position = vehicle.getPosition2D();
      this.drivers[ driverID ].localFlockBB.lowerBound.Set( position.x - this.localFlockRange, position.y - this.localFlockRange);
      this.drivers[ driverID ].localFlockBB.upperBound.Set( position.x + this.localFlockRange, position.y + this.localFlockRange);
      this.physicsSim.world.QueryAABB( function( fixture ) {
        //console.log("Fixture ", fixture, " is near driver # " + driverID );
        that.drivers[ driverID ].localFlockIDs.push( fixture.driverID );
      }, this.drivers[ driverID ].localFlockBB );
    }
  }

}

