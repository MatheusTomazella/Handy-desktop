function loginTrigger ( ) {
    admin.login( document.getElementById( 'pinus-email' ).value, document.getElementById( 'pinus-password' ).value )
    .then( ( result ) => {
        ipcRenderer.send( 'set_admin', result.admin );
        ipcRenderer.send( 'login',     result.token );
    } )
    .catch( ( error ) => {
        console.log(error)
        errorAlert( 'Falha no Login', 'Erro de Autenticação' );
    } )
}