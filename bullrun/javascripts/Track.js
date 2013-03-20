Track = function( veroldApp ) {

  this.veroldApp = veroldApp;
  this.trackNodes = [];
  this.vehicles = [];
}

Track.prototype = {

  constructor: Track,

  initialize : function( scene ) {

    var that = this;
    //Bind to main update loop
    this.veroldApp.on("update", this.update, this );
    this.scene = scene;
    sceneObjs = scene.getAllObjects( { filter: { "model" : true }});
    for ( var x in sceneObjs ) {
      var name = sceneObjs[x].entityModel.get("name").slice(0,9);
      if ( name == "PathNode_" ) {
        console.log("Adding path node.");
        var newNode = new TrackNode( this.veroldApp );
        newNode.initialize( sceneObjs[x] );
        this.trackNodes.push( newNode );
      }
    }

    this.paceRabbit = new PaceRabbit( veroldApp );
    this.paceRabbit.initialize( this );
  },

  uninitialize : function() {
	
    this.veroldApp.off("update", this.update, this );
  },

  update : function( delta ) {
    
  },

  fixedUpdate : function( delta ) {

  },

  getPaceRabbit : function() {
    return this.paceRabbit;
  },

  getTrackNode : function( index ) {
    if ( index < this.trackNodes.length ) {
      return this.trackNodes[index];
    }
    return undefined;
  },

  getNumTrackNodes : function() {
    return this.trackNodes.length;
  },

  getScene: function() {
    return this.scene;
  },

  //
  spawnVehicle: function( vehicle ) {
    var position = new THREE.Vector3();
    position.z = this.vehicles.length * 0.5;
    position.x += this.vehicles.length % 2;
    this.vehicles.push( vehicle );
    vehicle.setPosition( position );
    vehicle.setAngle( Math.random() * 2.0 * Math.PI );
    this.scene.addChildObject( vehicle.getModel() );
  }

}

