(function($) {
  "use strict";

  $(document).foundation();

  //Run When Document Ready
  $(document).on('ready', function() {
    initWow();
  });

  //WOW Animation
  //===============================================================================
  function initWow() {
    new WOW().init();
  }

})(jQuery);