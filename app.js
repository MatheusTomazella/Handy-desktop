const electron      = require( 'electron' );
const app           = electron.app;
const ipcMain       = electron.ipcMain;
const createWindow  = require( './app/createWindow' );
const Bridge        = require( './Bridge' );

const handyIcon_white = `${__dirname}/img/icon/branco-medio.ico`;
const handyIcon_black = `${__dirname}/img/icon/favicon.ico`;
const WINDOWconfig    = require( './config/WINDOW.json' );

app.on( 'window-all-closed', ( ) => {
    app.quit( );
} )

app.whenReady( )
.then( ( ) => {
    const bridge = new Bridge( ipcMain );

    const loginWindow = createWindow( 'login', WINDOWconfig.login );
    loginWindow.setIcon( handyIcon_white );
    bridge.set_window( 'login', loginWindow );

    electron.globalShortcut.register( 'f3', ( ) => {
        Object.values( bridge.windows ).forEach( window => {
            try { 
                window.webContents.openDevTools( );
            }
            catch { }
        } )
    } )

    electron.globalShortcut.register( 'f5', ( ) => {
        Object.values( bridge.windows ).forEach( window => {
            try { 
                window.reload( );
            }
            catch { }
        } )
    } )
} )