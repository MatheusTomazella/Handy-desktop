class UserQueueMenu {
    constructor ( elementId, dontCloseList = [ ] ) {
        this.elementId = `#${elementId}`;
        this.element = $( this.elementId );
        $( 'body' ).on( 'mousedown', ( event ) => {
            let shouldClose = true;
            dontCloseList.forEach( className => {
                if ( event.target.className.indexOf( className )        !== -1 
                  || event.target.className.indexOf( 'dont-close-pls' ) !== -1 ) shouldClose = false;
            } )
            if ( shouldClose ) this.hide();
        } )
        return this;
    }
    show ( position, user ) {
        $( this.elementId ).css( {
            display: 'block',
            top: position.top-60,
            left: position.left
        } )
        this.user = user;
    }
    hide ( ) {
        $( this.elementId ).hide( );
    }
    connect ( ) {
        this.hide();
        ipcRenderer.send( 'newChat', this.user );
    }
}