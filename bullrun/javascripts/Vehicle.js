const vehicleIDList = { "Default" : "513f95b7d40099e112000cd9" };

const paintIDList = { "Paint0" : "513a4a707d52b50200000790",
                      "Paint1" : "513a4a877d52b50200000791",
                      "Paint2" : "513a4a967d52b50200000792",
                    };



Vehicle = function( veroldApp ) {

  this.veroldApp = veroldApp;
  
  this.ai_accel = false;
  this.ai_steering = 0;
  this.accel = false;
  this.steering = 0;
  
}

Vehicle.prototype = {

  constructor: Vehicle,

  initialize : function( track, options, physicsBody, physicsFixture ) {

    this.track = track;
    var that = this;
    
    var scene = this.track.getScene();
    var carModel = this.veroldApp.getAssetRegistry().getAsset( vehicleIDList["Default"] );

    this.physicsBody = physicsBody;
    this.physicsFixture = physicsFixture;

    this.forceVector = new b2Vec2(0,0);
    this.steerForceVector = new b2Vec2(0,0);
    this.forcePoint = new b2Vec2(0,0);
    this.accelForce = 0.25;
    this.brakeForce = -0.5;
    this.steerForce = 0.2;
    this.tireResistTorque = -0.05;
    //this.physicsBody.SetAngularDamping( 0.9 );
    //this.physicsBody.SetLinearDamping( 0.1 );
    this.tireResist = new b2Vec2(0.1,0.8);
    this.tempVector1 = new b2Vec2(0,0);
    this.dampingForce = new b2Vec2(0,0);

    carModel.load( {
      success_hierarchy: function() {
        //Create the car and place it on the track
        scene.createInstance( carModel, {
          //id: "Vehicle",
          //name: "Vehicle",
          //payload: { scale: {x: 0.01, y: 0.01, z: 0.01}},
          success: function( carInstance ) {
            //Setup paint or other things unique to this vehicle?
            that.model = carInstance;
            //Bind to main update loop
            that.veroldApp.on("update", that.update, that );
            that.veroldApp.on("fixedUpdate", that.fixedUpdate, that );
            if ( options.success ) options.success( that );

            that.model.traverse( function(obj) {
              if ( obj.type == "mesh" ) {
                obj.set({"payload.material" : paintIDList["Paint0"] });
              }
            });
          }
        });
      }
    });
    
  },

  uninitialize : function() {
	
    this.veroldApp.off("update", this.update, this );
    this.veroldApp.off("fixedUpdate", this.fixedUpdate, this );
  },

  update : function( delta ) {
    //From physics body, set the transform of the graphical vehicle.
    //this.track.
    var pos = this.physicsBody.GetPosition();
    var angle = this.physicsBody.GetAngle();
    // this.directionVector.x = Math.sin( angle );
    // this.directionVector.y = Math.cos( angle );
    this._setVehicleAngle( angle );
    this.model.set( {"payload.position" : { x: pos.x, y: 0, z: pos.y }} );
  },

  fixedUpdate : function( delta ) {
    
    this.forceVector.Set( 0, 0);
    this.steerForceVector.Set(0,0);
    
    this.tempVector1.Set( 1, 0)
    this.directionVector = this.physicsBody.GetWorldVector( this.tempVector1 );
    
    //Damping
    //Calculate wind/tire resistence
    var dampingForce = this.physicsBody.GetWorldVector( this.tireResist );
    dampingForce.x = Math.abs( dampingForce.x ) * Math.abs( this.physicsBody.GetLinearVelocity().x);
    dampingForce.y = Math.abs( dampingForce.y ) * Math.abs( this.physicsBody.GetLinearVelocity().y);

    dampingForce.x *= this.physicsBody.GetLinearVelocity().x < 0 ? 1 : -1;
    dampingForce.y *= this.physicsBody.GetLinearVelocity().y < 0 ? 1 : -1;

    var localVel = this.physicsBody.GetLocalVector( this.physicsBody.GetLinearVelocity() );
    this.tempVector1.x = -(this.tireResist.x * localVel.x);
    this.tempVector1.y = -(this.tireResist.y * localVel.y);

    // dampingForce.x = Math.abs( this.tireResist.x ) * -this.physicsBody.GetLinearVelocity().x;
    // dampingForce.y = Math.abs( this.tireResist.y ) * -this.physicsBody.GetLinearVelocity().y;
    this.forceVector.Add( this.physicsBody.GetWorldVector( this.tempVector1 ) );
    //Apply damping force
    //this.forceVector.Add( dampingForce );


    //Apply damping torques
    var torque = this.physicsBody.GetAngularVelocity() * this.tireResistTorque;
    

    //Calculate and apply steering forces
    if ( this.moveLeft ) {
      this.tempVector1.Set( 0, -this.steerForce );
      var leftVector = this.physicsBody.GetWorldVector( this.tempVector1 );
      this.forceVector.Add( leftVector );
    }
    else if ( this.moveRight ) {
      this.tempVector1.Set( 0, this.steerForce );
      var rightVector = this.physicsBody.GetWorldVector( this.tempVector1 );
      this.forceVector.Add( rightVector );
    }

    if ( this.steering !== 0 ) {
      
      // var localVel = this.physicsBody.GetLocalVector( this.physicsBody.GetLinearVelocity() );
      // this.tempVector1.Set( 0, this.steering * this.steerForce );//* localVel.x );
      // var leftVector = this.physicsBody.GetWorldVector( this.tempVector1 );
      // this.forcePoint.Set( -1, 0 );
      // this.steerForceVector.Add( leftVector, this.physicsBody.GetWorldPoint( this.forcePoint ) );

      // this.physicsBody.ApplyForce( this.steerForceVector, this.forcePoint );

      torque += this.steering * this.steerForce;
    }
    else if ( this.ai_steering !== 0 ) {
      torque += this.ai_steering * this.steerForce;
    }
    
    this.physicsBody.ApplyTorque( torque );

    //Calculate the acceleration due to vehicle engine
    if ( this.accel || this.ai_accel ) {
      this.tempVector1.Set( this.directionVector.x, this.directionVector.y );
      this.tempVector1.Multiply( this.accelForce );
      this.forceVector.Add( this.tempVector1 );
    }
    else if ( this.brake ) {
      this.tempVector1.Set( this.directionVector.x, this.directionVector.y );
      this.tempVector1.Multiply( this.brakeForce );
      this.forceVector.Add( this.tempVector1 );
    }
    
    if ( this.forceVector.x !== 0 || this.forceVector.y !== 0) {
      this.physicsBody.ApplyForce( this.forceVector, this.physicsBody.GetWorldCenter() );
    }
  },

  setPosition: function( position ) {
    //Set the graphical body position and the physics body
    this.model.set( {"payload.position" : { x: position.x, y: position.y, z: position.z}});
    this.physicsBody.SetPosition( new b2Vec2( position.x, position.z ) );
  },

  getPosition2D: function() {
    return this.physicsBody.GetPosition();
  },

  getPosition: function() {
    return this.model.threeData.position;
  },

  setAngle: function( radians ) {
    this._setVehicleAngle( radians );
    this.physicsBody.SetAngle( radians );
  },

  _setVehicleAngle: function( radians ) {
    var quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle( new THREE.Vector3( 0.0, -1.0, 0.0 ), radians );
    this.model.set( {"payload.orientation" : { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w}});
  },

  getModel: function() {
    return this.model;
  },

  getDirectionVector: function() {
    return this.directionVector;
  },

  getVelocity: function() {
    return this.physicsBody.GetLinearVelocity();
  }



}

