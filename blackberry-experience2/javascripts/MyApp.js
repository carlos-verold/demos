MyApp = function( veroldApp ) {

  this.veroldApp = veroldApp;  
  this.mainScene;
  this.camera;
  this.cameraControls;
  this.time = 0;
}

MyApp.prototype.startup = function( ) {

  var that = this;
  //this.logoMaterial = new THREE.MeshBasicMaterial();

  this.mainScene = new THREE.Scene();
  window.scene = this.mainScene;
  this.mainLight = new THREE.DirectionalLight( {color: 0xffffff, intensity: 1});
  this.mainLight.castShadow = false;
  this.mainScene.add( this.mainLight );
  this.logoRotationVec = new THREE.Vector3( 0 , 0, 0);
  this.logoCentrePos = new THREE.Vector3( -12.5, -6.5, 0 );
  this.tempRotVec = new THREE.Vector3();

	this.assets = this.veroldApp.getAssetRegistry();
  this.renderer = this.veroldApp.getRenderer();
  this.renderer.autoClear = false;
  this.renderer.shadowMapEnabled = false;
  this.veroldApp.veroldEngine.Renderer.stats.domElement.hidden = false;

  //51431e371c3aa5cc1e001d74 - orange clouds
  //51431d29cdf461857b0000b4 - blue clouds
  //514206cf07591d8d3000007d - fire
  this.distortionTexture = this.assets.Textures.getAsset("514206cf07591d8d3000007d");
  
  that.createShaderTexture();
  
  this.assets.Models.getAsset("513a4d4188f6a57742000412", { autoLoad: true,
    // init_hierarchy: function(model) {
    //   model.traverse( function( obj ) {
    //     if ( obj.type == "mesh" ) {
    //       obj.set("payload.material")
    //     }
    //   })
    // },
    success_hierarchy: function( model ) {

      model.traverse( function( obj ) {
        if ( obj.type == "mesh" ) {
          obj.threeData.material = that.logo_material;
          //obj.threeData.visible = false;
        }
      })

      // model.threeData.children[0].visible = true;
      

      that.logoModel = model.threeData;
      that.logoModel.position.copy( that.logoCentrePos);

      that.mainScene.add( that.logoModel );

      //Hack the scene into a loaded state. This is NOT how we should be doing this.
      var sceneObj = that.assets.Scenes.assets["513a4bf163117e0200001060"];
      sceneObj.threeData = that.mainScene;
      sceneObj.state = "loaded";
      that.veroldApp.veroldEngine.loadedScenes["513a4bf163117e0200001060"] = { threeData: that.mainScene };

      // hide progress indicator
      that.veroldApp.hideLoadingProgress();

      that.inputHandler = that.veroldApp.getInputHandler();
      that.renderer = that.veroldApp.getRenderer();
      that.picker = that.veroldApp.getPicker();
      
      //Bind to input events to control the camera
      that.veroldApp.on("keyDown", that.onKeyPress, that);
      that.veroldApp.on("mouseUp", that.onMouseUp, that);
      that.veroldApp.on("resize", that.resize, that );
      that.veroldApp.on("update", that.update, that );

      //Create the camera
      that.mainCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.2, 10000 );
      that.mainCamera.up.set( 0, 1, 0 );
      that.mainCamera.position.set( 0, 5, 20 );
      that.mainScene.add(that.mainCamera);

      var lookAt = new THREE.Vector3();
      // lookAt.add( that.logoModel.center );
      // lookAt.multiply( that.logoModel.scale );
      // lookAt.applyQuaternion( that.logoModel.quaternion );
      lookAt.add( that.logoModel.position );

      that.mainCamera.lookAt( lookAt );
      
      //Tell the engine to use this camera when rendering the scene.
      //This is not how things should be done. setActiveCamera/Scene should take in Three.JS data and shouldn't require our assets at all.
      that.veroldApp.veroldEngine.activeCamera = that.mainCamera;
      var currentAspect = that.veroldApp.getRenderWidth() / that.veroldApp.getRenderHeight();
      that.mainCamera.aspect = currentAspect;
      that.mainCamera.updateProjectionMatrix();

      
      // Load controls
      veroldApp.loadScript("javascripts/controls/OrbitControls.js", function() {
        that.cameraControls = new THREE.OrbitControls(that.mainCamera, that.veroldApp.getRenderer().domElement);      
      });
      

    },

    progress: function( modelObj ) {
      var percent = Math.floor((modelObj.loadingProgress.loaded_hierarchy / modelObj.loadingProgress.total_hierarchy)*100);
      that.veroldApp.setLoadingProgress(percent); 
    }
  });
	
}

