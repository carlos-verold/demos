/*global define:true, my:true */

define(['myclass'],
function(my) {

  var UserInterface = my.Class({

    constructor : function(canvas) {
      if(!(this instanceof UserInterface)) {
        return new UserInterface(canvas);
      }
      
      this.canvas = canvas;
      this.initialize();
    },

    initialize : function() {
          
    }

  });

  return UserInterface;

});
