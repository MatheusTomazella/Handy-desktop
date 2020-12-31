const queueMenu = new UserQueueMenu( 'user-queue-menu' );

$( document ).ready( ( ) => {
    $( 'body' ).on( 'mousedown', ( event ) => {
        if ( event.target.className != 'queue-user' && event.target.className != 'dont-close-pls' ) queueMenu.hide();
    } )
} )