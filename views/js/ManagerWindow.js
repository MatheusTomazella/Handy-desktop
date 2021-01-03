class ManagerWindow {
    constructor ( args ) {
        this.type = args.type;
        this.route = args.route;
        document.getElementById( 'query-title' ).innerText = `Gerenciar ${args.title}`;
        
        this.queryList = document.getElementById( 'query' );

        const waitingToken = setInterval( async ( ) => {
            if ( admin.token ) { 
                clearInterval( waitingToken );
                await this[ `construct_${this.type}` ]( );
                this.requestQuery( this.type, this.route, admin.token );
            }
        }, 500 );
        return this;
    }
    requestQuery ( type, route, token ) {
        $.ajax({
            type: "GET",
            url: `${APIurl}/${route}?token=${token}`,
            success: ( response ) => {
                this[ `fill_${type}` ]( response );
            }, 
            error: ( error ) => {
                console.log( error );
                alert( error.error );
            }
        });
    }

    construct_user ( ) {
        this.queryList.innerHTML = 
        `<li class="query-list row">
            <div class="query-list-title col s1"> Id     </div>
            <div class="query-list-title col s4"> Nome   </div>
            <div class="query-list-title col s4"> Email  </div>
            <div class="query-list-title col s3"> Senha  </div>
        </li>`
    }
    construct_admin ( ) {
        this.queryList.innerHTML = 
        `<li class="query-list row">
            <div class="query-list-title col s1"> Id     </div>
            <div class="query-list-title col s3"> Nome   </div>
            <div class="query-list-title col s4"> Email  </div>
            <div class="query-list-title col s3"> Senha  </div>
            <div class="query-list-title col s1"> Nível  </div>
        </li>`
    }
    construct_component ( ) {
        this.queryList.innerHTML = 
        `<li class="query-list row">
            <div class="query-list-title col s1"> Id        </div>
            <div class="query-list-title col s5"> Nome      </div>
            <div class="query-list-title col s6"> Descrição </div>
        </li>`
    }
    construct_provider ( ) {
        this.queryList.innerHTML = 
        `<li class="query-list row">
            <div class="query-list-title col s1"> Id        </div>
            <div class="query-list-title col s4"> Nome      </div>
            <div class="query-list-title col s1"> IdComp    </div>
            <div class="query-list-title col s5"> Link      </div>
            <div class="query-list-title col s1"> Custo     </div>
        </li>`
    }
    construct_message ( ) {
        this.queryList.innerHTML = 
        `<li class="query-list row">
            <div class="query-list-title col s1"> Id        </div>
            <div class="query-list-title col s1"> IdUser    </div>
            <div class="query-list-title col s1"> IdAdmin   </div>
            <div class="query-list-title col s1"> Emissor   </div>
            <div class="query-list-title col s5"> Texto     </div>
            <div class="query-list-title col s3"> Data      </div>
        </li>`
    }

    fill_user ( query ) {
        this.fill ( query, { id: 1, name: 4, email: 4, password: 3 } );
    }
    fill_admin ( query ) {
        this.fill ( query, { id: 1, name: 3, email: 4, password: 3, accessLevel: 1 } );
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
            const li = this.generateLi( );
            await fields.forEach( async field => {
                console.log( field, blueprint, item, blueprint[field], item[field] );
                li.appendChild( await this.generateDiv( blueprint[ field ], item[ field ] ) );
            } );
            this.queryList.appendChild( li );
        } );
    }

    generateLi ( queryData ) {
        const element = document.createElement( 'li' );
        element.className = 'users-waiting query-item row';
        //element.dataset.queryData = data;
        element.onmousedown = ( event ) => {
            const position  = { top: event.clientY, left: event.clientX };
            const user      = {  };
            contextMenu.show( position, user );
        };
        return element;
    }
    generateDiv ( colSize, text ) {
        const div = document.createElement( 'div' );
        div.className = `query-item col s${colSize}`;
        div.innerText = text;
        return div;
    }

    showQuery ( query ) {
        // query.forEach( element => {
        //     const li = document.createElement( 'li' );
        //     li.className = 'queue-user';
        //     li.innerText = `${element.userId}: ${element.name}`;
        //     li.dataset.id     = element.userId;
        //     li.dataset.socket = element.socketId;
        //     li.onmousedown = ( event ) => {
        //         const position  = { top: event.clientY, left: event.clientX };
        //         const user      = { id: event.target.dataset.id, socket: event.target.dataset.socket, name: element.name };
        //         conte.show( position, user );
        //     }
        //     supportQueueList.appendChild( li );
        //     this.queryList;
        // } );
    }
}