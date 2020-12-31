const createWindow    = require( './app/createWindow' );
const WINDOWconfig    = require( './config/WINDOW.json' );
const handyIcon_white = `${__dirname}/img/icon/branco-medio.ico`;
const handyIcon_black = `${__dirname}/img/icon/favicon.ico`;

class Bridge {
    windows = { }
    admin;
    token;
    chatOpenningUser;
    chatCount;

    constructor ( ipc ) {
        this.ipc = ipc;

        this.ipc.on( 'set_admin', ( event, admin ) => {
            this.admin = admin;
            this.reply( event, 'get_admin', this.admin );
        } )
        this.ipc.on( 'get_admin', ( event ) => {
            this.reply( event, 'get_admin', this.admin );
        } );
        this.ipc.on( 'login', ( event, token ) => {
            this.token = token;
            const mainWindow = createWindow( );
            mainWindow.setIcon( handyIcon_white );
            this.set_window( 'main', mainWindow );
            this.windows.login.close();
        } );
        this.ipc.on( 'get_token', ( event ) => {
            this.reply( event, 'get_token', this.token );
        } );
        this.ipc.on( 'newChat', ( event, user ) => {
            const isOpenning = setInterval( ( ) => {
                if ( this.chatOpenningUser === undefined ) {
                    this.chatOpenningUser = user;
                    const chat = createWindow( 'chat', WINDOWconfig.chat );
                    chat.setIcon( handyIcon_white );
                    this.set_window( 'chat'+this.chatCount, chat );
                    this.chatCount++;
                    clearInterval( isOpenning );
                }
            }, 500 );
        } )
        this.ipc.on( 'getChatInfo', ( event ) => {
            this.ipc.reply( event, 'getChatInfo', this.chatOpenningUser );
            this.chatOpenningUser = undefined;
        } )

        return this;
    }
    emit ( window, channel, payload ) {
        this.windows[ window ].webContents.send( channel, payload );
    }
    reply ( event, channel, payload ) {
        event.reply( channel, payload );
    }
    set_window ( name, window ) {
        this.windows[ name ] = window;
    }
}

module.exports = Bridge