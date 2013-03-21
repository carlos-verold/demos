Track = function( veroldApp ) {

  this.veroldApp = veroldApp;
  this.trackNodes = [];
  this.vehicles = [];

  //Used to generate track spline
  this.trackNodePositions = [];

  //The length of each geometry quad on the track.
  this.segmentLength = 2;
  //The number of geometry quads that stetch accross the width of track
  this.segmentsWide = 2;
  //The width of the track
  this.trackWidth = 4;
  //Whether the track loops or not.
  this.closedCourse = true;

  //The number of track segments that each collision box (at the side of track) will cover
  this.trackSegmentsPerCollisionBox = 1;
}

Track.prototype = {

  constructor: Track,

  initialize : function( physicsSim, scene ) {

    this.physicsSim = physicsSim;
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
        this.trackNodePositions.push( newNode.getPosition() );
      }
    }

    this.trackCurve = new THREE.ClosedSplineCurve3( this.trackNodePositions );

    this.paceRabbit = new PaceRabbit( veroldApp );
    this.paceRabbit.initialize( this );

    this.setupTrackGeometry();

    this.setupTrackCollision();
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

  getNumSegments: function() {
    var trackLength = this.trackCurve.getLength();
    return Math.floor(trackLength / this.segmentLength);
  },

  setupTrackGeometry: function() {
    
    var segments = this.getNumSegments();
    this.trackGeo = new THREE.TrackGeometry( this.trackCurve, segments, this.trackWidth, this.segmentsWide, this.closedCourse );
    this.trackMesh = new THREE.Mesh( this.trackGeo );
    this.scene.threeData.add( this.trackMesh );
  },

  setupTrackCollision: function() {
    
    var collisionWidth = 0.5;
    var segments = this.getNumSegments();

    var prevPos = this.trackCurve.getPointAt( 0 );
    var pos;
    var posAvg = new b2Vec2();
    var binormalAvg = new b2Vec2();
    var tempPos1 = new b2Vec2();
    var tempPos2 = new b2Vec2();
    var tempVec = new b2Vec2();

    for ( var i = 1; i < segments + 1; i++ ) {

      var u = i / ( segments );

      pos = this.trackCurve.getPointAt( u );
      
      var prevTangent = this.trackGeo.tangents[ i - 1 ];
      var prevNormal = this.trackGeo.normals[ i - 1 ];
      var prevBinormal = this.trackGeo.binormals[ i - 1 ];

      var tangent = this.trackGeo.tangents[ i ];
      var normal = this.trackGeo.normals[ i ];
      var binormal = this.trackGeo.binormals[ i ];

      for ( var j = 0; j <= 1; j++ ) {

        var v = -1 + j * 2;

        cx = ( this.trackWidth + collisionWidth) * 0.5 * v;

        //Calculate the centre of the collision by figuring out the average position and binormal on the curve
        posAvg.Set( (pos.x + prevPos.x) * 0.5, ( pos.z + prevPos.z ) * 0.5 );
        binormalAvg.Set( (binormal.x + prevBinormal.x) * 0.5, ( binormal.z + prevBinormal.z ) * 0.5 );
        posAvg.x += cx * binormalAvg.x;
        posAvg.y += cx * binormalAvg.y;
        
        // Calculate the angle of the collision
        var angle = Math.atan2( binormalAvg.y, binormalAvg.x ) ;

        // Calculate the length that the collision geometry needs to be.
        tempPos1.Set( prevPos.x, prevPos.z );
        tempVec.Set( prevBinormal.x, prevBinormal.z );
        tempVec.Multiply( 0.5 * this.trackWidth * v );
        tempPos1.Add( tempVec );

        tempPos2.Set( pos.x, pos.z );
        tempVec.Set( binormal.x, binormal.z );
        tempVec.Multiply( 0.5 * this.trackWidth * v );
        tempPos2.Add( tempVec );

        tempPos2.Subtract( tempPos1 );
        var length = tempPos2.Length() * 1.2;

        // Create the collision body
        this.physicsSim.createTrackSideBody( collisionWidth, length, angle, posAvg );

      }

      prevPos = pos;
    }

  },

  //
  spawnVehicle: function( vehicle ) {

    var position = new THREE.Vector3();
    position.z = this.vehicles.length * 0.5;
    position.x += this.vehicles.length % 2;
    this.vehicles.push( vehicle );

    var segments = this.getNumSegments();
    var t = 1.0 - ( this.vehicles.length * 0.3333 / segments );
    var position = this.trackCurve.getPointAt( t );

    var binormal = this.trackGeo.binormals[ segments - Math.floor(this.vehicles.length * 0.3333) ];
    var lateralPos = this.vehicles.length % 3;
    if ( lateralPos == 0 ) {
      position.sub( binormal);
    }
    else if ( lateralPos == 2 ) {
      position.add( binormal );
    }

    vehicle.setPosition( position );
    //vehicle.setAngle( Math.random() * 2.0 * Math.PI );
    this.scene.addChildObject( vehicle.getModel() );
  }

}

