TrackNode = function( veroldApp ) {

  this.veroldApp = veroldApp;
  
}

TrackNode.prototype = {

  constructor: TrackNode,

  initialize : function( model ) {

    var that = this;
    //Bind to main update loop
    that.veroldApp.on("update", that.update, that );
    this.model = model;

  },

  uninitialize : function() {
	
    this.veroldApp.off("update", this.update, this );
    this.model = undefined;
  },

  update : function( delta ) {
    
  },

  fixedUpdate : function( delta ) {

  },

  getPosition : function() {
    return this.model.threeData.position;
  }

}

