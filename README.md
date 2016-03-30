# jQuery-highlight-overlay
A jQuery plugin to highlight multiple targets by providing a svg overlay
User can still interact with highlighted elements when overlay showing up
Click on overlay will fade overlay out

Check out example in ./example folder

Demo: http://shuowu.github.io/jQuery-highlight/

## Build
Command `npm run build` will generate both original and minified files in ./dist folder

## Using the plugin
- Make sure you have jQuery in your site
- Add the `./dist/jquery.highlight.min.js` file to your site.
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
    onDismissCallback: null
  };
```

