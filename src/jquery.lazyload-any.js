/*
 * jQuery-lazyload-any v0.2.2
 * https://github.com/emn178/jquery-lazyload-any
 *
 * Copyright 2014, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function($, window, document, undefined) {
  var KEY = 'jquery-lazyload-any';
  var EVENT = 'appear';
  var SELECTOR_KEY = KEY + '-' + EVENT;
  var SELECTOR = ':' + SELECTOR_KEY;
  var SCROLLER_KEY = KEY + '-scroller';
  var DISPLAY_KEY = KEY + '-display';
  var WATCH_KEY = KEY + '-watch';
  var screenHeight, screenWidth, init = false, observations = $();

  $.expr[':'][SELECTOR_KEY] = function(element) {
    return $(element).data(SELECTOR_KEY) !== undefined;
  };

  function test() {
    var element = $(this);
    if(element.is(':visible') && visible(element)) {
      element.trigger(EVENT);
    }
  }

  function visible(element) {
    var rect = element[0].getBoundingClientRect();
    var x1 = y1 = -element.data(KEY).threshold;
    var y2 = screenHeight - y1;
    var x2 = screenWidth - x1;
    return (rect.top >= y1 && rect.top <= y2 || rect.bottom >= y1 && rect.bottom <= y2) &&
      (rect.left >= x1 && rect.left <= x2 || rect.right >= x1 && rect.right <= x2);
  }

  function resize() {
    screenHeight = window.innerHeight || document.documentElement.clientHeight;
    screenWidth = window.innerWidth || document.documentElement.clientWidth;
    detect();
  }

  function detect() {
    observations = observations.filter(SELECTOR);
    if(this.nodeType == 1) {
      $(this).find(SELECTOR).each(test);
    } else {
      observations.each(test);
    }
  }

  function show() {
    var element = $(this);
    var options = element.data(KEY);
    var comment = element.contents().filter(function() {
      return this.nodeType === 8;
    }).get(0);
    var newElement = $(comment && $.trim(comment.data));
    element.replaceWith(newElement);

    if($.isFunction(options.load)) {
      options.load.call(newElement, newElement);
    }
  }

  function watch() {
    var element = $(this);
    if(!(watchScroller(element) | watchDisplay(element))) {
      return;
    }
    if(element.data(WATCH_KEY)) {
      return;
    }
    element.data(WATCH_KEY, 1);
    element.bind(EVENT, clearWatch);
  }

  function watchScroller(element) {
    if(element.data(SCROLLER_KEY)) {
      return false;
    }
    var overflow = element.css('overflow');
    if(overflow != 'scroll' && overflow != 'auto') {
      return false;
    }
    element.data(SCROLLER_KEY, 1);
    element.bind('scroll', detect);
    return true;
  }

  function watchDisplay(element) {
    if(element.data(DISPLAY_KEY)) {
      return;
    }
    var display = element.css('display');
    if(display != 'none') {
      return;
    }
    element.data(DISPLAY_KEY, 1);
    element._bindShow(detect);
    return true;
  }

  function clearWatch() {
    var element = $(this);
    if(element.find(SELECTOR).length == 0) {
      element.removeData(SCROLLER_KEY).removeData(DISPLAY_KEY).removeData(WATCH_KEY);
      element.unbind('scroll', detect).unbind(EVENT, clearWatch)._unbindShow(detect);
    }
  }

  $.fn.lazyload = function(options) {
    var opts = {
      threshold: 0,
      trigger: EVENT
    };
    $.extend(opts, options);
    var trigger = opts.trigger.split(' ');
    this.data(SELECTOR_KEY, $.inArray(EVENT, trigger) != -1).data(KEY, opts);
    this.bind(opts.trigger, show);
    this.each(test);
    this.parents().each(watch);
    this.each(function() {
      observations = observations.add(this);
    });

    if(!init) {
      init = true;
      resize();
      $(document).ready(function() {
        $(window).bind('resize', resize).bind('scroll', detect);
      });
    }
    return this;
  };

  $.lazyload = {
    check: detect
  };

  // SHOW EVENT
  (function() {
    var EVENT = 'show';
    var SELECTOR_KEY = KEY + '-' + EVENT;
    var SELECTOR = ':' + SELECTOR_KEY;
    var interval = 50, timer, observations = $();

    $.expr[':'][SELECTOR_KEY] = function(element) {
      return $(element).data(SELECTOR_KEY) !== undefined;
    };

    function detect() {
      observations = observations.filter(SELECTOR);
      observations.each(test);
      if(observations.length == 0) {
        timer = clearInterval(timer);
      }
    }

    function test() {
      var element = $(this);
      var status = element.css('display') != 'none';
      if(element.data(SELECTOR_KEY) != status) {
        element.data(SELECTOR_KEY, status);
        if(status) {
          element.trigger(EVENT);
        }
      }
    }

    $.fn._bindShow = function(handler) {
      this.bind(EVENT, handler);
      this.data(SELECTOR_KEY, this.css('display') != 'none');
      observations = observations.add(this);
      if(interval && !timer) {
        timer = setInterval(detect, interval);
      }
    };

    $.fn._unbindShow = function(handler) {
      this.unbind(EVENT, handler);
      this.removeData(SELECTOR_KEY);
    };

    $.lazyload.setInterval = function(v) {
      if(v == interval || !$.isNumeric(v) || v < 0) {
        return;
      }
      interval = v;
      timer = clearInterval(timer);
      if(interval > 0) {
        timer = setInterval(detect, interval);
      }
    };
  })();
})(jQuery, window, document);
