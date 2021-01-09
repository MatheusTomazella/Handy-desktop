function openRegister ( type, title ) {
    ipcRenderer.send( 'newRegister', { type, title } );
}

function openManager ( type, route, title, search ) {
    ipcRenderer.send( 'newManager', { type, title, route, search } );
}