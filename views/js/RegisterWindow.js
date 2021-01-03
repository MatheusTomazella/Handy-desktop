class RegisterWindow {
    name;
    email;
    password;
    password_conf;
    access;
    description;
    component;
    link;
    cost;

    constructor ( args ) {
        this.type = args.type;
        document.getElementById( 'register-title' ).innerText = `Registrar ${args.title}`;

        this.name           = document.getElementById( 'name' );
        this.email          = document.getElementById( 'email' );
        this.password       = document.getElementById( 'password' );
        this.password_conf  = document.getElementById( 'password-conf' );
        this.access         = document.getElementById( 'access' );
        this.description    = document.getElementById( 'description' );
        this.component      = document.getElementById( 'component' );
        this.link           = document.getElementById( 'link' );
        this.cost           = document.getElementById( 'cost' );

        this.clearWindow( );
        const waitingToken = setInterval( ( ) => {
            if ( admin.token ) { 
                this[ `load_${this.type}` ]( );
                clearInterval( waitingToken );
            }
        }, 500 );
        return this;
    }
    registerDefault ( ) {
        this[ `register_${this.type}` ]( );
    }

    load_user ( ) {
        this.show( [ this.name, this.email, this.password, this.password_conf ] );
    }
    load_admin ( ) {
        this.show( [ this.name, this.email, this.password, this.password_conf, this.access ] );
    }
    load_component ( ) {
        this.show( [ this.name, this.description ] );
    }
    load_provider ( ) {
        this.show( [ this.name, this.component, this.cost, this.link ] );
        $.ajax({
            type: "GET",
            url: `${APIurl}/comp?token=${admin.token}`,
            success: ( response ) => {
                response.forEach( component => {
                    const option = document.createElement( 'option' );
                    option.text = component.name;
                    option.value = component.id;
                    this.component.appendChild( option );
                } )
            }
        });
    }

    register_user ( ) {
        if ( this.passwordIsEqual( ) )
            this.registerRequest( 'user', {
                name: this.name.value,
                email: this.email.value,
                password: this.password.value
            } )
    }
    register_admin ( ) {
        if ( this.passwordIsEqual( ) )
            this.registerRequest( 'admin', {
                name: this.name.value,
                email: this.email.value,
                password: this.password.value,
                accessLevel: this.access.value
            } )
    }
    register_component ( ) {
        this.registerRequest( 'comp', {
            name: this.name.value,
            descr: this.description.value
        } )
    }
    register_provider ( ) {
        const idComp = this.component.options[ this.component.selectedIndex ].value;
        this.registerRequest( 'comp/prov', {
            name: this.name.value,
            idComp,
            cost: this.cost.value,
            link: this.link.value
        } )
    }

    clearWindow ( ) {
        const children = document.getElementById( 'register' ).children
        for ( let i = 0; i < children.length; i++ ) {
            children[i].style.display = 'none';
        }
    }
    show ( inputs = [ ] ) {
        inputs.forEach( input => {
            input.style.display = 'block';
        } )
        document.getElementById( 'btn-register' ).style.display = 'block';
    }
    clearInputs ( ) {
        const allInputs = [ this.name, this.email, this.password, this.password_conf, this.access, this.cost, this.link, this.description ];
        allInputs.forEach( input => {
            input.value = '';
        } )
    }
    passwordIsEqual ( ) {
        if ( this.password.value === this.password_conf.value ) return true;
        else { 
            this.password.focus( );
            alert( 'Senhas devem ser iguais.' );
            return false;
        }
    }
    registerRequest ( route, payload ) {
        payload.token = admin.token;
        $.ajax({
            type: "POST",
            url: `${APIurl}/${route}`,
            data: payload,
            success: ( response ) => {
                this.clearInputs( );
            },
            error: ( error ) => {
                console.log( error );
                alert( error.errorCode );
            }
        });
    }
}