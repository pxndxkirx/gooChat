var databaseService = firebase.database();
var refCustomerGroups;
var refCustomerReceivedMessage;
var refMensagesClientSent;
var refMessage_group;
var refBusiness_circle;
var refListUser;
//var json de los datos
var jsonCustomerGroups;
var jsonCustomerReceivedMessage;
var jsonMensagesClientSent;
var jsonMessage_group;
var jsonBusiness_circle;
var jsonListUser;



//variable del id del contacto a enviar;
var id_contact_send;






function idClient() {
    //doy valor a las variables de los eventos
    var id = document.getElementById('id');
    console.log("entro al idClient " + id.value);
    refListUser=firebase.database().ref().child('list_user');
    refBusiness_circle = firebase.database().ref().child('business_circle').child(id.value);
    refCustomerGroups = firebase.database().ref().child('customerGroups').child(id.value);
    refCustomerReceivedMessage = firebase.database().ref().child('customerReceivedMessage').child(id.value);
    refMensagesClientSent = firebase.database().ref().child('mensagesClientSent').child(id.value);
    refMessage_group = firebase.database().ref().child('message_group').child(id.value);
    vigilarCambios();
    mostrarContactos();
}

function vigilarCambios() {


            // nota , pensar como vamos a mostrar el chat








    console.log("entro a vigilar cambios");
    refCustomerGroups.on("value", snap => {
        jsonCustomerGroups = JSON.stringify(snap.val(), null, 3);
        console.log("1");
        console.log(jsonCustomerGroups);
    });
    refCustomerReceivedMessage.on("value", snap => {
        jsonCustomerReceivedMessage = JSON.stringify(snap.val(), null, 3);
        console.log("2");
        console.log(jsonCustomerReceivedMessage);
        jsonCustomerReceivedMessage=JSON.parse(jsonCustomerReceivedMessage);
    });
    refMensagesClientSent.on("value", snap => {
        jsonMensagesClientSent = JSON.stringify(snap.val(), null, 3);
        console.log("3");
        console.log(jsonMensagesClientSent);

        jsonMensagesClientSent=JSON.parse(jsonMensagesClientSent);
    });



    refMessage_group.on("value", snap => {
        jsonMessage_group = JSON.stringify(snap.val(), null, 3);
        console.log("4");
        console.log(jsonMessage_group);

        jsonMessage_group=JSON.parse(jsonMessage_group);
    });

    refListUser.on("value",snap=>{
        jsonListUser=JSON.stringify(snap.val(),null,3);
        jsonListUser=JSON.parse(jsonListUser);
    });



    //mostrar los circulos o contactos del usuario
    refBusiness_circle.on("value", snap => {
        jsonBusiness_circle = JSON.stringify(snap.val(), null, 3);
        console.log("5");
        console.log(jsonBusiness_circle);
        jsonBusiness_circle=JSON.parse(jsonBusiness_circle);
        //mostrando los datos
        console.log("--extraendo datos--");
        document.getElementById("viewMessage").innerHTML=""; 
        var ic=0;
        for(var key in jsonBusiness_circle){
           console.log("name="+key+" value="+jsonBusiness_circle[key].name_bussines);
            var nombre=jsonBusiness_circle[key].name_bussines;
            var descripcion=jsonBusiness_circle[key].description;
          // document.getElementById("viewMessage").innerHTML+="  <div class='col-12'><div class='viewMessage' ><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>"+nombre+"</h4></div><div class='rigthDat'><h5>22:43<br>12/12/12</h5></div></div></div><div class='message'><h5>ultimo mensaje</h5></div></div></div></div>"
             document.getElementById("viewMessage").innerHTML+="<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>"+descripcion+"</h5></div></div></div></div>";
             ic++;
        }
        document.getElementById("infoContact").innerHTML=ic;
    });
}

















//eventos click de las opciones del chat


document.getElementById("buttonContact").addEventListener("click",mostrarContactos);
document.getElementById("buttonMessagge").addEventListener("click",mostrarMensajes);
document.getElementById("buttonMessageGroup").addEventListener("click",mostrarMensajesGrupos);
document.getElementById("buttonFriendRequest").addEventListener("click",mostrarSolicitudes);





function mostrarContactos() {
    document.getElementById("contact").className="show";
    document.getElementById("myMessages").className="hide";
    document.getElementById("myMessagesGroup").className="hide";
    document.getElementById("friendRequest").className="hide";

    document.getElementById("buttonContact").className="col-xs-3 col-sm-3 col-md-3 optionButton selected";
    document.getElementById("buttonMessagge").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessageGroup").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonFriendRequest").className="col-xs-3 col-sm-3 col-md-3 optionButton";

    console.log("mostrando contactos");
};


function mostrarMensajes(){
    document.getElementById("contact").className="hide";
    document.getElementById("myMessages").className="show";
    document.getElementById("myMessagesGroup").className="hide";
    document.getElementById("friendRequest").className="hide";

    document.getElementById("buttonContact").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessagge").className="col-xs-3 col-sm-3 col-md-3 optionButton selected";
    document.getElementById("buttonMessageGroup").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonFriendRequest").className="col-xs-3 col-sm-3 col-md-3 optionButton";




    console.log("Mostrando mensajes");
};
function mostrarMensajesGrupos(){
    document.getElementById("contact").className="hide";
    document.getElementById("myMessages").className="hide";
    document.getElementById("myMessagesGroup").className="show";
    document.getElementById("friendRequest").className="hide";

    document.getElementById("buttonContact").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessagge").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessageGroup").className="col-xs-3 col-sm-3 col-md-3 optionButton selected";
    document.getElementById("buttonFriendRequest").className="col-xs-3 col-sm-3 col-md-3 optionButton";


    console.log("Mostrando mensajes de grupos");
};

function mostrarSolicitudes(){
    document.getElementById("contact").className="hide";
    document.getElementById("myMessages").className="hide";
    document.getElementById("myMessagesGroup").className="hide";
    document.getElementById("friendRequest").className="show";



    document.getElementById("buttonContact").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessagge").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessageGroup").className="col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonFriendRequest").className="col-xs-3 col-sm-3 col-md-3 optionButton selected";



    console.log("Mostrando solicitudes de amistad");
};



// function extractId()

function selectedItem(obj){
    var nameBussines=stripHtmlTags(obj.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    console.log(nameBussines);
    console.log(obj);
    var a=document.getElementsByClassName("viewMessage");
    console.log(a.length);
    for(var i=0;i<a.length;i++){
        a[i].className="viewMessage";
        console.log("entro");
    }
    //resalto el item seleccionado
    obj.className="viewMessage selectedItem";

    //le asigno el id del item seleccionado
    id_contact_send=idItem(nameBussines);
    console.log(id_contact_send);
}

//elimina etiquetas de un objeto
function stripHtmlTags(elemento) {
  return elemento.textContent||elemento.innerText;
}

//funcion que me devuelve el id segun el nombre
function idItem(name){

    for(var key in jsonListUser){

        if(jsonListUser[key].name_bussines == name){
          //console.log(key + " "+jsonListUser[key].name_bussines);
          return key;
        }
        //console.log(key);
    }
    return console.log("Este usuario no se encuentra en la lista de usuarios");
}


