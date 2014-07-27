/*
 * jQuery-lazyload-any v0.1.8
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

  $.expr[':'][SELECTOR_KEY] = function(element) {
    return !!$(element).data(SELECTOR_KEY);
  };

  function test() 
  {
    var element = $(this);
    if(element.is(':visible') && visible(element))
      element.trigger(EVENT);
  }

  function visible(element) 
  {
    var rect = element[0].getBoundingClientRect();
    var x1 = y1 = -element.data(KEY).threshold;
    var y2 = screenHeight - y1;
    var x2 = screenWidth - x1;
    return (rect.top >= y1 && rect.top <= y2 || rect.bottom >= y1 && rect.bottom <= y2) &&
      (rect.left >= x1 && rect.left <= x2 || rect.right >= x1 && rect.right <= x2);
  }

  var screenHeight, screenWidth;
  function resize()
  {
    screenHeight = window.innerHeight || document.documentElement.clientHeight;
    screenWidth = window.innerWidth || document.documentElement.clientWidth;
    scroll();
  }

  function scroll()
  {
    $(SELECTOR).each(test);
  }

  function show() 
  {
    var element = $(this);
    var options = element.data(KEY);
    element.bind(options.trigger);
    var comment = element.contents().filter(function() {
      return this.nodeType === 8;
    }).get(0);
    var newElement = $(comment && comment.data.trim());
    element.replaceWith(newElement);

    if($.isFunction(options.load))
      options.load.call(newElement, newElement);
  }

  $.fn.lazyload = function(options) {
    var opts = {
      threshold: 0,
      trigger: EVENT
    };
    $.extend(opts, options);
    var trigger = opts.trigger.split(' ');
    this.data(SELECTOR_KEY, $.inArray(EVENT, trigger) != -1);
    this.data(KEY, opts);
    this.bind(opts.trigger, show);
    this.each(test);
  };

  $(document).ready(function() {
    $(window).bind('resize', resize);
    $(window).bind('scroll', scroll);
    resize();
  });
})(jQuery, window, document);
