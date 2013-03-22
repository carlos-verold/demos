PaceRabbit = function( veroldApp, speed ) {

  this.veroldApp = veroldApp;
  this.speed = speed !== undefined ? speed : 3.5;
  this.startingNode = -1;
  this.lastNode = -1;
  this.interNodeProgress = 0;
  this.currentDifferenceVector = new THREE.Vector3();

  this.maxDriverDistance = 3;
  this.time = 0;
}

PaceRabbit.prototype = {

  constructor: PaceRabbit,

  initialize : function( track ) {

    var that = this;
    //Bind to main update loop
    this.veroldApp.on("update", this.update, this );
    this.track = track;
    var scene = track.getScene();
    sceneObjs = scene.getAllObjects( { filter: { "model" : true }});
    for ( var x in sceneObjs ) {
      var name = sceneObjs[x].entityModel.get("name").slice(0,10);
      if ( name == "PaceRabbit" ) {
        console.log("Adding rabbit model.");
        this.model = sceneObjs[x];
      }
    }

    this.initLocation();

    //Figure out estimated time to finish a lap
    this.lapTime = this.track.trackCurve.getLength() / this.speed;
  },

  uninitialize : function() {
	
    this.veroldApp.off("update", this.update, this );
    this.track = undefined;
    this.veroldApp = undefined;
    this.model = undefined;

  },

  update : function( delta ) {
    this.time += delta;
    var t = ( this.time % this.lapTime ) / this.lapTime;
    var pos = this.track.trackCurve.getPointAt( t );

      // if ( this.interNodeProgress >= 1.0 ) {
      //   this.interNodeProgress = this.interNodeProgress % 1.0;
      //   this.lastNode = this.nextNode;
      //   this.nextNode = (this.lastNode + 1) % this.track.getNumTrackNodes();
        
      // }
      // var lastNode = this.track.getTrackNode( this.lastNode );
      // var nextNode = this.track.getTrackNode( this.nextNode );
      // this.currentDifferenceVector.subVectors( nextNode.getPosition(), lastNode.getPosition() );

      // var lastNodePos = lastNode.getPosition();
      // var progressStep = (this.speed * delta) / this.currentDifferenceVector.length();
      // this.interNodeProgress += progressStep;
      // this.currentDifferenceVector.multiplyScalar( this.interNodeProgress );
      
      this.model.threeData.position.set( pos.x, pos.y, pos.z );// addVectors( lastNodePos, this.currentDifferenceVector );
      
    //}

  },

  fixedUpdate : function( delta ) {

  },

  initLocation : function() {
    var numNodes = this.track.getNumTrackNodes();
    var closestNode = -1;
    var closestDistance = Number.MAX_VALUE;
    var diffVector = new THREE.Vector3();
    for ( var x = 0; x < numNodes; x++ ) {
      var pathNode = this.track.getTrackNode( x );
      diffVector.subVectors( this.model.threeData.position, pathNode.getPosition() );
      var distance = diffVector.length();
      if ( distance < closestDistance ) {
        closestDistance = distance;
        closestNode = x;
      }
    }
    console.log("Pace rabbit will start at track node #" + closestNode);
    this.lastNode = closestNode;
    this.startingNode = closestNode;
    this.nextNode = (this.lastNode + 1) % numNodes;
    var pathNodePos = this.track.getTrackNode( closestNode ).getPosition();
    this.model.threeData.position.set( pathNodePos.x, pathNodePos.y, pathNodePos.z );

  },

  getPosition : function() {
    return this.model.threeData.position;
  }

}

