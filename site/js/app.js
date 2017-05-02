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

  $.smartbanner({
    title: 'Trucky - Companion app for TruckersMP', // What the title of the app should be in the banner (defaults to <title>)
    price: 'FREE', // Price of the app
    inAppStore: 'On the App Store', // Text of price for iOS
    inGooglePlay: 'In Google Play', // Text of price for Android
    button: 'VIEW', // Text on the install button
  }); 

})(jQuery);