! function($, window, document, _undefined) {
  XenForo.ShowLinkAccountHint = function($a) {
    $a.tooltipster({
      content: $('<span style="color:#dadada;">Type <b style="color: #ffffff;">/linkaccount</b> in-game and open the<br />link it gives you to verify your account!</span>'),
      trigger: 'click',
      delay: 0,
      animation: 'grow',
      speed: 200
    });
  };
  XenForo.PlayerCount = function($e) {
    this.__construct($e);
  };
  XenForo.PlayerCount.prototype = {
    __construct: function($e) {
      this.element = $e;
    },
    update: function() {
      $.ajax({
        dataType: 'json',
        url: 'https://api.hypixel.net/playerCount',
        global: false,
        success: $.context(function(data) {
          if (data && data.count) {
            this.element.html(data.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
          }
        }, this)
      });
    }
  };
  XenForo.ShowQuickSearch = function($input) {
    $input.bind('mouseenter', function() {
      if ($(window).width() < 500) {
        return;
      }
      $input.find('#QuickSearchQuery').addClass('visible');
      $('.navTabs .navTabSearch').addClass('isHover');
    }).bind('mouseleave', function() {
      if ($input.find('#QuickSearchQuery').is(":focus")) {
        return;
      }
      $input.find('#QuickSearchQuery').removeClass('visible');
      $('#QuickSearch').removeClass('show');
      $('#QuickSearchPlaceholder').removeClass('hide');
      $('.navTabs .navTabSearch').removeClass('isHover');
      $('#QuickSearch').find('.secondaryControls').slideUp(0, function() {
        $('#QuickSearch').removeClass('active');
        if ($.browser.msie) {
          $('body').css('zoom', 1);
          setTimeout(function() {
            $('body').css('zoom', '');
          }, 100);
        }
      });
    }).bind('click', function(event) {
      if ($(window).width() < 500) {
        event.stopPropagation();
        $('#QuickSearch .formPopup').remove();
        window.location = '/search';
      }
    });
    $('body').on('click', function(event) {
      if (!$(event.target).closest($input).length) {
        $input.find('#QuickSearchQuery').removeClass('visible');
        $('#QuickSearch').removeClass('show');
        $('#QuickSearchPlaceholder').removeClass('hide');
        $('.navTabs .navTabSearch').removeClass('isHover');
        $('#QuickSearch').find('.secondaryControls').slideUp(0, function() {
          $('#QuickSearch').removeClass('active');
          if ($.browser.msie) {
            $('body').css('zoom', 1);
            setTimeout(function() {
              $('body').css('zoom', '');
            }, 100);
          }
        });
      }
    });
  };
  XenForo.GeneralCopyIP = function($e) {
    var client = new Clipboard($e.get(0));
    var copied = false;
    var oldValue = $e.parent().find('.ipCopyInfo').html();
    client.on('success', function(event) {
      if (copied) {
        return;
      }
      copied = true;
      $e.parent().find('.ipCopyInfo').html('Copied to Clipboard!');
      setTimeout(function() {
        copied = false;
        $e.parent().find('.ipCopyInfo').html(oldValue);
      }, 3000);
    });
    $e.on('mouseenter', function(event) {
      $e.parent().find('.ipCopyInfo').addClass('display');
      $e.parent().find('.ip').addClass('isHover');
    }).on('mouseleave', function(event) {
      $e.parent().find('.ipCopyInfo').removeClass('display');
      $e.parent().find('.ip').removeClass('isHover');
    });
    var hoverImg = new Image();
    hoverImg.src = '/styles/hypixel-uix/hypixel/play-button-hover.png';
  };
  XenForo.preloadImages = function(images) {
    for (var i = 0; i < images.length; ++i) {
      var img = new Image();
      img.src = images[i];
    }
  };
  XenForo.HeaderFix = function($e) {
    function fixit() {
      var height = $('#logoBlock').height() + $('#userBar').height() + 55;
      $e.attr('style', 'height: ' + ($('#headerFix').height() - height) + 'px;margin-top:' + height + 'px !important;');
    }
    fixit();
    setTimeout(fixit, 1);
    $(window).on('resize', fixit);
  };
  XenForo.SearchButtonFix = function($button) {
    $button.click(function(e) {
      $("#QuickSearch form").submit();
    });
  };
  XenForo.tooltips = function($element) {
    $element.tooltipster();
  };
  XenForo.register('#playerCount', 'XenForo.PlayerCount');
  XenForo.register('#showLinkAccountHint', 'XenForo.ShowLinkAccountHint');
  XenForo.register('.copyIp', 'XenForo.GeneralCopyIP');
  XenForo.register('#headerStripe', 'XenForo.HeaderFix');
  XenForo.register('#QuickSearch .uix_icon-search', 'XenForo.SearchButtonFix');
  XenForo.register('.tooltip', 'XenForo.tooltips');
  setTimeout(function() {
    if (window.console && window.console.info) {
      console.info('%c Looking for a job? We are always looking for talented people! Check out https://hypixel.net/jobs ', 'font-weight: bold;background: #EDCF0C;');
    }
  }, 1000);
}(jQuery, this, document);