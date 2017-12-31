var databaseService = firebase.database();

var refBusiness_circle;
var refListUser;
var refChat;


//var json de los datos

var jsonBusiness_circle;
var jsonListUser;
var jsonChat;


//variable del id del contacto a enviar;
var id_contact_send;

var id;



function idClient() {
    //doy valor a las variables de los eventos
    id = document.getElementById('id');
    console.log("entro al idClient " + id.value);
    
    refListUser=firebase.database().ref().child('list_user');
    refBusiness_circle = firebase.database().ref().child('business_circle').child(id.value);
    refChat=firebase.database().ref().child('chat').child(id.value);



    vigilarCambios();
    mostrarContactos();
}

function vigilarCambios() {

    console.log("entro a vigilar cambios");
 




   //recupero toda la lista de usuarios
    refListUser.on("value",snap=>{
        jsonListUser=JSON.stringify(snap.val(),null,3);
        jsonListUser=JSON.parse(jsonListUser);
    });
   //recupero los mensajes del usuario

   
 refChat.on("value",snap=>{
        jsonChat=JSON.stringify(snap.val(),null,3);
        console.log(jsonChat);
        jsonChat=JSON.parse(jsonChat);
        document.getElementById('viewMessages').innerHTML="";
        var sinLeer=0;
        var nombre;
        var ultimoMensaje;
        var fecha;
        var hora;
        var id_ultimo;
        for(var key in jsonChat){
            nombre=nameBussines(key);
            var jsonTemp=jsonChat[key];
            for(var k in jsonTemp){
                ultimoMensaje=jsonTemp[k].message;
                fecha=jsonTemp[k].date;
                hora=jsonTemp[k].hours;
                id_ultimo=jsonTemp[k].id;
                if(id.value != jsonTemp[k].id){
                    if(jsonTemp[k].viewed==false){
                        sinLeer++;
                    }
                }

            }

            document.getElementById('infoMessages').innerHTML=sinLeer;
            document.getElementById('unreadMessage').innerHTML=sinLeer;
            document.getElementById('viewMessages').innerHTML+="<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>"+nombre+"</h4></div><div class='rigthDat'><h5>"+hora+"<br>"+fecha+"</h5></div></div></div><div class='message'><h5>"+nameBussines(id_ultimo)+": "+ultimoMensaje+"</h5></div></div></div></div>";





            console.log("nombre:"+nombre);
            console.log("ultimo mensaje: "+ultimoMensaje);
            console.log("fecha y hora: "+fecha+" "+hora);
        }

    });

    //mostrar los circulos o contactos del usuario
    refBusiness_circle.on("value", snap => {
        jsonBusiness_circle = JSON.stringify(snap.val(), null, 3);
        // console.log("5");
        console.log(jsonBusiness_circle);
        jsonBusiness_circle=JSON.parse(jsonBusiness_circle);
        //mostrando los datos
        console.log("--extraendo datos--");
        document.getElementById("viewMessage").innerHTML=""; 
        var ic=0;
        for(var key in jsonBusiness_circle){
           // console.log("name="+key+" value="+jsonBusiness_circle[key].name_bussines);
            var nombre=jsonBusiness_circle[key].name_bussines;
            var descripcion=jsonBusiness_circle[key].description;
          // document.getElementById("viewMessage").innerHTML+="  <div class='col-12'><div class='viewMessage' ><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>"+nombre+"</h4></div><div class='rigthDat'><h5>22:43<br>12/12/12</h5></div></div></div><div class='message'><h5>ultimo mensaje</h5></div></div></div></div>"
             document.getElementById("viewMessage").innerHTML+="<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>"+descripcion+"</h5></div></div></div></div>";
             ic++;
        }
        document.getElementById("infoContact").innerHTML=ic;
    });
}


//esta funcion me proporciona el id del item seleccionado para poder enviarle un mensaje o leer los mensajes seleccionados

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


//funcion ke devuelve el nombre segun el id

function nameBussines(id){
        for(var key in jsonListUser){
            if( key == id){
             return jsonListUser[key].name_bussines;
            }
        }
    return "error";
}












//esta funcion me mostrara todos los mensajes ke se tubo con un usuario en espesifico

function mostrarMensajes(){

}


















//funcion que crea el nuevo id para el nuevo mensaje
function idNewMessage(id){
    var f=new Date();
    return f.getHours()+""+f.getMinutes()+""+f.getSeconds()+""+mls(f.getTime())+""+f.getDate()+""+(f.getMonth()+1)+""+f.getFullYear()+id;
}
//funcion que me devuelve los milisegundos de un estring del getTime();
function mls(b){
    a=b+"";
    console.log(a.length);
    return a.substr(a.length-3,1);
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


