/*global $:true */
var AppUI = (function() {

  var tabContainer,
      tabContainerScroll,
      shareToolInitialized = false;

  return {
    
    setLoadingProgress : function(percent) {
      if(!this.loadingProgress) {
        this.createLoadingProgress();
      }
      this.loadingProgress.setProgress(percent); 
    },

    animateLoadingProgress : function(duration, callback) {
      if(!this.loadingProgress) {
        this.createLoadingProgress();
      }
      this.loadingProgress.animate(duration, callback);
    },

    hideHeaders : function() {
      $('#headers').hide();
    },

    showMenus : function() {
      $('.menu').show();
      if(!shareToolInitialized) {
        this.initShareTools();
      }
    },

    hideMenus : function() {
      $('.menu').hide();
    },

    initShareTools : function() {
      shareToolInitialized = true;
      // gplus share functionality can
      // only be envoked when share
      // button parent div is visible
      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();

      // facebook
      (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
      fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    },

    webGLDisabled : function() {
      console.info('webGLDisabled');
      this.hideLoadingProgress(); 
      $('#webGLunsupported').show();
    },

    floatingPointTexturesUnavailable : function() {
      //console.info('floatingPointTexturesUnavailable');
      this.hideLoadingProgress(); 
      $('#fpTexturesUnsupported').show();
    },

    vertexTexturesUnavailable : function() {
      //console.info('vertexTexturesUnavailable');
      this.hideLoadingProgress(); 
      $('#vTexturesUnsupported').show();
    },

    showUI : function() {
      this.hideHeaders();
      this.showMenus();
      this.showInstructions();
    },

    showInstructions : function() {
      var ins = $('#instructions');
      ins.show();
      ins.find('.close').click(function(e){
        ins.hide();
      });
    },

    hideLoadingProgress : function() {
      if(!this.loadingProgress) {
        this.createLoadingProgress();
      }
      this.loadingProgress.hide();
    },

    createLoadingProgress: function() {
      var LoadingProgress = function() {
        this.progressContainer = $('#loading-progress-container');
        this.progressIndicator = this.progressContainer.find('.loading-progress div');
      };

      LoadingProgress.prototype.setProgress = function(percent) {
        this.progressIndicator.css({width:percent+'%'});
      };

      LoadingProgress.prototype.animate = function(duration,callback) {
        this.progressIndicator.animate({width:'100%'},duration,callback);
      };

      LoadingProgress.prototype.hide = function() {
        this.progressContainer.hide();
      };

      this.loadingProgress = new LoadingProgress();
    },

    initControlsOverlay : function(exEventHandlers) { },

    initInfoOverlay : function() {
      var infoPanel = $('#info-panel');
      $('#infoLink').click(function(e){
        var target = $(e.target);
        if(infoPanel.is(':visible')) {
          console.info(target);
          target.addClass('icon-project').removeClass('icon-close');
          infoPanel.hide();
        } else {
          target.removeClass('icon-project').addClass('icon-close');
          infoPanel.show();
        }
      });
    }

  };

})();
