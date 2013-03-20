VeroldQuest = function( veroldApp ) {

  this.veroldApp = veroldApp;
  this.mainScene;

  this.player;

  this.mapWidth = 25;
  this.mapHeight = 25;

  this.monsters = [];
}

VeroldQuest.prototype.createDungeon = function() {
  var tileSet = this.veroldApp.getAssetRegistry().getAsset('5142749807591d8d300001cd');

  this.map = new CaveMap(tileSet, this.mainScene, this.mapWidth, this.mapHeight);
  this.map.init();
}

VeroldQuest.prototype.createPlayer = function() {
  var models = this.mainScene.getAllObjects( { "filter" :{ "model" : true }})
    , model = models[_.keys(models)[0]]
    , touchControls;

  if (this.veroldApp.isMobileDevice) {
    touchControls = new PlayerTouchController();
    touchControls.init();
  }

  this.mainScene.removeChildObject(model);

  this.player = new Player(model, this.mainScene, this.inputHandler, touchControls);
  console.log(this.map);

  this.map.translateToMapPosition(this.player.object, this.map.getStartX(), this.map.getStartY());

  console.log(this.player.getCamera());
  this.veroldApp.setActiveCamera( this.player.getCamera() );
}

VeroldQuest.prototype.createMonsters = function() {
  var model = this.mainScene.getObject('51436a377290e30200000478')
  this.mainScene.removeChildObject(model);

  var that = this, assetRegistry = this.veroldApp.getAssetRegistry();

  model.load({ success_hierarchy: function() {
    for (var i = 0; i < 20; i ++) {
      model.clone({ success_hierarchy: function(modelInstance) {
        var monster = new Cerberus(modelInstance, that.mainScene)
          , pos = that.map.getRandomPosition();

        that.mainScene.addChildObject(modelInstance);
        that.map.translateToMapPosition(modelInstance.threeData, pos.x, pos.y);
        that.monsters.push(monster);

        console.log(pos, modelInstance.threeData.position);
      }});
    };
  }});


  console.log(this.monsters);
}

VeroldQuest.prototype.startup = function( ) {
  var that = this;

  this.veroldApp.veroldEngine.Renderer.stats.domElement.hidden = false;

  this.veroldApp.loadScene( null, {
    success_hierarchy: function( scene ) {
      //Store a pointer to the scene
      that.mainScene = scene;

      // hide progress indicator
      that.veroldApp.hideLoadingProgress();

      that.inputHandler = that.veroldApp.getInputHandler();
      that.renderer = that.veroldApp.getRenderer();
      that.picker = that.veroldApp.getPicker();

      that.veroldApp.on("keyDown", that.onKeyDown, that);
      that.veroldApp.on("keyUp", that.onKeyUp, that);
      that.veroldApp.on("mouseUp", that.onMouseUp, that);
      that.veroldApp.on("fixedUpdate", that.fixedUpdate, that );
      that.veroldApp.on("update", that.update, that );

      that.createDungeon();
      that.createPlayer();
      that.createMonsters();
    },

    progress: function(sceneObj) {
      var percent = Math.floor((sceneObj.loadingProgress.loaded_hierarchy / sceneObj.loadingProgress.total_hierarchy)*100);
      that.veroldApp.setLoadingProgress(percent);
    }
  });
}

VeroldQuest.prototype.shutdown = function() {

  this.veroldApp.off("keyDown", this.onKeyPress, this);
  this.veroldApp.off("mouseUp", this.onMouseUp, this);

  this.veroldApp.off("update", this.update, this );
}



VeroldQuest.prototype.update = function( delta ) {
  if (this.player) {
    this.player.update(delta);
  }

  /*
  for (var idx in this.monsters) {
    this.monsters[idx].update(delta);
  }
 */
}

VeroldQuest.prototype.fixedUpdate = function( delta ) {
  if (this.player) {
    this.player.fixedUpdate(delta);
  }

  /*
  for (var idx in this.monsters) {
    this.monsters[idx].fixedUpdate(delta);
  }
 */
}

VeroldQuest.prototype.onMouseUp = function( event ) {

  if ( event.button == this.inputHandler.mouseButtons[ "left" ] &&
    !this.inputHandler.mouseDragStatePrevious[ event.button ] ) {

    var mouseX = event.sceneX / this.veroldApp.getRenderWidth();
    var mouseY = event.sceneY / this.veroldApp.getRenderHeight();
    var pickData = this.picker.pick( this.mainScene.threeData, this.player.getCamera(), mouseX, mouseY );
    if ( pickData ) {
      //Bind 'pick' event to an asset or just let user do this how they want?
      if ( pickData.meshID == "51125eb50a4925020000000f") {
        //Do stuff
      }
    }
  }
}

VeroldQuest.prototype.onKeyDown = function(event) {
  console.log('down', event.keyCode);
}

VeroldQuest.prototype.onKeyUp = function(event) {
  console.log('up', event.keyCode);
}