MyApp.prototype.shutdown = function() {
	
  this.veroldApp.off("keyDown", this.onKeyPress, this);
  this.veroldApp.off("mouseUp", this.onMouseUp, this);

  this.veroldApp.off("update", this.update, this );
  this.veroldApp.off("resize", this.resize, this );
}

  

MyApp.prototype.update = function( delta ) {
  
  // Update the controls 
  if ( this.cameraControls ) {
    this.cameraControls.update();
  }
  this.time += delta;

  //this.logoModel.position.set(0,0,0);
  this.logoRotationVec.set(0 , this.time * 1, 0);
  this.logoModel.quaternion.setFromEuler( this.logoRotationVec );
  
  this.tempRotVec.copy( this.logoCentrePos );
  this.tempRotVec.applyQuaternion( this.logoModel.quaternion );
  this.logoModel.position.copy( this.tempRotVec );

  if ( this.distortionScene ) {
    this.distortionQuad.material = this.distortion_material;
    this.distortion_material.uniforms["iGlobalTime"].value = this.time;
    this.distortion_material.uniforms["iResolution"].value.x = this.veroldApp.getRenderWidth();
    this.distortion_material.uniforms["iResolution"].value.y = this.veroldApp.getRenderHeight();
    this.renderer.render( this.distortionScene, this.distortionCamera );
    //this.renderer.clear( false, true, false );
    // this.renderer.setRenderTarget(null);
    // this.distortionQuad.material = this.background_material;
    // this.renderer.render( this.distortionScene, this.distortionCamera, null, false );
  }

}


MyApp.prototype.onMouseUp = function( event ) {
  


  // if ( event.button == this.inputHandler.mouseButtons[ "left" ] && 
  //   !this.inputHandler.mouseDragStatePrevious[ event.button ] ) {
    
  //   var mouseX = event.sceneX / this.veroldApp.getRenderWidth();
  //   var mouseY = event.sceneY / this.veroldApp.getRenderHeight();
  //   var pickData = this.picker.pick( this.mainScene.threeData, this.camera, mouseX, mouseY );
  //   if ( pickData ) {
  //     //Bind 'pick' event to an asset or just let user do this how they want?
  //     if ( pickData.meshID == "51125eb50a4925020000000f") {
  //       //Do stuff
  //     }
  //   }
  // }
}

MyApp.prototype.onKeyPress = function( event ) {
	
	var keyCodes = this.inputHandler.keyCodes;
  if ( event.keyCode === keyCodes['B'] ) {
    var that = this;
    this.boundingBoxesOn = !this.boundingBoxesOn;
    var scene = veroldApp.getActiveScene();
    
    scene.traverse( function( obj ) {
      if ( obj.isBB ) {
        obj.visible = that.boundingBoxesOn;
      }
    });
  
  }
    
}

MyApp.prototype.resize = function( ) {
  console.log("Resized!")
}

