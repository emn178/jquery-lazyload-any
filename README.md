# jQuery-lazyload-any
This is a jQuery plugin provides a lazyload function for images, iframe or anything.

## Demo
[Images](http://emn178.github.io/jquery-lazyload-any/demo/images/)

## Browser Support
jQuery-lazyload-any currently supports IE7+, Chrome, Firefox, Safari and Opera.

## Usage
HTML
```HTML
<div id="#you-want-lazyload">
  <!--
    Anything you want to lazyload
  -->
</div>
```
JavaScript
```JavaScript
$('#you-want-lazyload').lazyload(options);
```

### Options
#### *threshold: Number (default: `0`)*

Sets the pixels to load earlier. Setting threshold to 200 causes image to load 200 pixels before it appears on viewport. It should be greater or equal zero.

## Example
HTML
```HTML
<div class=".lazyload">
  <!--
    <img src="image.png" />
  -->
</div>
```
JavaScript
```JavaScript
$('.lazyload').lazyload();
$('.lazyload').lazyload({threshold: 200});
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/jquery-lazyload-any  
Author: emn178@gmail.com
