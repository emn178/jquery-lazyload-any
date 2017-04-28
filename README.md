# jQuery-lazyload-any
A jQuery plugin provides a lazyload function for images, iframe or anything.  
[![NPM](https://nodei.co/npm/jquery-lazyload-any.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/jquery-lazyload-any)

## Demo
[Images](http://emn178.github.io/jquery-lazyload-any/samples/images/) ([Overflow and Tabs](http://emn178.github.io/jquery-lazyload-any/samples/overflow/))  
[Youtube](http://emn178.github.io/jquery-lazyload-any/samples/youtube/)

## Download
[Compress](https://raw.github.com/emn178/jquery-lazyload-any/master/build/jquery.lazyload-any.min.js)  
[Uncompress](https://raw.github.com/emn178/jquery-lazyload-any/master/src/jquery.lazyload-any.js)

## Installation
You can install jquery-lazyload-any by using Bower.

    bower install jquery-lazyload-any

For node.js, you can use this command to install:

    npm install jquery-lazyload-any

## Usage
HTML  
*Attribute Style*
```HTML
<div id="you-want-lazyload" data-lazyload="&lt;p&gt;Anything you want to lazyload&lt;/p&gt;">
</div>
```
*Script Style*
```HTML
<div id="you-want-lazyload">
  <script type="text/lazyload">
    <p>Anything you want to lazyload</p>
  </script>
</div>
```
*Comment Style*
```HTML
<div id="you-want-lazyload">
  <!--
    <p>Anything you want to lazyload</p>
  -->
</div>
```
JavaScript
```JavaScript
$('#you-want-lazyload').lazyload(options);
```
You should choose only one style. When multiple styles set, priority is Attribute > Script > Comment.

### Options
#### *threshold: `Number` (default: `0`)*

Sets the pixels to load earlier. Setting threshold to 200 causes image to load 200 pixels before it appears on viewport. It should be greater or equal zero.

#### *load: `Function(element)` (default: `undefined`)*

Sets the callback function when the load event is firing.

`element`: The content in lazyload tag will be returned as a jQuery object.

#### *trigger: `String` (default: `"appear"`)*

Sets events to trigger lazyload. Default is customized event `appear`, it will trigger when element appear in screen. You could set other events including each one separated by a space, ex: `mousedown touchstart`.

### Methods

#### $.lazyload.check()

Force to trigger detection event.

#### $.lazyload.setInterval(inverval)

Set interval of timer that check container display status.

##### *inverval: `Number` (default: `50`)*

Interval of timer. Set 0 to disable timer, and you can use `$.lazyload.check()` to trigger detection manually.

#### $.lazyload.refresh(selector)

Refresh status of elements bound event. Element will bind scroll event to parent scrollable automatically when initializing as lazyload. If you move element, you should use this method to bind again.

##### *selector: `String` or `Object` (default: `undefined`)*

The elements that you want to refresh. It will refresh all lazyload elements if you don't pass this parameter.

### Notice
* You should initialize after the element add to page. Or it can't detect whether it's in screen. If you do that, you still can use `$.lazyload.check()` to force detection.
* Detection uses jQuery `element.is(':visible')`, it will return false if element's width and height are equal to zero. So you have to make sure the lazyload element with any width or height.

## Example
HTML
```HTML
<div class="lazyload">
  <!--
    <img src="image.png" />
  -->
</div>
```
JavaScript
```JavaScript
$('.lazyload').lazyload({
  // Sets the pixels to load earlier. Setting threshold to 200 causes image to load 200 pixels
  // before it appears on viewport. It should be greater or equal zero.
  threshold: 200,

  // Sets the callback function when the load event is firing.
  // element: The content in lazyload tag will be returned as a jQuery object.
  load: function(element) {},

  // Sets events to trigger lazyload. Default is customized event `appear`, it will trigger when
  // element appear in screen. You could set other events including each one separated by a space.
  trigger: "appear"
});
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/jquery-lazyload-any  
Author: Yi-Cyuan Chen (emn178@gmail.com)
