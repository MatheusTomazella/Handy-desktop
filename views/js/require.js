const { ipcRenderer } = require( 'electron' );

const APIurl = 'https://pinus-api.herokuapp.com';

const admin = new Admin( );

ipcRenderer.on( 'get_admin', ( event, adminInfo ) => {
    admin.set_admin( adminInfo );
} );
ipcRenderer.on( 'get_token', ( event, token ) => {
    admin.set_token( token );
} );