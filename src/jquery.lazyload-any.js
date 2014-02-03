/*
 * jQuery-lazyload-any v0.1.3
 * https://github.com/emn178/jquery-lazyload-any
 *
 * Copyright 2014, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function($, window, document, undefined) {

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1), 
          fToBind = this, 
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                                   ? this
                                   : oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }

  var Lazyloader = function(element, options) {
    options = options || {};
    options.threshold = options.threshold || 0;
    options.trigger = options.trigger || 'appear';
    this.trigger = options.trigger.split(' ');
    if(options.threshold < 0)
      options.threshold = 0;
    this.options = options;
    this.element = $(element);
    for(var i = 0;i < this.trigger.length;++i)
      this.bind(this.trigger[i]);
  };

  Lazyloader.prototype.bind = function(eventName) {
    if(eventName == 'appear')
    {
      if(!this.testBinding)
        this.testBinding = this.test.bind(this);
      $(window).bind('resize', this.testBinding);
      $(window).bind('scroll', this.testBinding);
      this.test();
    }
    else
    {
      if(!this.showBinding)
        this.showBinding = this.show.bind(this);
      this.element.bind(eventName, this.showBinding);
    }
  };

  Lazyloader.prototype.unbind = function(eventName) {
    if(eventName == 'appear')
    {
      $(window).unbind('resize', this.testBinding);
      $(window).unbind('scroll', this.testBinding);
    }
    else
      this.element.unbind(eventName, this.showBinding);
  };

  Lazyloader.prototype.test = function() {
    if(!this.satisfied())
      return;
    this.show();
  };

  Lazyloader.prototype.satisfied = function() {
    var rect = this.element[0].getBoundingClientRect();
    var x1 = y1 = -this.options.threshold;
    var y2 = screenHeight - y1;
    var x2 = screenWidth - x1;
    return (rect.top >= y1 && rect.top <= y2 || rect.bottom >= y1 && rect.bottom <= y2) &&
      (rect.left >= x1 && rect.left <= x2 || rect.right >= x1 && rect.right <= x2);
  };

  Lazyloader.prototype.show = function() {
    for(var i = 0, trigger = this.options.trigger;i < trigger.length;++i)
      this.unbind(trigger[i]);
    var comment = this.element.contents().filter(function() {
      return this.nodeType === 8;
    }).get(0);
    var element = $(comment && comment.data);
    this.element.replaceWith(element);

    if($.isFunction(this.options.load))
      this.options.load.call(element, element);
  };

  $.fn.lazyload = function(options) {
    var opts = {};
    $.extend(opts, options);
    this.each(function() {
      new Lazyloader(this, opts);
    });
  };

  var screenHeight, screenWidth;
  function resize()
  {
    screenHeight = window.innerHeight || document.documentElement.clientHeight;
    screenWidth = window.innerWidth || document.documentElement.clientWidth;
  }
  resize();

  $(document).ready(function() {
    $(window).bind('resize', resize);
  });
})(jQuery, window, document);
