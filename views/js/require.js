const { ipcRenderer } = require( 'electron' );

const APIurl = 'https://pinus-api.herokuapp.com';
//const APIurl = 'http://localhost:3305';

const admin = new Admin( );
let realTime;

ipcRenderer.on( 'get_admin', ( event, adminInfo ) => {
    admin.set_admin( adminInfo );
} );
ipcRenderer.on( 'get_token', ( event, token ) => {
    admin.set_token( token );
} );

function errorAlert( title, message ) {
    if ( MaterialDialog ) MaterialDialog.alert(
        `${message}
        <br><br>
        <p style="font-size: 0.7rem">Para mais informações: F3`,
        {
            title,
            buttons:{ 
                close:{
                    text:'Fechar',
                    className:'btn-flat flat-peach',
                }
            }
        }
    );
}