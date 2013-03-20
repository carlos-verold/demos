CarApp = function() {
  
  VeroldApp.call( this );

  this.mainScene;
  this.camera;
  this.lightAnimation = false;
  this.videoPlaying = false;
  this.videoElement = document.getElementById( 'video' );
  this.videoTexture;
}

_.extend( CarApp.prototype, VeroldApp.prototype, {

  constructor: CarApp,

  startup: function( veroldApp ) {

    this.initLogoMaterial();

    var that = this;
    
  	this.veroldEngine.loadScene("5111262e6cfc68020000001a", {
      
      success_hierarchy: function( scene ) {
        
        //Bind to input events to control the camera
        window.verold.veroldEvents.on("engine::input::keyDown", that.onKeyPress, that);
        window.verold.veroldEvents.on("engine::input::mouseUp", that.onMouseUp, that);

        //Store a pointer to the scene
        that.mainScene = scene;
        
        //Create the camera
        that.camera = new CarCamera();
        that.camera.initialize( 70, window.innerWidth, window.innerHeight );

        //Get the car model and point the camera at it.
        that.carModel = that.mainScene.getObject( "511e34987693050200000748" );
        that.camera.setTargetModel( that.carModel.getThreeData() );

        //Tell the engine to use this camera when rendering the scene.
        that.veroldEngine.setActiveCamera( that.camera.getCamera() );

        //Setup the lights for animation.
        that.setupLights();
        
        //Turn off the loading screen.
        $('div#loading').stop().animate({'opacity':0},200,'linear',function(){$('div#loading').remove()});
      }
    });
  	
  },

  shutdown: function() {
  	window.verold.veroldEvents.off("engine::input::keyDown", this.onKeyPress );
    window.verold.veroldEvents.off("engine::input::mouseUp", this.onMouseUp );
  },

  initLogoMaterial: function() {
    var shader_vs = [
      "varying vec2 vUv;",

      "void main() {",

        "vUv = vec2(uv.x, uv.y);",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

      "}",
    ].join("\n");

    var shader_fs = [
        
      "varying vec2 vUv;",
      
      "uniform sampler2D videoTexture;",
      "uniform sampler2D logoTexture;",
      

      "void main() {",

        "vec3 videoColour = texture2D( videoTexture, vUv ).xyz;",
        "vec4 logoColour = texture2D( logoTexture, vUv );",

        "gl_FragColor = vec4( logoColour.xyz * videoColour, logoColour.a );",
      "}",

    ].join("\n");

    this.logoMaterial = new THREE.ShaderMaterial({

      uniforms: {
        videoTexture: { type: "t", value: null },
        logoTexture: { type: "t", value: null },
      },
      blending: THREE.NormalBlending,
      transparent: true,
      vertexShader: shader_vs,
      fragmentShader:  shader_fs

    });

    this.videoTexture = new THREE.Texture( this.videoElement );
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.format = THREE.RGBFormat;
    this.videoTexture.generateMipmaps = false;

    var that = this;
    
    this.logoTexture = this.veroldEngine.assetRegistry.getAsset("51117569febba25d35000020", { autoLoad: true, 
      success: function( texture ) {
        that.logoMaterial.uniforms.logoTexture.value = texture.threeData;
      }
    });
  },

  setupLights: function() {
    var lights = this.mainScene.getAllObjects( { filter: { light: true }} );
    for ( var l in lights ) {
      if ( lights[l].entityModel.get("payload").type == "DirectionalLight" && lights[l].entityModel.get("payload").castShadow ) {
        if ( this.light1 ) {
          this.light2 = lights[l];
        }
        else {
          this.light1 = lights[l];
        }
      }
    }
  },

  update: function( delta ) {
  	if ( this.carModel && this.carModel.threeData ) {
  		
      if ( this.lightAnimation ) {
        this.light1.threeData.quaternion.setFromEuler( {x: 0, y: 0.1, z: 0});
        this.light1.threeData.position.applyQuaternion( this.light1.threeData.quaternion );
        this.light2.threeData.quaternion.setFromEuler( {x: 0, y: -0.1, z: 0});
        this.light2.threeData.position.applyQuaternion( this.light2.threeData.quaternion );
      }
      if ( this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA ) {

        if ( this.videoTexture ) {
          this.videoTexture.needsUpdate = true;

          if ( this.videoPlaying && this.logoMaterial ) {
            var logoMesh = this.mainScene.getObject( "51125eb50a4925020000000f" );
            logoMesh.threeData.material = this.logoMaterial;
            logoMesh.threeData.material.needsUpdate = true;
            this.logoMaterial.uniforms.videoTexture.value = this.videoTexture;
          }
          else {
            this.logoMaterial.uniforms.videoTexture.value = this.veroldEngine.assetRegistry.getAsset("white").threeData;
          }
        }

      }
  	}
  },

  toggleLights: function() {
    this.lightAnimation = !this.lightAnimation;
    if ( this.light1.threeData.prevColor ) {
      this.light1.threeData.color = this.light1.threeData.prevColor;
      this.light1.threeData.prevColor = null;
    }
    if ( this.light2.threeData.prevColor ) {
      this.light2.threeData.color = this.light2.threeData.prevColor;
      this.light2.threeData.prevColor = null;
    }
  },

  togglePoliceLights: function() {
    if ( !this.lightAnimation ) {
      this.lightAnimation = true;
    }
    if ( this.light1.threeData.prevColor ) {
      this.light1.threeData.color = this.light1.threeData.prevColor;
      this.light1.threeData.prevColor = null;
      this.lightAnimation = false;
    }
    else {
      this.light1.threeData.prevColor = this.light1.threeData.color;
      this.light1.threeData.color = new THREE.Color(0xff0000);
    }
    if ( this.light2.threeData.prevColor ) {
      this.light2.threeData.color = this.light2.threeData.prevColor;
      this.light2.threeData.prevColor = null;
    }
    else {
      this.light2.threeData.prevColor = this.light2.threeData.color;
      this.light2.threeData.color = new THREE.Color(0x0000ff);
    }
  },

  toggleVideo: function() {
    this.videoPlaying = !this.videoPlaying;
    this.videoElement.muted = !this.videoPlaying;
  },

  onMouseUp: function( parameters ) {
    var event = parameters.event;
    if ( event.button == this.veroldEngine.Input.mouseButtons[ "left" ] && 
      !this.veroldEngine.Input.mouseDragStatePrevious[ event.button ] ) {
      
      // var scene = this.veroldEngine.assetRegistry.assets[ this.currentSceneID ].threeData;
      // var camera = this.veroldEngine.getActiveCamera();
      var mouseX = event.sceneX / this.veroldEngine.Renderer.getWidth();
      var mouseY = event.sceneY / this.veroldEngine.Renderer.getHeight();
      var pickData = this.veroldEngine.geometryPicker.pick( this.mainScene.threeData, this.camera.getCamera(), mouseX, mouseY );
      if ( pickData ) {
        if ( pickData.meshID == "51125eb50a4925020000000f") {
          //Logo
          this.toggleVideo();
        }
        else if ( pickData.meshID == "51125faec61d58020000000b") {
          //Tyga
          this.toggleLights();
        }
        else if ( pickData.meshID == "5112e19addb69f02000006f7") {
          //Police Car
          this.togglePoliceLights();
        }
      }
    }
  },

  onKeyPress: function( parameters ) {
  	var event = parameters.event;
  	var keyCodes = this.veroldEngine.Input.keyCodes;
    if ( event.keyCode === keyCodes['B'] ) {
      var that = this;
      this.boundingBoxesOn = !this.boundingBoxesOn;
      var scene = veroldApp.veroldEngine.getActiveScene();
      if ( scene.threeData ) {
        scene.threeData.traverse( function( obj ) {
          if ( obj.isBB ) {
            obj.visible = that.boundingBoxesOn;
          }
        });
      }
    }
    else if ( event.keyCode === keyCodes['L']) // C
    {
      this.togglePoliceLights();
    }

      
  },
});

