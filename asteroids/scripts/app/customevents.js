/*global define:true, my:true */

define([
  'myclass'
] , function(
  my
) {

  var CustomEvents = my.Class({

    constructor : function() {
      if(!(this instanceof CustomEvents)) {
        return new CustomEvents();
      }

      this.eventDispatcher = $({});
      this.eventTypes = {};

    },

    on : function(type, eventHandler, scope) {
      var handler,
          handlers = {
            originalHandler : eventHandler
          }

      if(!(type in this.eventTypes)) {
        this.eventTypes[type] = [];
      }

      if(!!scope) {
        handler = $.proxy(eventHandler,scope);
        handlers.scopedHandler = handler;
      } else {
        handler = eventHandler;
      }

      this.eventTypes[type].push(handlers);
      this.eventDispatcher.on(type,handler);
    },

    off : function(type,eventHandler) {
      var eventTypeHandlers = this.eventTypes[type],
          handlers,
          actualHandler;

      if(!eventTypeHandlers) { return; }

      var i = 0, l = eventTypeHandlers.length;
      for(i=0;i<l;i+=1) {
        handlers = eventTypeHandlers[i];
        if(handlers.originalHandler === eventHandler) {
          actualHandler = handlers.originalHandler;
        } else if(handlers.scopedHandler === eventHandler) {
          actualHandler = handlers.originalHandler;
        }
      }
      this.eventDispatcher.off(type,actualHandler);
    },

    trigger : function(type) {
      var params = _.rest(arguments);
      this.eventDispatcher.trigger(type,params);
    }

  });

  return CustomEvents;

});
