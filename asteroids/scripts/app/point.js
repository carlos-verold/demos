/*global define:true, my:true */

define(['myclass'],
function(my){

    var Point = my.Class({

        constructor : function(x,y) {
            if(!(this instanceof Point)) {
                return new Point(x,y);
            }

            var point = (x.x) ? x : {x:x,y:y};

            this.x = point.x || 0;
            this.y = point.y || 0;
        },

        toString : function(){
            return '{x:'+Math.round(this.x)+',y:'+Math.round(this.y)+'}';
        }

    });

    return Point;

});
