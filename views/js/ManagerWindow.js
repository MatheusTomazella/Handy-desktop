class ManagerWindow {
    constructor ( args ) {
        this.type = args.type;
        this.route = args.route;
        this.title = args.title;
        document.getElementById( 'query-title' ).innerText = `Gerenciar ${args.title}`;
        
        this.queryList      = document.getElementById( 'query' );
        this.typeSelect     = $('#search-type');
        this.orderSelect    = $('#search-order');

        const waitingToken = setInterval( async ( ) => {
            if ( admin.token ) { 
                clearInterval( waitingToken );
                await this.constructDefault( true );
                this.requestQuery( this.type, this.route, args.search );
            }
        }, 500 );
        return this;
    }

    constructDefault ( changeSelect = false ) {
        this[ `construct_${this.type}` ]( changeSelect );
    }

    requestQuery ( type, route, query ) {
        let queryString = `token=${admin.token}`;
        if ( query ) {
            if ( query.key )    queryString += `&${query.key}=${query.value}`;
            if ( query.order )  queryString += `&order=${query.order}`;
        }
        $.ajax({
            type: "GET",
            url: `${APIurl}/${route}?${queryString}`,
            success: ( response ) => {
                this[ `fill_${type}` ]( response );
            }, 
            error: ( error ) => {
                console.log( error );
                alert( error.error );
            }
        });
        this.query = { };
    }

    construct_user ( changeSelect ) {
        this.construct( { Id: 1, Nome: 5, Email: 6 },
            { 
                change: changeSelect,
                type:   { Id: 'ID', name: 'Nome', email: "Email", password: "Password" },
                order:  { none: 'Não Ordenar', id: 'ID', name: "Nome", email: 'Email' }
            } );
    }
    construct_admin ( changeSelect ) {
        this.construct( { Id: 1, Nome: 5, Email: 5, Nível: 1 },
            { 
                change: changeSelect,
                type:   { Id: 'ID', name: 'Nome', email: "Email", accessLevel: "Nível de acesso", password: "Password" },
                order:  { none: 'Não Ordenar', id: 'ID', name: "Nome", email: 'Email', accessLevel: "Nível de acesso" }
            } );
    }
    construct_component ( changeSelect ) {
        this.construct( { Id: 1, Nome: 5, Descrição: 6 },
            { 
                change: changeSelect,
                type:   { Id: 'ID', name: 'Nome', descr: "Descrição" },
                order:  { none: 'Não Ordenar', id: 'ID', name: "Nome", descr: 'Descrição' }
            } );
    }
    construct_provider ( changeSelect ) {
        this.construct( { Id: 1, Nome: 4, IdComp: 1, Link: 5, Custo: 1 },
            { 
                change: changeSelect,
                type:   { Id: 'ID', name: 'Nome', idComp: "ID do Componente", cost: "Custo" },
                order:  { none: 'Não Ordenar', id: 'ID', name: "Nome", idComp: "ID do Componente", cost: "Custo" }
            } );
    }
    construct_message ( changeSelect ) {
        this.construct( { Id: 1, IdUser: 1, IdAdmin: 1, Emissor: 1, Texto: 5, Data: 3 },
            { 
                change: changeSelect,
                type:   { Id: 'ID', idUser: 'ID do Usuário', idAdmin: "ID do Suporte", sender: "Emissor", text: 'Texto', datetime: "Data", type: "Tipo da Mensagem", image: "Imagem" },
                order:  { none: 'Não Ordenar', Id: 'ID', idUser: 'ID do Usuário', idAdmin: "ID do Suporte", sender: "Emissor", text: 'Texto', datetime: "Data", type: "Tipo da Mensagem", image: "Imagem"  }
            } );
    }

    async construct ( blueprint, selectBlueprints = { type, order, change } ) {
        this.queryList.innerHTML = '';
        const li = this.generateLi( undefined, true );
        const fields = Object.keys( blueprint );
        await fields.forEach( async field => {
            li.appendChild( await this.generateDiv( blueprint[ field ], field, true ) );
        } );
        this.queryList.appendChild( li );
        if ( selectBlueprints && selectBlueprints.change ) { 
            this.populateSelect( this.typeSelect, selectBlueprints.type );
            this.populateSelect( this.orderSelect, selectBlueprints.order );
        }
    }
    populateSelect ( select, blueprint ) {
        select.empty();
        const values = Object.keys( blueprint );
        values.forEach( value => {
            const option = document.createElement( 'option' );
            option.value = value;
            option.innerText = blueprint[ value ];
            select.append( option );
        } )
        $('select').formSelect();
    }


    fill_user ( query ) {
        this.fill ( query, { id: 1, name: 5, email: 6 } );
    }
    fill_admin ( query ) {
        this.fill ( query, { id: 1, name: 5, email: 5, accessLevel: 1 } );
    }
    fill_component ( query ) {
        this.fill ( query, { id: 1, name: 5, descr: 6 } );
    }
    fill_provider ( query ) {
        this.fill ( query, { id: 1, name: 4, idComp: 1, link: 5, cost: 1 } );
    }
    fill_message ( query ) {
        this.fill ( query, { id: 1, idUser: 1, idAdmin: 1, sender: 1, text: 5, datetime: 3 } );
    }

    fill ( query, blueprint ) {
        const fields = Object.keys( blueprint );
        query.forEach( async item => {
            this.query[item.id] = item;
            const li = this.generateLi( item );
            await fields.forEach( async field => {
                li.appendChild( await this.generateDiv( blueprint[ field ], item[ field ] ) );
            } );
            this.queryList.appendChild( li );
        } );
    }

    generateLi ( queryData, isTitle = false ) {
        const element = document.createElement( 'li' );
        const className = ( isTitle ) ? 'query-list' : 'query-item';
        element.className = `users-waiting ${className} row`;
        if ( !isTitle && this.route !== 'msg' ) element.dataset.id = queryData.id;
        if ( !isTitle && this.route !== 'msg' ) element.onmousedown = ( event ) => {
            const position      = { top: event.clientY, left: event.clientX };
            const elementData   = managerWindow.query[event.currentTarget.dataset.id];
            contextMenu.show( position, elementData );
        };
        return element;
    }
    generateDiv ( colSize, text, isTitle = false ) {
        const div = document.createElement( 'div' );
        const className = ( isTitle ) ? 'query-list-title' : 'query-item';
        div.className = `${className} col s${colSize}`;
        div.innerText = text;
        return div;
    }

    async deleteRequest ( route, element ) {
        await MaterialDialog.dialog(
            `<input type="password" class="input-field" id="modal-password-input" placeholder="Confirmar Senha">`,
            {
                title:"Confirmar remoção de registro",
                modalType:"password-confirm-modal",
                buttons:{
                    close:{
                        className:"btn-flat",
                        text:"Cancelar",
                        callback:function(){
                            admin.passwordConfirmation = undefined;
                            clearInterval( waitingConfirmation );
                        }
                    },
                    confirm:{
                        className:"peach",
                        text:"Confirmar",
                        modalClose:true,
                        callback: async () => {
                            admin.confirmPassword( await document.getElementById( 'modal-password-input' ).value );
                        }
                    }
                }
            }
        );
        document.getElementById( 'modal-password-input' ).focus();
        const waitingConfirmation = setInterval( () => {
            if ( admin.passwordConfirmation !== undefined ) {
                if ( admin.passwordConfirmation === true ) {
                    $.ajax({
                        type: "DELETE",
                        url: `${APIurl}/${route}`,
                        data: JSON.stringify( { identifier: { id: element.id }, token: admin.token } ),
                        contentType: "application/json",
                        success: ( response ) => {
                            managerWindow.constructDefault();
                            managerWindow.requestQuery( this.type, this.route );
                            //alert( "Registro deletado com sucesso" );
                        }, 
                        error: ( error ) => {
                            console.log( error );
                            alert( "Erro" );
                        }
                    });
                } else alert( "Senha incorreta" );
                admin.passwordConfirmation = undefined;
                clearInterval( waitingConfirmation );
            }
        }, 500 );
    }
}