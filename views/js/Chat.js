class Chat {
    constructor (  ) {
        $(document).ready( ( ) => {
            $( 'input' ).keydown(function (e) { 
                if ( e.keyCode === 13 ) chatHandler.post( );
            });
        } );

        ipcRenderer.on( 'getChatInfo', ( event, user ) => {
            if ( user === undefined ) {
                console.log( 'user undefined' );
                return;
            }
            realTime.supportConnect( { userId: user.id, socketId: user.socket, name: user.name } );
        } )

        return this;
    }
    
    post ( ) {
        const idAdmin = ( realTime.user.type === 'admin' ) ? realTime.user.id : realTime.otherUserInfo.userId;
        const idUser  = ( realTime.user.type === 'admin' ) ? realTime.otherUserInfo.userId : realTime.user.id;
        const message = new Men( { 
            idAdmin: idAdmin, 
            idUser: idUser, 
            datetime: undefined,
            sender: realTime.user.type, 
            type: 'text', 
            text: input.value, 
            image: undefined,
            token: admin.token
        } )
        input.value = '';
        if ( message.type === 'text' && ( message.text.trim() === '' || message.text === undefined ) ) return;
        message.show();
        realTime.message( message );
    }
    getUserInfo ( ) {
        ipcRenderer.send( 'getChatInfo' );
    }
}