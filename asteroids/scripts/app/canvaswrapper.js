/*global define:true, my:true */

define([
    'myclass',
    'app/util'
],function(
    my,
    util
) {
            
    // paul irish's requestAnimationFrame shim
    var requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    }());

    var bounds = {};
    var bboffset = 5;
    var size = {width:0,height:0};

    var CanvasWrapper = my.Class({

        constructor : function(tagId) {
            if(!(this instanceof CanvasWrapper)) {
                return new CanvasWrapper(tagId);
            }

            this.tagId = tagId;
            this.initialize();
        },

        initialize : function() {

            var canvas = $(this.tagId).get(0);
            this.setCanvasSize(canvas);

            this.context = canvas.getContext("2d");

            $(window).resize($.proxy(function() {
                this.setCanvasSize(canvas);
            },this));
        },

        setCanvasSize : function(canvas) {
            var canvasSize = this.toBodySize();
            bounds.x1 = 0;
            bounds.y1 = 0;
            bounds.x2 = canvasSize.width;
            bounds.y2 = canvasSize.height;

            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
        },

        toBodySize : function() {
            var b = $('body');
            return {
                width: b.outerWidth(false),
                height : b.outerHeight(false)
            };
        },

        initRenderLoop : function(renderCallback,context) {
            (function animLoop() {
                requestAnimFrame(animLoop);
                renderCallback.call(context,Date.now());
            }());
        },

        clear : function() {
            if(!!this.context) {
                this.context.clearRect(bounds.x1,bounds.y1,bounds.x2,bounds.y2);
            }
        },

        getBounds : function() {
            return bounds;
        },

        getSize : function() {
            size.width = bounds.x2;
            size.height = bounds.y2;
            return size;
        },

        plotPoints : function(params) {
            var ps = params.points,
                l = ps.length,
                i = l,
                tp = null,
                x1=Infinity,
                y1=Infinity,
                x2=-Infinity,
                y2=-Infinity;
            
                while(i--) {
                    tp = ps[i];
                    tp = util.rotate(tp,params.direction);
                    util.scale(tp,params.scale);
                    util.translate(tp,params.position);
                    if(i===l) {
                        this.context.moveTo(tp.x,tp.y)
                    } else {
                        this.context.lineTo(tp.x,tp.y)
                    }
                    if(tp.x<x1) {x1 = tp.x;}
                    if(tp.y<y1) {y1 = tp.y;}
                    if(tp.x>x2) {x2 = tp.x;}
                    if(tp.y>y2) {y2 = tp.y;}
                }

            tp = i = l = null;
            return this.getBoundsAndBlitZone(x1,x2,y1,y2);
        },

        plotText : function(params){
            var pos = params.motionElement.getPosition(),
                textMetrics = null,
                height = 48,
                x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0;

            this.context.font = height.toString() + "px serif";
            this.context.textBaseline = "top";
            this.context.fillText(params.shapeData,pos.x,pos.y);
            textMetrics = this.context.measureText(params.shapeData);

            x1 = pos.x;
            y1 = pos.y;
            x2 = pos.x + textMetrics.width;
            y2 = pos.y + height;

            return this.getBoundsAndBlitZone(x1,x2,y1,y2);

        },

        plotShapeData : function(params) {
            var p = params.points,
                shDtType = util.type(p),
                funcs = {'array':this.plotPoints,'string':this.plotText};
            return funcs[shDtType].call(this,params);
        },

        getBoundsAndBlitZone : function(x1,x2,y1,y2) {
            return {
                'bounds':{x:x1,y:y1,w:(x2-x1),h:(y2-y1)},
                'blitZone':{x:x1-bboffset,y:y1-bboffset,w:(x2-x1)+(bboffset*2),h:(y2-y1)+(bboffset*2)}
            };
        },

        drawShape : function(params) {
            this.context.save();
            this.setDrawStyles(params.drawStyles);
            this.context.beginPath();
            this.bbox = this.plotShapeData(params);
            this.context.closePath();
            this.context.fill();
            this.context.stroke();
            this.context.restore();
        },

        setDrawStyles : function(styles) {
            var that = this;
            _.each(styles,function(val,key) {
               that.context[key] = val;
            });
        },

        drawBoundingBox : function(params) {
            // var this.context = params.stage.getCtx();
            // this.context.lineWidth = 1;
            // this.context.strokeStyle="#ffff00";
            // this.context.strokeRect(
            //     this.bbox.bounds.x,
            //     this.bbox.bounds.y,
            //     this.bbox.bounds.w,
            //     this.bbox.bounds.h
            // );
        }

    });

    return CanvasWrapper;

});
