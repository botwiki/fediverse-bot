(function($) {
  'use strict';

  $('[data-confirm]').click(function(ev){
    // ev.preventDefault();
    var confirmActionText = $(this).data('confirm');

    return confirm(confirmActionText);
  });

  $( '.post-date' ).each( function(){
    let $date = $( this );
    const date = $date.attr( 'title' );
    $date.attr( 'title', moment( moment.utc( date ).toDate() ).local().format( 'YYYY-MM-DD HH:mm:ss' ) );
  } );
  
  $( '.post-date-formatted' ).each( function(){
    let $date = $( this );
    const date = $date.html();
    $date.html( moment( moment.utc( date ).toDate() ).local().format( 'YYYY-MM-DD HH:mm:ss' ) );
  } );
  
})(jQuery);
