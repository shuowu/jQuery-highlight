# jQuery-highlight-overlay
jQuery highlight is a jQuery based plugin to provide highlight overlay for complex website and web apps. 
It can highlight multiple targets by providing a svg overlay. 
At same time, user can still interact with highlighted elements when overlay showing up. 
User can dismiss highlight overlay by clicking on non-highlighted area.

Check out example in ./example folder

Demo: http://shuowu.github.io/jQuery-highlight/

## Build
Command `npm run build` will generate both original and minified files in ./dist folder

## Using the plugin
- Make sure you have jQuery in your site
- Add the `jquery.highlight.min.js` file to your site.
- Call `$(selector).highlightOverlay()` method on target element you want to highlight.
- You can also pass custom `options` object to customize the highlight overlay.

## Options
```javascript
  var default = {
    id: 'highlight-overlay',
    className: 'highlight-overlay',
    color: '#262626',
    opacity: 0.7,
    zIndex: 1000,
    fadeInDuration: 400,
    fadeOutDuration: 400,
    onStartCallback: null,
    onDismissCallback: null,
    radius: 5, // border radius of the shape in pixels (needs svgPathStyle = radius)
    svgPathStyle: ['circle'|'rect'|'radius'],   // Built-in styles
    svgPathFunction: func // custom svg path generation function. Take 
                          // parameters (top, left, bottom, right) 
  };
```

