class RealTime {
    socket;
    user;
    otherUserInfo = { socketId: '' };
    supportQueueObj = { };

    constructor ( user ) {
        this.user = user;
        return this;
    }

    get_id ( ) {
        return this.socket.id;
    }

    async start ( url = 'http://localhost:3305', userType = 'admin' ) {
        const socket    = await io( url );
        this.user.type  = userType;

        socket.emit( 'setSocket', { type: this.user.type, id: this.user.id, name: this.user.name } );

        socket.on( 'message', ( message ) => {
            console.log( message )
            const newMessage = new Men( message );
            newMessage.show();
        } )
        socket.on( 'messageLoad', ( messages ) => {
            console.log( messages )
            messages.forEach( ( message ) => {
                const newMessage = new Men( message );
                newMessage.show();
            } )
        } )
        socket.on( 'repportError', ( error ) => {
            console.log( error );
        } )
        socket.on( 'supportDisconnect', ( info ) => {
            if ( info.otherUserInfo.socketId === this.otherUserInfo.socketId ) this.otherUserInfo = { };
            chat.innerHTML = '';
        } )
        if ( userType == 'admin' ){
            socket.on( 'supportRequest', ( request ) => {
                console.log( request );
            } )
            socket.on( 'supportQueue', ( queue ) => {
                try {
                    supportQueueList;
                }
                catch {
                    return;
                }
                supportQueueList.innerHTML = '';
                queue.forEach( element => {
                    this.supportQueueObj[ element.userId ] = element;
                    const li = document.createElement( 'li' );
                    li.className = 'queue-user';
                    li.innerText = `${element.userId}: ${element.name}`;
                    li.dataset.id     = element.userId;
                    li.dataset.socket = element.socketId;
                    li.onmousedown = ( event ) => {
                        const position  = { top: event.clientY, left: event.clientX };
                        const user      = { id: event.target.dataset.id, socket: event.target.dataset.socket, name: element.name };
                        queueMenu.show( position, user );
                    }
                    supportQueueList.appendChild( li );
                });
            } )
        } else {
            socket.on( 'supportConnect', ( info ) => {
                console.log( info )
                if ( info.user.socketId == this.socket.id )
                    this.otherUserInfo = { socketId: info.support.socketId, userId: info.support.supportId, name: info.support.name };
            } )
        }

        this.socket = socket;
        this.supportQueue( );
    }

    supportRequest ( ) {
        if ( this.user.type == 'user' ) this.socket.emit( 'supportRequest' );
    }

    supportQueue ( ) {
        if ( this.user.type == 'admin' ) this.socket.emit( 'supportQueue' );
    }

    supportConnect ( userInfo ) {
        this.otherUserInfo = userInfo;
        if ( this.user.type == 'admin' ) this.socket.emit( 'supportConnect', userInfo )
    }

    supportDisconnect ( ) {
        console.log( this.otherUserInfo )
        this.socket.emit( 'supportDisconnect', { otherUserInfo: this.otherUserInfo, userInfo: { userId: this.user.id, socketId: this.socket.id } } )
        console.log( { otherUserInfo: this.otherUserInfo, userInfo: this.user } )
        this.otherUserInfo = { };
        chat.innerHTML = '';
    }

    message ( message ) {
        const messageObj = message.extractInfo();
        this.socket.emit( 'message', { message: messageObj, otherSocketId: this.otherUserInfo.socketId } );
    }
}