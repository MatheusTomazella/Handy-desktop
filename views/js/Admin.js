class Admin {
    constructor ( ) {
        return this;
    }
    login ( email, password ) {
        return new Promise ( ( resolve, reject ) => {
            $.ajax({
                type: "POST",
                url: `${APIurl}/login`,
                data: {
                    email: email,
                    password: password,
                    type: 'admin'
                },
                success: ( response ) => {
                    this.admin = response.user;
                    this.token = response.token;
                    resolve( { admin: response.user, token: response.token } );
                },
                error: ( error ) => {
                    if ( error ) reject( error );
                }
            });
        } )
    }
    fetch ( ) {
        ipcRenderer.send( 'get_admin' )
    }
    save ( ) {
        ipcRenderer.send( 'set_admin', this.admin );
    }
    set_admin ( admin ) {
        this.admin = admin;
        this.updateUserCredential( );
    }
    get_token ( ) {
        ipcRenderer.send( 'get_token' );
    }
    set_token ( token ) {
        this.token = token;
    }
    updateUserCredential ( ) {
        const keys      = Object.keys( this.admin );
        const values    = Object.values( this.admin );
        for ( let i in keys ) {
            const element = document.getElementById( `admin-info-${keys[i]}` );
            if ( element ) element.innerText = values[i];
        }
    }
}