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
        this.isEdit = args.isEdit;
        this.element = args.element;
        this.defaultFunction = ( this.isEdit ) ? 'update' : 'register';
        document.getElementById( 'register-title' ).innerText = `${(this.isEdit) ? 'Editar' : 'Registrar'} ${args.title}`;

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
                this[ `load_${this.type}` ]( this.isEdit );
                clearInterval( waitingToken );
            }
        }, 500 );
        return this;
    }
    default ( ) {
        this[ `${this.defaultFunction}_${this.type}` ]( );
    }

    load_user ( isEdit ) {
        this.show( [ this.name, this.email, this.password, this.password_conf ],
            ( isEdit ) ? {
                name: this.element.name,
                email: this.element.email,
                password: 'Nova Senha'
            } : { } );
    }
    load_admin ( isEdit ) {
        this.show( [ this.name, this.email, this.password, this.password_conf, this.access ],
            ( isEdit ) ? {
                name: this.element.name,
                email: this.element.email,
                access: this.element.accessLevel,
                password: 'Nova Senha'
            } : { } );
    }
    load_component ( isEdit ) {
        this.show( [ this.name, this.description ],
            ( isEdit ) ? {
                name: this.element.name,
                description: this.element.descr
            } : { } );
    }
    load_provider ( isEdit ) {
        this.show( [ this.name, this.component, this.cost, this.link ],
            ( isEdit ) ? {
                name: this.element.name,
                cost: this.element.cost, 
                link: this.element.link
            } : { } );
        $.ajax({
            type: "GET",
            url: `${APIurl}/comp?token=${admin.token}`,
            success: ( response ) => {
                response.forEach( component => {
                    const option = document.createElement( 'option' );
                    option.text = component.name;
                    option.value = component.id;
                    if ( this.isEdit && option.value == this.element.idComp ) option.selected = true;
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

    update_user ( ) {
        const updatePayload = this.getUpdatePayload( [ 'name', 'email', 'password' ] );
        if ( updatePayload ) this.updateRequest( 'user', updatePayload, { id: this.element.id } );
    }
    update_admin ( ) {
        const updatePayload = this.getUpdatePayload( [ 'name', 'email', 'password', 'access' ] );
        if ( updatePayload ) this.updateRequest( 'admin', updatePayload, { id: this.element.id } );
    }
    update_component ( ) {
        const updatePayload = this.getUpdatePayload( [ 'name', 'description' ] );
        if ( updatePayload ) this.updateRequest( 'comp', updatePayload, { id: this.element.id } );
    }
    update_provider ( ) {
        const updatePayload = this.getUpdatePayload( [ 'name', 'component', 'link', 'cost' ] );
        if ( updatePayload ) this.updateRequest( 'comp/prov', updatePayload, { id: this.element.id } );
    }

    clearWindow ( ) {
        const children = document.getElementById( 'register' ).children
        for ( let i = 0; i < children.length; i++ ) {
            children[i].style.display = 'none';
        }
    }
    show ( inputs = [ ], placeholders ) {
        inputs.forEach( input => {
            input.style.display = 'block';
            if ( placeholders[ input.id ] ) input.placeholder = placeholders[ input.id ];
        } )
        document.getElementById( 'btn-register' ).style.display = 'block';
        if ( this.isEdit ) document.getElementById( 'btn-register' ).innerText = 'Editar';
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
                if ( response ) window.close( );
            },
            error: ( error ) => {
                console.log( error );
                alert( 'Erro' );
            }
        });
    }
    updateRequest ( route, update, identifier ) {
        $.ajax({
            type: "PUT",
            url: `${APIurl}/${route}`,
            data: JSON.stringify( { identifier, update, token: admin.token } ),
            contentType: "application/json",
            success: function (response) {
                if ( response ) window.close( );
            },
            error: ( error ) => {
                console.log( error );
                alert( 'Erro' )
            }
        });
    }
    getUpdatePayload ( fields = [ ] ) {
        const convertion = {
            access: 'accessLevel',
            description: 'descr',
            component: 'idComp'
        };
        const payload = { };
        fields.forEach( field => {
            if ( field === 'password' && !this.passwordIsEqual( ) ) return undefined;
            let value;
            if ( field === 'component' ) value = this.component.options[ this.component.selectedIndex ].value;
            else value = this[ field ].value;
            if ( value !== undefined && value.trim() !== '' ) 
                payload[ ( convertion[field] ) ? convertion[field] : field ] = value;
        } )
        return payload;
    }
}