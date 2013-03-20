function PlayerTouchController() {
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

PlayerTouchController.prototype.init = function() {
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
      type: 'buttons',
      buttons: [
        {
          label: 'swing', fontSize: 13,
          touchStart: function() {
            that.keys['space'] = true;
          },
          touchEnd: function() {
            that.keys['space'] = false;
          }
        },
        false,
        false,
        false
      ]
    }
  });
}

PlayerTouchController.prototype.keyDown = function(key) {
  return this.keys[key] || false;
}
