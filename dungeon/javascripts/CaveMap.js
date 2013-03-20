function CaveMap(tileSet, scene, mapWidth, mapHeight) {
  this.mapWidth = mapWidth;
  this.mapHeight = mapHeight;
  this.tileSet = tileSet;
  this.scene = scene;

  this.startX = 0;
  this.startY = 0;

  this.cells = {
    WALL: 0,
    CORRIDOR: 1,
    ROOM: 2,
    DOOR: 3,
    ENTRANCE: 4,
    EXIT: 5
  };

  this.tiles = {};

  this.generateMap();
}

CaveMap.prototype.getStartX = function() {
  return this.startX;
}

CaveMap.prototype.getStartY = function() {
  return this.startY;
}

CaveMap.prototype.getRandomPosition = function() {
  var that = this;

  getRandomPosition = function() {
    var pos = Math.floor(Math.random() * that.mapWidth * that.mapHeight);

    if (that.map[pos] == 1) {
      return { x: pos % that.mapWidth, y: Math.floor(pos / that.mapWidth) };
    } else {
      return getRandomPosition();
    }
  }

  return getRandomPosition();
}

CaveMap.prototype.generateMap = function() {
  /*
  this.mapWidth = 5;
  this.mapHeight = 5;
  this.map = [
    1, 1, 1, 1, 1,
    1, 1, 0, 1, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
  ]
  this.startX = 1, this.startY = 1;
  return;
  */
  var r = dungCarv({
    mapWidth: this.mapWidth,
    mapHeight: this.mapHeight,
    padding: 1,
    randomness: 10 / 100.0,
    twistness: 0 / 100.0,
    rooms: 20 / 100.0,
    roomSize: [
      { min: 2, max: 6, prob: 1 }
    ],
    roomRound: false,
    loops: 0 / 100.0,
    spaces: 0,
    loopSpaceRepeat: 2,
    eraseRoomDeadEnds: true,
    spacesBeforeLoops: false
  });

  for (var i in r.map) {
    if (r.map[i] == this.cells.ENTRANCE)  {
      this.startX = i % this.mapWidth;
      this.startY = Math.floor(i / this.mapHeight);
    }
  }

  this.map = r.map;
}


CaveMap.prototype.getTile = function(map, idx) {
  var type = 'Dirt0'
    , ne, nw, se, sw
    , n, e, s, w;

  if (map[idx] == 0) {
    n = map[idx - this.mapWidth] || 0;
    e = map[idx + 1] || 0;
    s = map[idx + this.mapWidth] || 0;
    w = map[idx - 1] || 0;

    if (n != this.cells.WALL && e != this.cells.WALL && s != this.cells.WALL && w != this.cells.WALL) {
      type = 'Dirt104';
    } else if (n != this.cells.WALL && e != this.cells.WALL && s != this.cells.WALL) {
      type = 'Dirt103E';
    } else if (e != this.cells.WALL && s != this.cells.WALL && w != this.cells.WALL) {
      type = 'Dirt103S';
    } else if (s != this.cells.WALL && w != this.cells.WALL && n != this.cells.WALL) {
      type = 'Dirt103W';
    } else if (w != this.cells.WALL && n != this.cells.WALL && e != this.cells.WALL) {
      type = 'Dirt103N';
    } else if (n != this.cells.WALL && e != this.cells.WALL) {
      type = 'Dirt102NE';
    } else if (e != this.cells.WALL && s != this.cells.WALL) {
      type = 'Dirt102SE';
    } else if (s != this.cells.WALL && w != this.cells.WALL) {
      type = 'Dirt102SW';
    } else if (w != this.cells.WALL && n != this.cells.WALL) {
      type = 'Dirt102NW';
    } else if (n != this.cells.WALL && s != this.cells.WALL) {
      type = 'Dirt102NS-A';
    } else if (w != this.cells.WALL && e != this.cells.WALL) {
      type = 'Dirt102WE-A';
    } else if (e != this.cells.WALL) {
      type = 'DirtCo101E';
    } else if (w != this.cells.WALL) {
      type = 'DirtCo101W';
    } else if (n != this.cells.WALL) {
      type = 'DirtCo101N';
    } else if (s != this.cells.WALL) {
      type = 'DirtCo101S';
    } else {
      type = 'Dirt100';

      ne = map[idx - this.mapWidth + 1] || 0;
      se = map[idx + this.mapWidth + 1] || 0;
      sw = map[idx + this.mapWidth - 1] || 0;
      nw = map[idx - this.mapWidth - 1] || 0;

      if (ne != this.cells.WALL && se != this.cells.WALL && sw != this.cells.WALL && nw != this.cells.WALL) {
        type = 'DirtCo100';
      } else if (ne != this.cells.WALL && se != this.cells.WALL && sw != this.cells.WALL) {
        type = 'DirtCo100NE-SW-SE';
      } else if (se != this.cells.WALL && sw != this.cells.WALL && nw != this.cells.WALL) {
        type = 'DirtCo100NW-SW-SE';
      } else if (sw != this.cells.WALL && nw != this.cells.WALL && ne != this.cells.WALL) {
        type = 'DirtCo100NW-NE-SW';
      } else if (nw != this.cells.WALL && ne != this.cells.WALL && se != this.cells.WALL) {
        type = 'DirtCo100NW-NE-SE';
      } else if (ne != this.cells.WALL && nw != this.cells.WALL) {
        type = 'DirtCo100NW-NE';
      } else if (ne != this.cells.WALL && se != this.cells.WALL) {
        type = 'DirtCo100NE-SE';
      } else if (ne != this.cells.WALL && sw != this.cells.WALL) {
        type = 'DirtCo100NE-SW';
      } else if (nw != this.cells.WALL && se != this.cells.WALL) {
        type = 'DirtCo100NW-SE';
      } else if (nw != this.cells.WALL && sw != this.cells.WALL) {
        type = 'DirtCo100NW-SW';
      } else if (se != this.cells.WALL && sw != this.cells.WALL) {
        type = 'DirtCo100SW-SE'
      } else if (se != this.cells.WALL) {
        type = 'DirtCo100SE';
      } else if (ne != this.cells.WALL) {
        type = 'DirtCo100NE';
      } else if (nw != this.cells.WALL) {
        type = 'DirtCo100NW';
      } else if (sw != this.cells.WALL) {
        type = 'DirtCo100SW';
      }
    }
  }

  if (!this.tiles[type]) {
    console.log('Missing tile: %s', type);
    return this.tiles['Dirt0'];
  }

  //console.log(type);

  return this.tiles[type];
}

CaveMap.prototype.init = function() {
  var that = this;
  this.tileSet.load({ success_hierarchy: function(tileSet) {
    that.tileSet.traverse(function(obj) {
      if (obj instanceof MeshObject) {
        var name = obj.entityModel.get('name');
        console.log('Tile Added:', name);

        that.tiles[name] = obj.threeData;
      }
    });

    for (var y = 0; y < that.mapHeight; y++) {
      for (x = 0; x < that.mapWidth; x++) {
        var idx = y * that.mapWidth + x;
        var tile = that.getTile(that.map, idx);

        var threeObj = tile.clone();

        threeObj.scale = new THREE.Vector3(0.8, 0.8, 0.8);

        that.translateToMapPosition(threeObj, x, y);

        that.scene.threeData.add(threeObj);
      }
    }
  }});
}

CaveMap.prototype.translateToMapPosition = function(obj, x, y) {
  obj.position.x = -this.mapWidth + x * 2;
  obj.position.z = -this.mapHeight + y * 2;
}
