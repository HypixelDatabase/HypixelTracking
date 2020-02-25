! function($, window, document, _undefined) {
  $(function() {
    var fixed = false;
    var nav = $('.new-nav');
    var placeholder = $('.new-nav-placeholder');
    var y = nav.offset().top;

    function updateNavigation() {
      var current = $(window).scrollTop();
      if (current >= y && !fixed) {
        nav.css({
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          width: '100%'
        });
        nav.addClass('sticky');
        placeholder.show();
        fixed = true;
      } else if (current < y && fixed) {
        nav.css({
          position: 'static',
          width: 'auto'
        });
        nav.removeClass('sticky');
        placeholder.hide();
        fixed = false;
      }
    }
    $(window).on('scroll', updateNavigation);
    updateNavigation();
  });
}(jQuery, this, document);