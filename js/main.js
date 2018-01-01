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
   
//recupero el historial de mensajes del usuario
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
            if(id.value!=id_ultimo){
                document.getElementById('viewMessages').innerHTML+="<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>"+nombre+"</h4></div><div class='rigthDat'><h5>"+hora+"<br>"+fecha+"</h5></div></div></div><div class='message'><h5>"+nameBussines(id_ultimo)+": "+ultimoMensaje+"</h5></div></div></div></div>";
            }else{
                document.getElementById('viewMessages').innerHTML+="<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>"+nombre+"</h4></div><div class='rigthDat'><h5>"+hora+"<br>"+fecha+"</h5></div></div></div><div class='message'><h5> Yo : "+ultimoMensaje+"</h5></div></div></div></div>"; 
            }
            console.log("nombre:"+nombre);
            console.log("id-ultimo:"+id_ultimo);
            console.log("message bussines end"+nameBussines(id_ultimo));
            console.log("ultimo mensaje: "+ultimoMensaje);
            console.log("fecha y hora: "+fecha+" "+hora);
            //funcion ke muestra los mensages del chat  
            mostrarMensajesChat();
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

    //funcion ke muestra los mensages del chat  
    mostrarMensajesChat();
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

function mostrarMensajesChat(){
        //borro el chat
        document.getElementById('messagesContainer').innerHTML="<br><br><br>";  
        var jsonT=jsonChat[id_contact_send];
        for(var k in jsonT){
            console.log("codigo mensaje "+k);
            console.log("fecha y hora"+jsonT[k].date+" "+jsonT[k].hours);
            console.log("de "+nameBussines(jsonT[k].id)+" mensaje: "+jsonT[k].message);
            // llenando los datos en la venttana de mensajes
            var nombre=nameBussines(jsonT[k].id);
            var hora=jsonT[k].hours;
            var mensaje=jsonT[k].message;
            console.log("mi id es "+id.value);
            console.log("id mensaje "+jsonT[k].id);
            if(id.value!=jsonT[k].id){
                //mensajes recibidos
                document.getElementById('messagesContainer').innerHTML+="<li style='width:100%'><div class='msj macro'><div class='avatar'><img class='img-circle' style='width:100%;' src='https://images-na.ssl-images-amazon.com/images/I/41Y3C1X3F9L._SY355_.jpg'></div><div class='text text-l'><p><h4>"+nombre+"</h4></p><p><h5>"+mensaje+"</h5></p><p><small>"+hora+"</small></p></div></div></li>";
            }else{
                //menssajes enviados
                document.getElementById('messagesContainer').innerHTML+="<li style='width:100%;'><div class='msj-rta macro' style='margin-right: 10px;'><div class='text text-r'><p><h4>Yo</h4></p><p><h5>"+mensaje+"</h5></p><p><small>"+hora+"</small></p></div><div class='avatar' style='padding:0px 0px 0px 10px !important'><img class='img-circle' style='width:100%;' src='https://cf.kizlarsoruyor.com/q7310269/op/b8c3f941-f7a0-4783-830f-fdc20ed93cd7.jpg'></div></div></li>";
            }
        }
        document.getElementById('messagesContainer').innerHTML+="<br><br><br><br><br>"; 

        //cada ke llega un nuevo mensaje el scroll es envado abajo

        document.getElementById('scrollContainer').scrollTop=document.getElementById('scrollContainer').scrollHeight;
        console.log("entra alcambio del scroll");

};




//evento ke envia un mensaje
function sendMessage(e){
    tecla = (document.all) ? e.keyCode : e.which;
    //guardo el mensaje en enviados 
    var f=new Date();
    var fecha=f.getDate()+"/"+(f.getMonth()+1)+"/"+f.getFullYear();
    var hora=f.getHours()+":"+f.getMinutes();

    var referencia1 = databaseService.ref('chat').child(id.value).child(id_contact_send).child(idNewMessage(id_contact_send));
    var referencia2 = databaseService.ref('chat').child(id_contact_send).child(id.value).child(idNewMessage(id.value));
    if (tecla==13) {
            referencia1.update({
                date:fecha,
                hours:hora,
                id:id.value,
                message:document.getElementById('enviarCaja').value,
                viewed:false
            });
            referencia2.update({
                 date:fecha,
                hours:hora,
                id:id.value,
                message:document.getElementById('enviarCaja').value,
                viewed:false
            });
            document.getElementById('enviarCaja').value="";
    };
}












//funcion que crea el nuevo id para el nuevo mensaje
function idNewMessage(id){
    var f=new Date();
    return f.getFullYear()+""+(f.getMonth()+1)+""+f.getDate()+""+f.getHours()+""+f.getMinutes()+""+f.getSeconds()+""+mls(f.getTime())+""+id;
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
//evento enter para el imput 
document.getElementById("enviarCaja").addEventListener("keypress",sendMessage);




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


