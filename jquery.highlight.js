(function($) {
  var _default = {
    id: 'highlight-overlay',
    className: 'highlight-overlay',
    color: '#262626',
    opacity: 0.5,
    zIndex: 1000,
    fadeInDuration: 400,
    fadeOutDuration: 400,
    onStartCallback: null,
    onDismissCallback: null
  };
  var settings = _default;

  var overlayEl = null;
  var svgEl = null;
  var pathEl = null;
  var isDisplayed = false;

  var init = function(options) {
    if (overlayEl) {
      return;
    }

    if (options) {
      settings = $.extend(_default, options);
    }

    // Append overlay to document
    var template = '<div id="' + settings['id'] + '" class="' + settings['className'] +
        '"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path></path></svg></div>';
    $('body').append(template);

    // Implement css on overlay
    overlayEl = $('.' + settings.className);
    overlayEl.css({
      'display': 'none',
      'position': 'absolute',
      'z-index': settings.zIndex,
      'top': 0,
      'left': 0,
      'pointer-events': 'none'
    });
    svgEl = overlayEl.find('svg');
    pathEl = svgEl.find('path');
    pathEl.css({
      'fill': settings.color
    });
  };

  var resize = function(els) {
    if (!els || !els.length) {
      return;
    }

    // Calculate viewport offset
    var wTop = window.scrollY;
    var wLeft = window.scrollX;
    var wBottom = wTop + window.innerHeight;
    var wRight = wLeft + window.innerWidth;

    // Check if first element in viewport
    // If not scrollIntoView
    var firstEl = els[0];
    var offset = $(firstEl).offset();
    var top = offset.top;
    var left = offset.left;
    var bottom = top + $(firstEl).outerHeight();
    var right = left + $(firstEl).outerWidth();
    if(top < wTop || left < wLeft || bottom > wBottom || right > wRight) {
      firstEl.scrollIntoView();
    }

    // Build viewport path
    wTop = window.scrollY;
    wLeft = window.scrollX;
    wBottom = wTop + window.innerHeight;
    wRight = wLeft + window.innerWidth;
    svgEl.css({
      'width': wRight + 'px',
      'height': wBottom + 'px',
      'opacity': settings.opacity
    });
    var path = 'M' + wLeft + ',' + wTop +
        ' L' + wRight + ',' + wTop +
        ' L' + wRight + ',' + wBottom +
        ' L' + wLeft + ',' + wBottom +
        ' L' + wLeft + ',' + wTop;

    // Highlight each target
    els.each(function() {
      offset = $(this).offset();
      top = offset.top;
      left = offset.left;
      bottom = top + $(this).outerHeight();
      right = left + $(this).outerWidth();
      path += ' M' + left + ',' + top +
          ' L' + left + ',' + bottom +
          ' L' + right + ',' + bottom +
          ' L' + right + ',' + top +
          ' L' + left + ',' + top;
    });

    pathEl.attr('d', path);
  };

  var fadeIn = function(els, opt_callback) {
    if (!overlayEl || isDisplayed || !els) {
      return;
    }

    overlayEl.fadeIn(settings['fadeInDuration'], function() {
      isDisplayed = true;

      // Handle click event outside target element
      $(document).on('click.highlight touchstart.highlight', function(event) {
        if(!$(event.target).closest(els).length && !$(event.target).is(els)) {
          fadeOut();
        }
      });

      // Handle overlay for window resize
      $(window).on('resize.highlight', function() {
        resize(els);
      });

      if (opt_callback) {
        opt_callback();
      }

      if (settings['onStartCallback']) {
        settings['onStartCallback']();
      }
    });
  };

  var fadeOut = function(opt_callback) {
    if (!overlayEl || !isDisplayed) {
      return;
    }

    overlayEl.fadeOut(settings['fadeOutDuration'], function() {
      isDisplayed = false;
      unbindEvents();

      if (opt_callback) {
        opt_callback();
      }

      if (settings['onDismissCallback']) {
        settings['onDismissCallback']();
      }
    });
  };

  var unbindEvents = function() {
    $(document).off('click.highlight touchstart.highlight');
    $(window).off('resize.highlight');
  };

  $.fn.highlightOverlay = function(options) {
    var this_ = this;
    init(options);

    if (isDisplayed) {
      fadeOut(function() {
        resize(this_);
        fadeIn(this_);
      });
      return;
    }

    resize(this);
    fadeIn(this);
  };

  $.dismissHighlightOverlay = function(opt_callback) {
    fadeOut(opt_callback);
  };

  $.destroyHighlightOverlay = function() {
    if (!settings || !settings['id']) {
      return;
    }

    $('#' + settings['id']).remove();

    // Restore states
    overlayEl = null;
    svgEl = null;
    pathEl = null;
    isDisplayed = false;
    settings = _default;

    unbindEvents();
  };
}(jQuery));
