# jQuery-highlight-overlay
A jQuery plugin to highlight multiple targets by providing a svg overlay
User can still interact with highlighted elements when overlay showing up
Click on overlay will fade overlay out

Check out example in ./example folder

h2. Build
'npm run build' will generate both original and minified files in ./dist folder

h2. Using the plugin
1. Make sure you have jQuery in your site
2. Add the @jquery.highlight.min.js@ file to your site.
3. Call @$(selector).highlightOverlay()@ method on target element you want to highlight.
4. You can also pass custom @option@ object to customize the highlight overlay.

h2. Options
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

