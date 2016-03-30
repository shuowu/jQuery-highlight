(function($) {
  var settings = null;
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

  var overlayEl = null;
  var svgEl = null;
  var pathEl = null;
  var isDisplayed = false;

  var init = function(options) {
    if (overlayEl) {
      return;
    }

    settings = $.extend(_default, options);

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
      'width': '100%',
      'height': '100%',
      'top': '0',
      'left': '0',
      'pointer-events': 'none'
    });
    svgEl = overlayEl.find('svg');
    svgEl.css({
      'width': '100%',
      'height': '100%',
      'opacity': settings.opacity
    });
    pathEl = svgEl.find('path');
    pathEl.css({
      'fill': settings.color
    });
  };

  var resize = function(els) {
    if (!els || !els.length) {
      return;
    }

    // Init full screen overlay
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var path = 'M0,0 l' + windowWidth + ',0 l0,' + windowHeight + ' l-' + windowWidth + ',0 l0,' + windowHeight;

    // Highlight each target
    els.each(function() {
      var offset = $(this).offset();
      var top = offset.top;
      var left = offset.left;
      var bottom = top + $(this).outerHeight();
      var right = left + $(this).outerWidth();

      path += ' M' + left + ' ' + top +
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
      $(document).on('click.highlight', function(event) {
        if(!$(event.target).closest(els).length && !$(event.target).is(els)) {
          fadeOut();
        }
      });

      // Handle overlay for window resize
      $(window).on('resize.highlight', function() {
        resize(els, pathEl);
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
    $(document).off('click.highlight');
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
    if (!settings['id']) {
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
