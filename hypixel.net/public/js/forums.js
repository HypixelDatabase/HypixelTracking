! function($, window, document, _undefined) {
  XenForo.PlatformSelector = function($wrapper) {
    var active = $wrapper.find('a.active').hasClass('pc') ? 'pc' : 'pe';
    var cookie = $.getCookie('hypixel_forum_platform');
    if (cookie && cookie != active) {
      active = cookie;
      if (cookie == 'pc') {
        $('.category-platform-pe').hide();
        $('.category-platform-pc').show();
        $wrapper.find('a.pe').removeClass('active');
        $wrapper.find('a.pc').addClass('active');
      } else {
        $('.category-platform-pc').hide();
        $('.category-platform-pe').show();
        $wrapper.find('a.pc').removeClass('active');
        $wrapper.find('a.pe').addClass('active');
      }
    }
    $wrapper.find('a').bind('click', function(event) {
      event.preventDefault();
      var $button = $(this);
      var platform = 'pc';
      if ($button.hasClass('pe')) {
        platform = 'pe';
      }
      if (platform != active) {
        $('.category-platform-' + active).hide();
        $('.category-platform-' + platform).show();
        active = platform;
        $.setCookie('hypixel_forum_platform', platform);
        $wrapper.find('a.active').removeClass('active');
        $button.addClass('active');
      }
    });
  };
  XenForo.register('.forum-platform-selection', 'XenForo.PlatformSelector');
}(jQuery, this, document);