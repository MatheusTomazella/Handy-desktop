class UserQueueMenu {
    constructor ( elementId ) {
        this.elementId = `#${elementId}`;
        this.element = $( this.elementId );
        return this;
    }
    show ( position, user ) {
        this.element.css( {
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