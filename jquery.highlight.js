(function ($) {
  var _default = {
    id: 'highlight-overlay',
    className: 'highlight-overlay',
    color: '#262626',
    opacity: 0.5,
    zIndex: 1000,
    fadeInDuration: 400,
    fadeOutDuration: 400,
    onStartCallback: null,
    onDismissCallback: null,
    svgPathStyle: 'rect',
    svgPathFunction: null,
    radius: 5
  };
  var settings = _default;

  var overlayEl = null;
  var svgEl = null;
  var pathEl = null;
  var isDisplayed = false;

  var svgRectPath = function(top, left, bottom, right) {
    return ' M' + left + ',' + top +
        ' L' + left + ',' + bottom +
        ' L' + right + ',' + bottom +
        ' L' + right + ',' + top +
        ' L' + left + ',' + top;
  };

  var svgCirclePath = function(top, left, bottom, right) {
    // http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
    var r = Math.max(right - left, bottom - top) / 2;
    var cx = left + (right - left)/2;
    var cy = top + (bottom - top) / 2;
    return ' M ' + cx + ' ' + cy +
      ' m -' + r + ', 0 ' +
      ' a ' + r + ',' + r + ' 0 1,0  ' + (r * 2) + ',0' +
      ' a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0';
  }

  var generateSvgRadiusPath = function(radius) {
    return function(top, left, bottom, right) {
      // http://stackoverflow.com/a/38118843/1132150
      var r = radius;
      return ' M' + left + ',' + (top + r) +
          ' L' + left + ',' + (bottom - r) +
          ' A' + r + ',' + r + ' 0 0,0 ' + (left + r) + ',' + bottom +
          ' L' + (right - r) + ',' + bottom +
          ' A' + r + ',' + r + ' 0 0,0 ' + right + ',' + (bottom - r) +
          ' L' + right + ',' + (top + r) +
          ' A' + r + ',' + r + ' 0 0,0 ' + (right - r) + ',' + top +
          ' L' + (left + r) + ',' + top +
          ' A' + r + ',' + r + ' 0 0,0 ' + left + ',' + (top + r);
    };
  }

  // Returns the path funciton to be used arround the highlighted elements
  //
  // @return [function(top, left, bottom, right)]
  var getPathFunc = function () {
    if (settings.svgPathFunction) {
      return settings.svgPathFunction;
    } else {
      if (settings.svgPathStyle === 'circle') {
        return svgCirclePath;
      } else if (settings.svgPathStyle === 'radius') {
        return generateSvgRadiusPath(settings.radius);
      } else {
        return svgRectPath;
      }
    }
  }

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
      'position': 'fixed',
      'overflow': 'hidden',
      'max-height': '100%',
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

  // Calculates the current viewport
  //
  // @return [Oobject] current viewport properties
  var getViewPort = function () {
    var top = window.scrollY ||
              window.pageYOffset ||
              document.documentElement.scrollTop;
    var left = window.scrollX ||
               window.pageXOffset ||
               document.documentElement.scrollLeft;
    var bottom = top + (
                   window.innerHeight ||
                   document.documentElement.clientHeight
                 );
    var right = left + (
                  window.innerWidth ||
                  document.documentElement.clientWidth
                );
    return {
      top: top,
      left: left,
      bottom: bottom,
      right: right,
      height: bottom - top,
      width: right - left
    }
  }

  // Calculates the given element offset
  //
  // @return [Object] current viewport properties
  var getElementOffset = function (element) {
    var viewport = getViewPort()
    var offset = $(element).offset();
    var top = offset.top - viewport.top;
    var left = offset.left - viewport.left;
    var bottom = top + $(element).outerHeight();
    var right = left + $(element).outerWidth();
    if (top < 0) { top = 0; }
    if (left < 0) { top = 0; }
    if (right < 0) { top = 0; }
    if (bottom < 0) { top = 0; }
    return {
      top: top,
      left: left,
      bottom: bottom,
      right: right,
      height: bottom - top,
      width: right - left
    }
  }

  var isElementInViewport = function (element) {
    // Calculate viewport offset
    var viewport = getViewPort()
    var offset = $(element).offset();
    var top = offset.top;
    var left = offset.left;
    var bottom = top + $(element).outerHeight();
    var right = left + $(element).outerWidth();
    return (
      (
        ((top > viewport.top) && (top < viewport.bottom)) ||
        ((bottom < viewport.bottom) && (bottom > viewport.top))
      ) &&
      (
        ((left > viewport.left) && (left < viewport.right)) ||
        ((right > viewport.left) && (right < viewport.right))
      )
    )
  }

  var isElementInPage = function (element) {
    // Calculate viewport offset
    var offset = $(element).offset();
    var top = offset.top;
    var left = offset.left;
    var bottom = top + $(element).outerHeight();
    var right = left + $(element).outerWidth();
    return (
      ((top > 0) || (bottom > 0)) &&
      ((left > 0) || (right > 0))
    )
  }

  var isElementVisible = function (el) {
    el = $(el);
    if (el.css('display') === 'none') { return false };
    if (el.css('visibility') === 'hidden') { return false };
    return true;
  }

  var isElementHighLingtable = function (el) {
    return isElementVisible(el) && isElementInViewport(el);
  }

  var isScrollable = function(el){
    return isElementVisible(el) && isElementInPage(el);
  }

  var resize = function(els) {
    if (!els || !els.length) {
      return;
    }

    // Check if first element in viewport
    // If not scrollIntoView
    var firstElement = els.filter(function(index, element) {
      return isScrollable(element);
    }).first()
    if (firstElement && !isElementInViewport(firstElement)) {
      firstElement.scrollIntoView();
    }

    // Calculate viewport offset
    var viewport = getViewPort();

    // Build viewport path
    svgEl.css({
      'width': viewport.right + 'px',
      'height': viewport.bottom + 'px',
      'opacity': settings.opacity,
      'overflow': 'hidden'
    });

    // Paint the main form wrapper
    var path = 'M' + 0 + ',' + 0 +
        ' L' + viewport.width + ',' + 0 +
        ' L' + viewport.width + ',' + viewport.height +
        ' L' + 0 + ',' + viewport.height +
        ' L' + 0 + ',' + 0;

    // Retrieve path function
    var pathFunc = getPathFunc()

    // Highlight each target
    els.each(function() {
      if (!isElementHighLingtable(this)) { return; }
      var itemOffset = getElementOffset(this);
      path += pathFunc(itemOffset.top, itemOffset.left, itemOffset.bottom, itemOffset.right);
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
