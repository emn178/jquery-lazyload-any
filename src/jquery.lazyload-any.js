/*
 * jQuery-lazyload-any v0.2.0
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
  var CONTAINER_KEY = KEY + '-container';
  var CONTAINER_SELECTOR = ':' + CONTAINER_KEY;
  var screenHeight, screenWidth, init = false;
  var interval = 50, timer, containers = $();

  $.expr[':'][SELECTOR_KEY] = function(element) {
    return !!$(element).data(SELECTOR_KEY);
  };

  $.expr[':'][CONTAINER_KEY] = function(element) {
    return !!$(element).data(CONTAINER_KEY);
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
    scroll();
  }

  function scroll() {
    $(SELECTOR).each(test);
  }

  function show() {
    var element = $(this);
    var options = element.data(KEY);
    var comment = element.contents().filter(function() {
      return this.nodeType === 8;
    }).get(0);
    var newElement = $(comment && comment.data.trim());
    element.replaceWith(newElement);

    if($.isFunction(options.load)) {
      options.load.call(newElement, newElement);
    }
  }

  function updateContainer() {
    var element = $(this);
    if(element.find(SELECTOR).length == 0) {
      element.removeData(SCROLLER_KEY);
      element.removeData(CONTAINER_KEY);
      element.unbind('scroll', scroll).unbind(EVENT, updateContainer);
    }
  }

  function checkDisplay() {
    containers.find(SELECTOR).each(test);
    containers = containers.filter(CONTAINER_SELECTOR);
    if(containers.length == 0) {
      timer = clearInterval(timer);
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

    this.parents().each(function() {
      var element = $(this);
      if(!element.data(SCROLLER_KEY)) {
        var overflow = element.css('overflow');
        if(overflow == 'scroll' || overflow == 'auto') {
          element.data(SCROLLER_KEY, 1);
          element.bind('scroll', scroll);
          if(!element.data(CONTAINER_KEY)) {
            element.bind(EVENT, updateContainer);
          }
        }
      }
      if(!element.data(CONTAINER_KEY)) {
        var display = element.css('display');
        if(display == 'none') {
          element.data(CONTAINER_KEY, 1);
          if(!element.data(SCROLLER_KEY)) {
            element.bind(EVENT, updateContainer);
          }
          containers = containers.add(element);
          if(interval && !timer) {
            timer = setInterval(checkDisplay, interval);
          }
        }
      }
    });

    if(!init) {
      init = true;
      $(document).ready(function() {
        $(window).bind('resize', resize).bind('scroll', scroll);
        resize();
      });
    }
    return this;
  };

  $.lazyload = {
    check: scroll,
    setInterval: function(v) {
      if(v == interval || !$.isNumeric(v) || v < 0) {
        return;
      }
      interval = v;
      timer = clearInterval(timer);
      if(interval > 0) {
        timer = setInterval(checkDisplay, interval);
      }
    }
  };
})(jQuery, window, document);
