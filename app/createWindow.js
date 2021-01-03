const { BrowserWindow, ipcMain } = require( 'electron' );
const WINDOWconfig = require( '../config/WINDOW.json' );

module.exports = ( view = 'index', config = WINDOWconfig.defaultConfig, windowArguments ) => {
        const window = new BrowserWindow( config );
        window.setMenu( null );
        window.loadFile( `./views/${ view }.html` );
        
        //window.webContents.openDevTools();

        window.once( 'ready-to-show', ( event ) => {
            window.webContents.send( 'windowArguments', windowArguments )
        } )

        return window;
    }
