/*
 * jQuery-lazyload-any v0.1.5
 * https://github.com/emn178/jquery-lazyload-any
 *
 * Copyright 2014, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function($, window, document, undefined) {
  $.expr[':']['jquery-lazyload-any-appear'] = function(element) {
    return !!$(element).data('jquery-lazyload-any-appear');
  };

  function test() 
  {
    var element = $(this);
    if(visible(this))
      element.trigger('appear');
  }

  function visible(element) 
  {
    var rect = element.getBoundingClientRect();
    var x1 = y1 = -$(element).data('jquery-lazyload-any').threshold;
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
    $(':jquery-lazyload-any-appear').each(test);
  }

  function show() 
  {
    var element = $(this);
    var options = element.data('jquery-lazyload-any');
    element.unbind(options.trigger);
    var comment = element.contents().filter(function() {
      return this.nodeType === 8;
    }).get(0);
    var newElement = $(comment && comment.data);
    element.replaceWith(newElement);

    if($.isFunction(options.load))
      options.load.call(newElement, newElement);
  }

  $.fn.lazyload = function(options) {
    var opts = {
      threshold: 0,
      trigger: 'appear'
    };
    $.extend(opts, options);
    var trigger = opts.trigger.split(' ');
    this.data('jquery-lazyload-any-appear', $.inArray('appear', trigger) != -1);
    this.data('jquery-lazyload-any', opts);
    this.bind(opts.trigger, show);
  };

  $(document).ready(function() {
    $(window).bind('resize', resize);
    $(window).bind('scroll', scroll);
    resize();
  });
})(jQuery, window, document);
