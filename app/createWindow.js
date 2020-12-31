const { BrowserWindow, globalShortcut } = require( 'electron' );
const WINDOWconfig = require( '../config/WINDOW.json' );

module.exports = ( view = 'index', config = WINDOWconfig.defaultConfig ) => {
        const window = new BrowserWindow( config );
        window.setMenu( null );
        window.loadFile( `./views/${ view }.html` ); // Cosidera o diretório do arquivo que chama a função (app.js), não onde ela é definida (electron.js)
        
        window.webContents.openDevTools();
        if ( globalShortcut.isRegistered( 'f5' ) ) globalShortcut.unregister( 'f5' )
        globalShortcut.register( 'f5', ( ) => {
            window.reload( );
        } )

        return window;
    }