MyApp.prototype.createShaderTexture = function() {
  
  // Created by inigo quilez - iq/2013
  // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  this.distortion_shader_vs = [
    "varying vec2 vUv;",

    "void main() {",

      "vUv = vec2(uv.x, 1.0 - uv.y);",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "gl_Position.z = 1.0;",

    "} "
  ].join("\n");

  this.distortion_shader_fs = [
    "uniform float iGlobalTime;",
    "uniform sampler2D iChannel;",
    "uniform vec2 iResolution;",
    "varying vec2 vUv;",

    "vec3 deform( vec2 p, float scale )",
    "{",
      "vec2 uv;",
     
    
      "float mtime = scale+iGlobalTime;",

      "p.x += 0.5*sin(1.1*mtime);",
      "p.y += 0.5*sin(1.3*mtime);",

      "float a = atan(p.y,p.x);",
      "float r = sqrt(dot(p,p));",
      "float s = r * (1.0+0.5*cos(mtime*1.7));",

      "uv.x = .1*mtime +.05*p.y+.05*cos(mtime+a*2.0)/s;",
      "uv.y = .1*mtime +.05*p.x+.05*sin(mtime+a*2.0)/s;",

      'float w = 0.8-0.2*cos(mtime+3.0*a);',

      "vec3 res = texture2D( iChannel, 0.5*uv ).xyz*w;",
      "return res;",

    "}",

    "void main(void)",
    "{",
      "vec2 q = vUv;",
      "vec2 p = -1.0 + 2.0 * q;",
      "vec3 total = vec3(0.0);",
      "float w = 0.0;",
      "for( int i=0; i<10; i++ )",
      "{",
          "vec3 res = deform(p,w);",
          "total += res;",
          "w += 0.01;",
      "}",
      "total /= 10.0;",

      "w = 2.0*(0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.25 ));",
      "gl_FragColor = vec4( total*w,1.0);",
    "}",
  ].join("\n");

  var xRes = this.veroldApp.getRenderWidth();
  var yRes = this.veroldApp.getRenderHeight();

  this.distortion_material = new THREE.ShaderMaterial({

    uniforms: {
      iResolution: { type: "v2", value: new THREE.Vector2( xRes, yRes) },
      iGlobalTime: { type: "f", value: null },
      iChannel: { type: "t", value: null},
    },
    vertexShader: this.distortion_shader_vs,
    fragmentShader: this.distortion_shader_fs,
    depthTest: true,
    depthWrite: false,
  });

  var that = this;



  this.distortionCamera = new THREE.OrthographicCamera( -xRes/2, xRes/2, yRes/2, -yRes/2, -1000, 10000);

  this.distortionCamera.position.z = 100;
  this.distortionScene = new THREE.Scene();

  this.distortionScene.add( this.distortionCamera );

  var planeGeo = new THREE.PlaneGeometry( xRes, yRes, 1, 1, 1 );

  this.distortionQuad = new THREE.Mesh( planeGeo, this.distortion_material );
  this.distortionQuad.position.z = -9000;
  // this.distortionQuad.position.x = 50;
  // this.distortionQuad.position.y = -50;
  this.distortionScene.add( this.distortionQuad );

  this.distortionBuffer = new THREE.WebGLRenderTarget( xRes, yRes, {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat,
    type: THREE.FloatType,
    stencilBuffer: false
  });

  this.background_shader_vs = [
    "varying vec2 vUv;",

    "void main() {",

      "vUv = vec2(uv.x, 1.0 - uv.y);",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "gl_Position.z = 1.0;",
    "} "
  ].join("\n");

  this.background_shader_fs = [
    
    "uniform sampler2D map;",
    "varying vec2 vUv;",
    "void main(void)",
    "{",
      "vec3 colour = texture2D( map, vUv ).xyz;",
      "gl_FragColor = vec4( colour, 1.0);",
    "}",
  ].join("\n");

  this.background_material = new THREE.ShaderMaterial({

    uniforms: {
      map: { type: "t", value: this.distortionBuffer},
    },
    vertexShader: this.background_shader_vs,
    fragmentShader: this.background_shader_fs,

  });


  this.logo_shader_vs = [
    //"varying vec2 vUv;",
    "varying vec3 vNormal;",
    "varying vec3 vReflect;",
    "void main() {",

      //"vUv = vec2(uv.x, 1.0 - uv.y);",
      THREE.ShaderChunk[ "defaultnormal_vertex" ],
      THREE.ShaderChunk[ "default_vertex" ],
      "vec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * normal;",
      "worldNormal = normalize( worldNormal );",
      "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
      "vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );",

      "vReflect = reflect( cameraToVertex, worldNormal );",

      "vNormal = normalize(transformedNormal);",
      
    "} "
  ].join("\n");

  this.logo_shader_fs = [
    
    "uniform sampler2D map;",
    //"varying vec2 vUv;",
    "varying vec3 vNormal;",
    "varying vec3 vReflect;",
    "void main(void)",
    "{",
      "vec3 colour = vec3(0.4,0.4,0.6) * texture2D( map, vReflect.xy ).xyz;",
      "gl_FragColor = vec4( colour, 1.0);",
    "}",
  ].join("\n");


  this.logo_material = new THREE.ShaderMaterial({

    uniforms: {
      map: { type: "t", value: this.distortionBuffer},
    },
    vertexShader: this.logo_shader_vs,
    fragmentShader: this.logo_shader_fs,

  });

  this.distortionTexture.load( {
    success: function( texture ) {
      that.distortion_material.uniforms["iChannel"].value = texture.threeData;
      that.logo_material.uniforms["map"].value = texture.threeData;
    }
  });
}