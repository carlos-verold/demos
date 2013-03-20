function VeroldApp( properties ) {
  this.el = undefined;

  this.veroldEngine = undefined;

  // this.defaultCamera = undefined;
  // this.defaultCameraJSON = {
  //   id: "default_camera",
  //   type: "camera",
  //   name: "default_camera",
  //   payload: {
  //     "type": "PerspectiveCamera", 
  //     "fov": 50, 
  //     "aspect" : 1.667,
  //     "near" : 0.01,
  //     "far" : 20000,
  //     "orientation" : { x: 0, y: 0, z: 0, w: 1},
  //     "position" : { x: 0, y: 0, z: 2.5 },
  //   }
  // };
}

VeroldApp.prototype = {
  // DOM element

  constructor: VeroldApp,

  // Options:
  //  container - the container that WebGL will be rendered into.
  //  projectId - the ID of the project whose assets will be used by this app.
  //  mainUpdateFunction - the function to call every frame
  //  mainProgramContext - the context to use when calling the mainUpdateFunction (probably 'this')
  //  enablePostProcess - true or false - enables the THREE.JS post process chain.
  //  clearColor - sets the clear color of the renderer.
  initialize: function( options ) {

    //Get the container element to use for WebGL.
    var el;
    if ( !!options.container ) {
      el = options.container;
    }
    else {
      el = $("<div>").css({ "height" : "100%", "width": "100%"}).appendTo("body");
      
    }

    var that = this;

    window.addEventListener( 'resize', function() {
      that.onResize();
    } );


    //Get the project assets from the given project ID.
    //If it's not passed in, get a default project.
    options.projectId;
    VAPI.loadProject( options.projectId, function() {

      //Create the Verold Engine from the given information.
      that.veroldEngine = new VAPI.VeroldEngine( { 
        "engineName" : "Default", 
        "el" : el
      });
      
      that.veroldEngine.initialize( {
        "entities": arguments[2], 
        "mainProgramContext" : that, 
        "mainUpdateFunction" : that.update,
        "handleInput" : options.handleInput,
        "projectId" : options.projectId, 
        "enablePostProcess" : options.enablePostProcess,
        "enablePicking" : options.enablePicking,
        "clearColor" : options.clearColor ? options.clearColor : 0x000000,
        // "isWritable" : this.isWritable,
        // "isEmbedded" : this.isEmbedded,
      });

      //Call callback passed into the boiler plate
      //if ( options.onStartup ) options.onStartup( that );
      that.startup();
    });

  },

  uninitialize: function() {

    this.veroldEngine.uninitialize();
    this.veroldEngine = undefined;

  },

  startup: function() {
    console.warn("VeroldApp.startup() - Override this method in your derrived app and do any startup initialization you need.");
  },

  update: function() {
    console.warn("VeroldApp.update( delta ) - Override this method in your derrived app and do your updating there. This function is called every frame and the 'delta' parameter contains the time ellapsed since the previous frame.");
  },

  resize: function() {
    console.warn("VeroldApp.resize() - Override this method in your derrived app to handle any special resize functionality.");
  },

  // Events
  onResize: function() {
    
    if (this.veroldEngine) {
      this.veroldEngine.onResize();
    }

    this.resize();
  },

  //Return the main THREE.WebGLRenderer
  getRenderer: function() {
    if (this.veroldEngine) {
      return this.veroldEngine.Renderer.renderer;
    }
    return null;
  },

  //If post-processing is enabled, return the main THREE.EffectComposer with this method.
  getEffectComposer: function() {
    if (this.veroldEngine) {
      return this.veroldEngine.Renderer.renderSceneComposer;
    }
  },

  getPicker: function() {
    if (this.veroldEngine) {
      return this.veroldEngine.geometryPicker;
    }
  }
  
}