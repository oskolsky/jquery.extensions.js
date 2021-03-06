(function($) {

  //****************************************************************************************************
  //
  // .. RESIZE TO MAX-WIDTH/HEIGHT, $(el).resizeToMaxWidth();
  //
  //****************************************************************************************************
  $.fn.maxWidth = function() {
    var max = 0;
    this.each(function() {
      max = Math.max(max, $(this).outerWidth());
    });
    return max;
  };

  $.fn.maxHeight = function() {
    var max = 0;
    this.each(function() {
      max = Math.max(max, $(this).outerHeight());
    });
    return max;
  };

  $.fn.resizeToMaxWidth  = function() { this.css({width: this.maxWidth() + 'px'}); return this; };
  $.fn.resizeToMaxHeight = function() { this.css({height: this.maxHeight() + 'px'}); return this; };



  //****************************************************************************************************
  //
  // .. GET ARRAY OF HEIGHTS, var heightsMap = $(el).heightsMap();
  //
  //****************************************************************************************************
  $.fn.heightsMap = function() {
    return this.map(function() {
      var _this = this;
      return {el: _this, height: $(_this).outerHeight()};
    });
  };



  //****************************************************************************************************
  //
  // .. ENSURE VISIBLE, $.ensureVisible(selector, options);
  //
  //****************************************************************************************************
  var
    strategies = {
      reveal: function(wt, wh, tt, th, pt, pb) {
        var
          targetVisible = wt <= tt && (wt + wh) >= (tt + th);

        if (targetVisible) {
          if (wt > tt - pt) {
            return strategies['top'](wt, wh, tt, th, pt, pb);
          }

          if (wt + wh < tt + th + pb) {
            return strategies['bottom'](wt, wh, tt, th, pt, pb);
          }

          return wt;
        }

        if (tt - wt < 0) {
          return strategies['top'](wt, wh, tt, th, pt, pb);
        } else {
          return strategies['bottom'](wt, wh, tt, th, pt, pb);
        }
      },

      top: function(wt, wh, tt, th, pt, pb) {
        return tt - pt;
      },

      bottom: function(wt, wh, tt, th, pt, pb) {
        return tt + th + pb - wh;
      }
    };

  $.ensureVisible = function(selector, options) {
    var
      opts = $.extend({
        paddingTop: 0,
        paddingBottom: 0,
        duration: 200,
        strategy: 'reveal' // top, bottom, reveal
      }, options || {}),

      windowTop = $(document).scrollTop(),
      windowHgt = $(window).height(),
      targetTop = $(selector).offset().top,
      targetHgt = $(selector).outerHeight(),
      pad = opts.paddingTop + opts.paddingBottom,

      targetMatchSize = (targetHgt + pad <= windowHgt),
      deferred = $.Deferred(),
      strategy, value;

    if (targetMatchSize) {
      strategy = strategies[opts.strategy];
    } else {
      strategy = strategies['top'];
    }

    value = Math.max(0, strategy(
      windowTop, windowHgt,
      targetTop, targetHgt,
      opts.paddingTop, opts.paddingBottom
    ));

    if (value == windowTop) {
      deferred.resolve();
      return deferred.promise();
    } else {
      return $('html, body').animate({scrollTop: value}, opts.duration).promise();
    }
  };

})(jQuery);