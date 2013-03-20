/*global define:true, my:true */
define([

] , function(

){ 

    return {

        type : function(obj) {
            return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
        },

        tr : function (theta) {
            return theta * (Math.PI/180);
        },

        td : function (theta) {
            return theta * (180/Math.PI);
        },

        round : function(num,decimals) {
            var base10 = Math.pow(10,decimals);
            return Math.round(num*base10)/base10;
        },

        /**
         * randRange returns either a number 
         * from 0 to supplied positive integer
         * (single argument), or return a rand num
         * from "floor" first arg, to "ceiling" second arg
         *
         * result will never excede the high number - 1
         *
         * @method:randRange
         * @param:highOrLow high is only arg
         * @param:highOnly
         */
        randRange : function() {
            var args = _.toArray(arguments),
                multiplyer, floor;
        
            if(args.length > 1) {
                 multiplyer = args[1]-args[0];
                 floor = args[0] + 1;
            } else {
                 multiplyer = args[0];
                 floor = 0;
            }
            return floor + Math.floor(Math.random() * multiplyer);
        },

        getVelocity : function(v,a,t) {
            return v + (a*(+new Date() - t));
        },

        getAcceleration : function (f,m) {
            if(f === 0) { return 0; }
            return f/m;
        },

        padRight : function(num,padding){
            var numstr = num.toString(),
                result = numstr.split('.');

            padding -= (result[1]) ? result[1].length : 0;
            result = this.strOfChars(padding,'0');
            return numstr + result;
        },

        strOfChars : function(num,char) {
            var str = [];
            while(num--) {
                str.push(char);
            }
            return str.join('');
        },

        /**
        *
        * @method:cacheResult
        * @description: Cache the result of an anonymous function that is intended to 
        *               run only once. Must return a value that is truthy, otherwise,
        *               the key will not register as flaged as storing data, thus, not
        *               returning a cached value
        *
        *               Example Usage:
        *               pnts = $G.U.cacheResult(function() {
        *                   pnts.rc = new vec(size,$G.U.tr(90)).toPoint();
        *                   pnts.lc = new vec(size,-$G.U.tr(90)).toPoint();
        *                   pnts.nc = new vec(100,0).toPoint();
        *                   return pnts;
        *               });
        *
        *               Note: Can not be relied upon to use variables manipulated
        *               within anonymous function, within preceding parent scope.
        *
        */
        cacheResult : function cacheResult(fn,context) {
            var thisfn = cacheResult,
                fncode = fn.toString(),
                storedfn = null;

            if(!thisfn.fnresults) { thisfn.fnresults = {}; }
            
            return (!thisfn.fnresults[fncode]) ?
                thisfn.fnresults[fncode] = fn.call(context||window) :
                thisfn.fnresults[fncode];
        },

        distanceBetweenPoints : function(p1,p2) {
           return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
        },

        calcAngle : function(p) {
            return this.round(Math.atan2(p.y,p.x),5);
        },
        
        calcMagnitude : function(p) {
            return this.round(Math.sqrt(Math.pow(p.x,2)+Math.pow(p.y,2)),5);
        },

        toPolar : function(p){
            return {'mag':this.calcMagnitude(p),'dir':this.calcAngle(p)};
        },

        toCartesianX : function(mag,dir){
            return this.round(mag * Math.cos(dir),5);
        },

        toCartesianY : function(mag,dir){
            return this.round(mag * Math.sin(dir),5);
        },

        toCartesian : function (vec) {
            return {'x':this.toCartesianX(vec.mag,vec.dir),'y':this.toCartesianY(vec.mag,vec.dir)};
        },

        generateCircPoints : function (numOfPoints,mag) {
            var points = [],
                dirStep = 360 / numOfPoints,
                a = 0;
            
            for(a = 0; a < 360; a+= dirStep) {
                points.push(this.toCartesian({dir:this.tr(a),mag:mag}));
            }

            return points;
        },

        scale : function(point,scale){
            point.x *= scale;
            point.y *= scale;
        },

        translate : function(point,toPos){
            point.x += toPos.x;
            point.y += toPos.y;
        },

        rotate : function(point,dir){
            var vec = this.toPolar(point);
            vec.dir += dir;
            return this.toCartesian(vec);
        },

        addPoints : function(p1,p2) {
            return {x:p1.x+p2.x,y:p1.y+p2.y};
        },


        initTimingLoop : function(timing,callback,context) {
            var time = +new Date();
            return function() {
                if((+new Date())-time > timing) {
                    callback.call(context,time);
                    time = +new Date();
                }
            };
        },

        cleanTemplate : function(selector) {
            return $.trim($(selector).html()).
                replace(/\n/mg,'').
                replace(/\s{2,}/g,'');
        },

        rgbComponents : function (hexColor) {
            var c = [];
            c.push(hexColor.substr(0,2));
            c.push(hexColor.substr(2,2));
            c.push(hexColor.substr(4,2));
            return c;
        },

        numSteps : function (num1,num2,steps) {

            var num = -(num1 - num2),
                step = num/steps,
                degs = [num1],
                curStep = 0,
                i = 0;

            for(i = 1; i < steps; i++) {
                curStep += step;
                degs.push(Math.round(num1 + curStep));
            }
            
            degs.push(num2);

            return degs;
        },

        numToHex2digit : function (num) {
            var place = (num < 16) ? '0' : '';
            return place + num.toString(16);
        },

        gradient : function (c1,c2,steps) {

            var that = this,
                toDecMap = function(item) { return parseInt(item,16); },
                toHexMap = function(item) { return that.numToHex2digit(item); },
                rSteps, gSteps, bSteps,
                degs = [],
                i = 0;

            c1 = this.rgbComponents(c1);
            c2 = this.rgbComponents(c2);

            c1 = _.map(c1,toDecMap);
            c2 = _.map(c2,toDecMap);

            rSteps = _.map(this.numSteps(c1[0],c2[0],steps),toHexMap);
            gSteps = _.map(this.numSteps(c1[1],c2[1],steps),toHexMap);
            bSteps = _.map(this.numSteps(c1[2],c2[2],steps),toHexMap);

            for(i = 0; i < rSteps.length; i++) {
                degs.push(rSteps[i]+gSteps[i]+bSteps[i]);
            }
            
            return degs;
            
        },

        cap : function(subject) {
            return subject.replace(/^([a-z])(.*)$/,function(orig,first,rest){
                return first.toUpperCase() + rest;
            });
        },

        // w: width
        // r: ratio
        sizeByRatio : function(w,r) {
            var rParts = r.split(':');
            var h = w * rParts[1] / rParts[0];
            return {width:w,height:h};
        }

    };
    
});
