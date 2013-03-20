function TankTouchController() {
  this.keys = {
    W: false,
    A: false,
    S: false,
    D: false,
    leftArrow: false,
    rightArrow: false,
    upArrow: false,
    downArrow: false
  };
}

TankTouchController.prototype.init = function() {
  var that = this;

  GameController.init({
    left: {
      type: 'dpad',
      dpad: {
        up: {
          touchStart: function(details) {
            that.keys['W'] = true;
          },
          touchEnd: function(details) {
            that.keys['W'] = false;
          }
        },
        down: {
          touchStart: function(details) {
            that.keys['S'] = true;
          },
          touchEnd: function(details) {
            that.keys['S'] = false;
          }
        },
        left: {
          touchStart: function(details) {
            that.keys['A'] = true;
          },
          touchEnd: function(details) {
            that.keys['A'] = false;
          }
        },
        right: {
          touchStart: function(details) {
            that.keys['D'] = true;
          },
          touchEnd: function(details) {
            that.keys['D'] = false;
          }
        }
      }
    },
    right: {
      type: 'dpad',
      dpad: {
        up: {
          touchStart: function(details) {
            that.keys['upArrow'] = true;
          },
          touchEnd: function(details) {
            that.keys['upArrow'] = false;
          }
        },
        down: {
          touchStart: function(details) {
            that.keys['downArrow'] = true;
          },
          touchEnd: function(details) {
            that.keys['downArrow'] = false;
          }
        },
        left: {
          touchStart: function(details) {
            that.keys['leftArrow'] = true;
          },
          touchEnd: function(details) {
            that.keys['leftArrow'] = false;
          }
        },
        right: {
          touchStart: function(details) {
            that.keys['rightArrow'] = true;
          },
          touchEnd: function(details) {
            that.keys['rightArrow'] = false;
          }
        }
      }
    }
  });
}

TankTouchController.prototype.keyDown = function(key) {
  return this.keys[key] || false;
}
