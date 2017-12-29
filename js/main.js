var databaseService = firebase.database();
var refCustomerGroups;
var refCustomerReceivedMessage;
var refMensagesClientSent;
var refMessage_group;
var refBusiness_circle;
//var json de los datos
var jsonCustomerGroups;
var jsonCustomerReceivedMessage;
var jsonMensagesClientSent;
var jsonMessage_group;
var jsonBusiness_circle;
//variable del id del contacto a enviar;
var id_contact_send;






function idClient() {
    //doy valor a las variables de los eventos
    var id = document.getElementById('id');
    console.log("entro al idClient " + id.value);
    refBusiness_circle = firebase.database().ref().child('business_circle').child(id.value);
    refCustomerGroups = firebase.database().ref().child('customerGroups').child(id.value);
    refCustomerReceivedMessage = firebase.database().ref().child('customerReceivedMessage').child(id.value);
    refMensagesClientSent = firebase.database().ref().child('mensagesClientSent').child(id.value);
    refMessage_group = firebase.database().ref().child('message_group').child(id.value);
    vigilarCambios();
    mostrarContactos();
}

function vigilarCambios() {

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

    //mostrar los contactos
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
             document.getElementById("viewMessage").innerHTML+="<div class='col-12'><div class='viewMessage' ><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>"+descripcion+"</h5></div></div></div></div>";
             ic++;
        }



        document.getElementById("infoContact").innerHTML=ic;
    });
}







function mostrarContactos() {
    //document.getElementById('viewMessage').innerHTML+=jsonBusiness_circle;
}













//funcion que extrae el id del cliente;
function id_send(a) {
    id_contact_send
    //metodo de extraccion del id del contacto basandonos en el nombre de la empresa
    var refId_id = firebase.database().ref().child('mensagesClientSent').child();
    var jsonDeId=JSON.stringify(refId_id,null,3);
    $.each(jsonDeId,function(k,v){
    	if(a.div.nombre == v.id_client.company_name){
    		return id_contact_send = v.id_client;
    	}
    });

}












//funcion que sera llamada en el caso que se desee enviar un mensaje
function send_message() {
    //este codigo guarda los datos en la base de datos en los registros de envio del usuario
    var id = document.getElementById('id');
    var fecha = new Date();
    var hora = fecha.getHours();
    var minuto = fecha.getMinutes();
    var segundo = fecha.getSeconds();

    var refEnviarMensaje = databaseService.ref('mensagesClientSent').child(id.value).child(id_send()).child(fecha + " " + hora + ":" + minuto + ":" + segundo);
    //linea de codigo que extrae el nombre del cual se envia el mensaje
    var refNombreUsuarioReceived = databaseService.ref('mensagesClientSent').child(id_send());
    refEnviarMensaje.update({

        //linea de codigo que inserta el nombre de la empresa a cual se envio el mensaje
        company_name: refNombreUsuarioReceived.company_name,
        message_received: document.getElementById('enviarCaja')
    });

    //este codigo guarda los datos en la base de datos del usuario a quien se le envio el mensaje
    var refResibeMensaje = databaseService.ref('customerReceivedMessage').child(id_send()).child(id.value).child(fecha + " " + hora + ":" + minuto + ":" + segundo);

    //extraemos el nombre del usuario
    var refNombreUsuario = databaseService.ref('mensagesClientSent').child(id.value);

    refResibeMensaje.update({
        company_name: refNombreUsuario.company_name,
        message_received: document.getElementById('enviarCaja')
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