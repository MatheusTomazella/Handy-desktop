class Men {
    constructor ( message ){
        //this.id         = message.id;
        this.idAdmin    = message.idAdmin;
        this.idUser     = message.idUser;
        this.datetime   = message.datetime;
        this.sender     = message.sender;
        this.type       = message.type;
        this.text       = message.text;
        this.image      = message.image;  
        return this;
    }
    show ( ){
        let owner = 'owner';
        if ( realTime.user.type ) owner = ( realTime.user.type == this.sender ) ? 'speech-right' : '';
        chat.innerHTML += `<li class="mar-btm">
                              <div class="media-body pad-hor ${owner}">
                                  <div class="speech">
                                      <label class="media-heading">${( owner ) ? admin.admin.name : realTime.otherUserInfo.name}</label>
                                      <p>${this.text}</p>
                                      <p class="speech-time">
                                      <i class="fa fa-clock-o fa-fw"></i>${this.datetime}
                                      </p>
                                  </div>
                              </div>
                          </li>`;
        document.querySelector("#scrollDiv").scrollTop=10000;
    }
    extractInfo ( ) {
        return {    idAdmin: this.idAdmin,
                    idUser: this.idUser,
                    datetime: this.datetime,
                    sender: this.sender,
                    type: this.type,
                    text: this.text,
                    image: this.image
                }
    }
}


/*
[
  {
    "id": 1,
    "idAdmin": 3,
    "idUser": 16,
    "datetime": "2020-08-27T04:45:03.000Z",
    "sender": "admin",
    "type": "text",
    "text": "testeMsg1",
    "image": null
  }
]
*/