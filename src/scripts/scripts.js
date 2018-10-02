(function($) {
  'use strict';

  $('[data-confirm]').click(function(ev){
    // ev.preventDefault();
    var confirmActionText = $(this).data('confirm');

    return confirm(confirmActionText);
  });

})(jQuery);
