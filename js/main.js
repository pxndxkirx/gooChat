var databaseService = firebase.database();
var refBusiness_circle;
var refListUser;
var refChat;
var refFriendRequest;
var refFriendRequestAll;


//var json de los datos
var jsonBusiness_circle;
var jsonListUser;
var jsonChat;
var jsonFriendRequest;
var jsonFriendRequestAll;


//variable del id del contacto a enviar;
var id_contact_send = 0;
var id;



function idClient() {
    //doy valor a las variables de los eventos
    id = document.getElementById('id');

    myOnLine();
    //console.log("entro al idClient " + id.value);
    refListUser = firebase.database().ref().child('list_user');
    refBusiness_circle = firebase.database().ref().child('business_circle').child(id.value);
    refChat = firebase.database().ref().child('chat').child(id.value);
    refFriendRequest = firebase.database().ref().child('friendRequest').child(id.value);
    refFriendRequestAll = firebase.database().ref().child('friendRequest');
    vigilarCambios();
    mostrarContactos();
}
function vigilarCambios() {
    //recupero la lista de peticiones de amistadad de todos
    refFriendRequestAll.on("value", snap => {
        jsonFriendRequestAll = JSON.stringify(snap.val(), null, 3);
        jsonFriendRequestAll = JSON.parse(jsonFriendRequestAll);
        buscar();
    });
    //recupero toda la lista de usuarios
    refListUser.on("value", snap => {
        jsonListUser = JSON.stringify(snap.val(), null, 3);
        jsonListUser = JSON.parse(jsonListUser); 
        buscar();
        //recupero la lista de peticiones de amistad
        refFriendRequest.on("value", snap => {
            jsonFriendRequest = JSON.stringify(snap.val(), null, 3);
            jsonFriendRequest = JSON.parse(jsonFriendRequest);
            mostrarPeticiones();
        });

        showCircles();

    });
    //recupero la lista de peticiones de amistad
    refFriendRequest.on("value", snap => {
        jsonFriendRequest = JSON.stringify(snap.val(), null, 3);
        jsonFriendRequest = JSON.parse(jsonFriendRequest);
        mostrarPeticiones();
    });
    //recupero el historial de mensajes del usuario
    refChat.on("value", snap => {
        jsonChat = JSON.stringify(snap.val(), null, 3);
        jsonChat = JSON.parse(jsonChat);
        latestMessage();
       // console.log("mostrando mensajes desde la referencia");
        mostrarMensajesChat();

        //console.log("mostrando mensajes desde la referencia2");
    });

    //mostrar los circulos o contactos del usuario
    refBusiness_circle.on("value", snap => {
        jsonBusiness_circle = JSON.stringify(snap.val(), null, 3);
        jsonBusiness_circle = JSON.parse(jsonBusiness_circle);
        showCircles();
        buscar();
    });

}
//funcion que pone el estado en linea de mi user

function myOnLine(){
    refOnLine= firebase.database().ref().child('list_user').child(id.value);
    refOnLine.update({
        online:true
    });   
}


function myOfLine(){
    refOnLine= firebase.database().ref().child('list_user').child(id.value);
    refOnLine.update({
        online:false
    });  
}




//funcion que muestra los circulos del ususario

function showCircles(){
     //mostrando los datos
        var viewMessage = "<br><br>";

        var ic = 0;
        for (var key in jsonBusiness_circle) {
            var nombre = jsonBusiness_circle[key].name_bussines;
            var descripcion = jsonBusiness_circle[key].description;
           

            var eto="<div style='position:absolute;background:green;border-radius:50% 50%;width:20px;height:20px;border:2px solid #19212b;margin-top:25px;margin-left:15px;'></div>";
            var etd="<div style='position:absolute;background:gray;border-radius:50% 50%;width:20px;height:20px;border:2px solid #19212b;margin-top:25px;margin-left:15px;'></div>";


//probando codigo estado en linea 
            if(viewOnLine(key)){
                if (urlImg(key + "") != "") {
                    viewMessage += "<br><div class='col-12'><div class='buttonFriendRequestStyleStyle2 deleteCircle' onclick='deleteCircle(this)'><i class='fa fa-trash' aria-hidden='true'></i></div>"+eto+"<div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + urlImg(key + "") + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                } else {
                    viewMessage += "<br><div class='col-12'><div class='buttonFriendRequestStyleStyle2 deleteCircle' onclick='deleteCircle(this)'><i class='fa fa-trash' aria-hidden='true'></i></div>"+eto+"<div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                }
                ic++;
            }else{
                if (urlImg(key + "") != "") {
                    viewMessage += "<br><div class='col-12'><div class='buttonFriendRequestStyleStyle2 deleteCircle' onclick='deleteCircle(this)'><i class='fa fa-trash' aria-hidden='true'></i></div>"+etd+"<div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + urlImg(key + "") + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                } else {
                    viewMessage += "<br><div class='col-12'><div class='buttonFriendRequestStyleStyle2 deleteCircle' onclick='deleteCircle(this)'><i class='fa fa-trash' aria-hidden='true'></i></div>"+etd+"<div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                }
                ic++;
            }
        }
        viewMessage += "<br><br><br>";
        document.getElementById('viewMessage').innerHTML = viewMessage;
        document.getElementById("infoContact").innerHTML = ic;
}
//funcion que revisa si esta en linea o no
function viewOnLine(id){
    for(var key in jsonListUser){
        if(key==id){
            if(jsonListUser[key].online){
                return true;
            }else{
                return false;
            }
        }
    }
    return false;
}


//funcion que elimina a una empresa de tus circulos
function deleteCircle(obj){
    console.log(obj.parentNode.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    var nombre = stripHtmlTags(obj.parentNode.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    var myDelete = databaseService.ref('business_circle').child(id.value).child(idItem(nombre));
    var yourDelete= databaseService.ref('business_circle').child(idItem(nombre)).child(id.value);
    myDelete.remove();
    yourDelete.remove();
}


//funcion que muestra los ultimos mensajes de cada chat

function latestMessage(){
        //probando codigo
        //json temporal para ordenar datos
        
        var jsonTempOrdenado=[];
        for (var key in jsonChat) {
            nombre = nameBussines(key);
            idMensaje = key;
            var jsonTemp = jsonChat[key];

            var indi = 0;

            for (var k in jsonTemp) {
                ultimoMensaje = jsonTemp[k].message;
                fecha = jsonTemp[k].date;
                hora = jsonTemp[k].hours;
                id_ultimo = jsonTemp[k].id;
                if (id.value != jsonTemp[k].id) {
                    if (jsonTemp[k].viewed == false) {
                        console.log(jsonTemp);
                        indi++;
                        console.log(indi);
                    }
                }

            }
            
            if(id.value!=id_ultimo){
                jsonTempOrdenado.push({
                    "id":id_ultimo,
                    "indi":indi,
                    "nombreEmpresa":nameBussines(idMensaje),
                    "nombre":nameBussines(id_ultimo),
                    "hora":hora,
                    "fecha":fecha,
                    "mensaje":ultimoMensaje,
                    "url_img":urlImg(idMensaje)
                });
            }else{
                jsonTempOrdenado.push({
                    "id":id_ultimo,
                    "indi":indi,
                    "nombreEmpresa":nameBussines(idMensaje),
                    "nombre":"yo",
                    "hora":hora,
                    "fecha":fecha,
                    "mensaje":ultimoMensaje,
                    "url_img":urlImg(idMensaje)
                });
            }

            jsonTempOrdenado.sort(function(a,b){                
                if(newDate(a.fecha,a.hora+":00")<newDate(b.fecha,b.hora+":00")){
                    return 1;
                }
                if(newDate(a.fecha,a.hora+":00")>newDate(b.fecha,b.hora+":00")){
                    return -1;
                }
                return 0;
            });
            console.log("json nuevo y ordenado");
            console.log(jsonTempOrdenado);
        }

        var viewMessages = "<br><br>";
        var contador=0;
        var etiqueta = "";
        
        for(var k in jsonTempOrdenado){
            console.log(jsonTempOrdenado[k].nombre);
            try{
                if(jsonTempOrdenado[k].indi!=0){
                    tono();
                    contador++;
                    etiqueta = "<div class='indicator'>" + jsonTempOrdenado[k].indi + "</div>";
                    if(jsonTempOrdenado[k].url_img!=""){
                        viewMessages += "<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + jsonTempOrdenado[k].url_img + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" +jsonTempOrdenado[k].nombreEmpresa + "</h4></div><div class='rigthDat'><h5>" + jsonTempOrdenado[k].hora + "<br>" + jsonTempOrdenado[k].fecha + "</h5></div></div></div><div class='message'><h5>" + jsonTempOrdenado[k].nombre + ": " + jsonTempOrdenado[k].mensaje + "</h5></div></div>" + etiqueta + "</div></div>";
                    }else{
                        viewMessages += "<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + jsonTempOrdenado[k].nombreEmpresa + "</h4></div><div class='rigthDat'><h5>" + jsonTempOrdenado[k].hora + "<br>" + jsonTempOrdenado[k].fecha + "</h5></div></div></div><div class='message'><h5>" + jsonTempOrdenado[k].nombre + ": " + jsonTempOrdenado[k].mensaje + "</h5></div></div>" + etiqueta + "</div></div>";
                    }
                }else{
                    etiqueta="";
                    if(jsonTempOrdenado[k].url_img!=""){
                        viewMessages += "<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + jsonTempOrdenado[k].url_img + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + jsonTempOrdenado[k].nombreEmpresa + "</h4></div><div class='rigthDat'><h5>" + jsonTempOrdenado[k].hora + "<br>" + jsonTempOrdenado[k].fecha + "</h5></div></div></div><div class='message'><h5>" + jsonTempOrdenado[k].nombre + ": " + jsonTempOrdenado[k].mensaje+ "</h5></div></div>" + etiqueta + "</div></div>";
                    }else{
                        viewMessages += "<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + jsonTempOrdenado[k].nombreEmpresa + "</h4></div><div class='rigthDat'><h5>" + jsonTempOrdenado[k].hora + "<br>" + jsonTempOrdenado[k].fecha + "</h5></div></div></div><div class='message'><h5> "+jsonTempOrdenado[k].nombre+" : " + jsonTempOrdenado[k].mensaje + "</h5></div></div>" + etiqueta + "</div></div>";
                    }
                }
            }catch(e){};
        }
        document.getElementById('infoMessages').innerHTML = contador;
        document.getElementById('unreadMessage').innerHTML = contador;

        viewMessages += "<br><br>";
        document.getElementById('viewMessages').innerHTML = viewMessages;

}


//funciion que me ordena y devuelve el formato corecto para el date
function newDate(a,h){
    var dia="";
    var mes="";
    var anio="";
    var estado=1;
    for(var i=0;i<a.length;i++){
        if(a.substr(i,1)=="/"){
            
            estado++;
        }else{
            if(estado==1)dia+=a.substr(i,1);
            if(estado==2)mes+=a.substr(i,1);
            if(estado==3)anio+=a.substr(i,1);
        }
    }
    var fecha=mes+"-"+dia+"-"+anio;
    var f=Date.parse(fecha+" "+h);
    return new Date(f);
}

























//esta funcion me proporciona el id del item seleccionado para poder enviarle un mensaje o leer los mensajes seleccionados
function selectedItem(obj) {
    document.getElementById('enviarCaja').className = "show enviarCaja";
    console.log(obj);
    var nameBussines = stripHtmlTags(obj.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    var a = document.getElementsByClassName("viewMessage");

    for (var i = 0; i < a.length; i++) {
        a[i].className = "viewMessage";
    }
    //resalto el item seleccionado
    obj.className = "viewMessage selectedItem";

    //le asigno el id del item seleccionado
    id_contact_send = idItem(nameBussines);

    //funcion ke muestra los mensages del chat  
    console.log("mostrando mensajes desde el select item");

    document.getElementById('messagesContainer').innerHTML = "";
    mostrarMensajesChat();

    //probando codigo para ocultar y mostrar los mensajes
    if(screen.width<992){
        document.getElementById('opcionMensajes').style.display="none";
        document.getElementById('scrollContainer').style.display="block";
    }
    //fin de la prueba de codigo

}





















//elimina etiquetas de un objeto
function stripHtmlTags(elemento) {
    return elemento.textContent || elemento.innerText;
    //asda
}

//funcion que me devuelve el id segun el nombre
function idItem(name) {
    for (var key in jsonListUser) {

        if (jsonListUser[key].name_bussines == name) {
            return key;
        }
    }
    return console.log("Este usuario no se encuentra en la lista de usuarios");
}

//funcion ke devuelve el nombre segun el id

function nameBussines(id) {
    for (var key in jsonListUser) {
        if (key == id) {
            return jsonListUser[key].name_bussines;
        }
    }
    return "error";
}
//funcion ke devuelve la url de la imagen de usuario segun el id
function urlImg(id) {
    for (var key in jsonListUser) {
        if (key == id) {
            return jsonListUser[key].url_img;
        }
    }
    return "error";
}
//esta funcion me mostrara todos los mensajes ke se tubo con un usuario en espesifico
function mostrarMensajesChat() {
    //borro el chat
    //console.log("ejecutaando");
    var mensajes = "";
    mensajes += "<br><br><br>";
    //console.log(id_contact_send);
    try {
        var jsonT = jsonChat[id_contact_send];

        var fecha = "0/0/0";
        for (var k in jsonT) {
            var nombre = nameBussines(jsonT[k].id);
            var hora = jsonT[k].hours;
            var mensaje = jsonT[k].message;
            var urlImgU = urlImg(jsonT[k].id + "");
            //reviso la fecha del mensaje para ponerlo como info en el chat
            if (fecha != jsonT[k].date) {
                fecha = jsonT[k].date;
                mensajes += "<center><br><br><div style='color:gray;'>" + jsonT[k].date + "</div><br><br></center>";
            }
            viewedMessage(k + "");
            if (urlImgU != "") {
                if (id.value != jsonT[k].id) {
                    //mensajes recibidos
                    mensajes += "<li style='width:100%'><div class='msj macro'><div class='avatar'><img class='img-circle' style='width:100%;' src='" + urlImgU + "'></div><div class='text text-l'><p><h4>" + nombre + "</h4></p><p><h5>" + mensaje + "</h5></p><p><small>" + hora + "</small></p></div></div></li>";
                } else {
                    //menssajes enviados
                    mensajes += "<li style='width:100%;'><div class='msj-rta macro' style='margin-right: 10px;'><div class='text text-r'><p><h4>Yo</h4></p><p><h5>" + mensaje + "</h5></p><p><small>" + hora + "</small></p></div><div class='avatar' style='padding:0px 0px 0px 10px !important'><img class='img-circle' style='width:100%;' src='" + urlImgU + "'></div></div></li>";
                }
            } else {
                if (id.value != jsonT[k].id) {

                    //mensajes recibidos
                    mensajes += "<li style='width:100%'><div class='msj macro'><div class='avatar'><img class='img-circle' style='width:100%;' src='https://ind.proz.com/zf/images/default_user_512px.png'></div><div class='text text-l'><p><h4>" + nombre + "</h4></p><p><h5>" + mensaje + "</h5></p><p><small>" + hora + "</small></p></div></div></li>";
                } else {
                    //menssajes enviados
                    mensajes += "<li style='width:100%;'><div class='msj-rta macro' style='margin-right: 10px;'><div class='text text-r'><p><h4>Yo</h4></p><p><h5>" + mensaje + "</h5></p><p><small>" + hora + "</small></p></div><div class='avatar' style='padding:0px 0px 0px 10px !important'><img class='img-circle' style='width:100%;' src='https://ind.proz.com/zf/images/default_user_512px.png'></div></div></li>";
                }
            }
        }
        mensajes += "<br><br><br><br><br>";
      //  console.log("aqui deberia de terminar");
        document.getElementById('messagesContainer').innerHTML = mensajes;
        //cada ke llega un nuevo mensaje el scroll es envado abajo
        document.getElementById('scrollContainer').scrollTop = document.getElementById('scrollContainer').scrollHeight;
    } catch (e) {
        //console.log(e); 
    }

}

//funcion que observa si el mensaje fue leido y si no le muestra cuantos mensajes tiene sin leer
function viewedMessage(codeMessage) {
    var ref2 = databaseService.ref('chat').child(id.value).child(id_contact_send).child(codeMessage);
    ref2.update({
        viewed: true
    });
}

//evento ke envia un mensaje
function sendMessage(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    //guardo el mensaje en enviados 
    var f = new Date();
    var fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
    var hora;
    var minutos;
    var ho;


    if(f.getMinutes()<10){
        minutos ="0" + f.getMinutes();
    }else{
        minutos=f.getMinutes();
    }

    if(f.getHours()<10){
        ho="0"+f.getHours();
    }else{
        ho=f.getHours();
    }
    hora=ho+":"+minutos;

    var l;
    try {
        var jsonTlog = jsonChat[id_contact_send];
        l = Object.keys(jsonTlog).length;
    } catch (e) {
        l = 0;
    }

    if (tecla == 13) {
        var referencia1 = databaseService.ref('chat').child(id.value).child(id_contact_send).child(idNewMessage((l + 1) + ''));
        var referencia2 = databaseService.ref('chat').child(id_contact_send).child(id.value).child(idNewMessage((l + 1) + ''));
        referencia1.update({
            date: fecha,
            hours: hora,
            id: id.value,
            message: document.getElementById('enviarCaja').value,
            viewed: true
        });
        referencia2.update({
            date: fecha,
            hours: hora,
            id: id.value,
            message: document.getElementById('enviarCaja').value,
            viewed: false
        });
        document.getElementById('enviarCaja').value = "";
    };
    //console.log("enviado");
}

//funcion que se activa al presionar una tecla en el input de buscar
function buscar(e) {

    //console.log("buscando");
    var b = document.getElementById("search").value;
    var et = "<br>";
    var contador = 0;
    if (b != "") {
        for (var k in jsonListUser) {
            var nombre = (jsonListUser[k].name_bussines).toLowerCase();
            if (nombre.indexOf(b.toLowerCase()) != -1) {
                if (b != "") {
                    console.log(nombre + "; similitud :" + b);
                    var nombre = jsonListUser[k].name_bussines;
                    var descripcion = jsonListUser[k].description;
                    if(viewCircleList(k+'')){
                        if (urlImg(k + "") != "") {
                            et += "<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + urlImg(k + "") + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                        } else {
                            et += "<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                        }
                    }else{
                        if (k != id.value) {
                            if (!verSolicitud(k + '')) {
                                if (urlImg(k + "") != "") {
                                    et += "<div class='col-12'><div class='buttonFriendRequestStyleStyle2' onclick='sendRequest(this)'><i class='fa fa-plus' aria-hidden='true'></i></div><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + urlImg(k + "") + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                                } else {
                                    et += "<div class='col-12'><div class='buttonFriendRequestStyleStyle2' onclick='sendRequest(this)'><i class='fa fa-plus' aria-hidden='true'></i></div><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                                }
                            } else {
                                console.log("entro a true");
                                //en el  caso de ke ya se haya enviado la solicitud de amistad los el boton hara ora funcion distinta que sera la de cancelar la solicitud
                                if (urlImg(k + "") != "") {
                                    et += "<div class='col-12'><div class='buttonFriendRequestStyleStyle2' onclick='sendRequestCancel(this)'><i class='fa fa-minus' aria-hidden='true'></i></div><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + urlImg(k + "") + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                                } else {
                                    et += "<div class='col-12'><div class='buttonFriendRequestStyleStyle2' onclick='sendRequestCancel(this)'><i class='fa fa-minus' aria-hidden='true'></i></div><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                                }
                            }
                            contador++;
                        }
                    }               
                }
            }
        }
        et += "<br><br>";
        document.getElementById('infoMessagesGroup').innerHTML = contador;
        document.getElementById('resultSearch').innerHTML = et;
    } else {
       // console.log("mostrando todos los usuarios");
        mostrarTodos();
    }
}
// esta funcion me mostrara todos los usuaros registrados en open red
function mostrarTodos() {
    //console.log("entro correctamente a mostrar todos");
    var et = "<br>";
    for (var k in jsonListUser) {
        var nombre = jsonListUser[k].name_bussines;
        var descripcion = jsonListUser[k].description;
        //verifico si ya se envio la solisitud de amistad
        //console.log("mostrando estado " + verSolicitud(k + '') + " prueba" + (true));
        //si el usuario ya sta dentro de mis circulos le quito la opcion de enviar solicitud
        if(viewCircleList(k+'')){
            if (urlImg(k + "") != "") {
                et += "<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + urlImg(k + "") + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
            } else {
                et += "<div class='col-12'><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
            }
        }else{
             // verifico de ke mi empresa no aparesca en la lista
            if (k != id.value) {
                //verifico si no se envio la solicitud
                if (!verSolicitud(k + '')) {
                    if (urlImg(k + "") != "") {
                        et += "<div class='col-12'><div class='buttonFriendRequestStyleStyle2' onclick='sendRequest(this)'><i class='fa fa-plus' aria-hidden='true'></i></div><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + urlImg(k + "") + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                    } else {
                        et += "<div class='col-12'><div class='buttonFriendRequestStyleStyle2' onclick='sendRequest(this)'><i class='fa fa-plus' aria-hidden='true'></i></div><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                    }
                } else {
                    console.log("entro a true");
                    //en el  caso de ke ya se haya enviado la solicitud de amistad los el boton hara ora funcion distinta que sera la de cancelar la solicitud
                    if (urlImg(k + "") != "") {
                        et += "<div class='col-12'><div class='buttonFriendRequestStyleStyle2' onclick='sendRequestCancel(this)'><i class='fa fa-minus' aria-hidden='true'></i></div><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + urlImg(k + "") + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                    } else {
                        et += "<div class='col-12'><div class='buttonFriendRequestStyleStyle2' onclick='sendRequestCancel(this)'><i class='fa fa-minus' aria-hidden='true'></i></div><div class='viewMessage' onclick='selectedItem(this)'><div><div class='viewContact'><img src='https://ind.proz.com/zf/images/default_user_512px.png' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div></div>";
                    }
                }
            }
        }
    

    }
    et += "<br><br>";
    document.getElementById('infoMessagesGroup').innerHTML = "(Mostrando todos)";
    document.getElementById('resultSearch').innerHTML = et;
    //console.log("termino correctamente la funcion");
}
//funcion ke observa si ya se envio la solicitud

function verSolicitud(name) {
    //console.log("\n\n\n\n entro correctamente y el nombre es " + name);
    try {
        //console.log("entro en el try");
        var jsonTemporal = jsonFriendRequestAll[name];
       // console.log(jsonTemporal);
        for (var key in jsonTemporal) {
            if (key + "" == id.value) {
          //      console.log('enviaste solicitud a ' + name);
                return true;
            }
        }
    } catch (e) { return false; };
    return false;
}
//funcion que calcela la solicitud
function sendRequestCancel(name) {
    //console.log(name.parentNode.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    var nombre = stripHtmlTags(name.parentNode.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    var refCancelarPeticion = databaseService.ref('friendRequest').child(idItem(nombre)).child(id.value);
    refCancelarPeticion.remove();
    console.log("La solicitud de amistad fue enviada correctamente");
}
//funcion que crea el nuevo id para el nuevo mensaje
function idNewMessage(id) {
    if (id < 10) {
        return "message0" + id;
    } else {
        return "message" + id;
    }
}

//funcion ke envia la solicitud de amistad
function sendRequest(name) {
    console.log(name.parentNode.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    var nombre = stripHtmlTags(name.parentNode.childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    var refEnviarPeticion = databaseService.ref('friendRequest').child(idItem(nombre)).child(id.value);
    refEnviarPeticion.update({
        lagree: false,
        toRefuse: false
    });
    console.log("La solicitud de amistad fue enviada correctamente");
}
// fin de la funcion ke envia la peticion

//con esta funncion mostramos las peticiones de amistad recibidas
function mostrarPeticiones() {
    var dat = "<br><br>";
    var info = 0;
    //console.log(jsonFriendRequest);
    for (var key in jsonFriendRequest) {
        console.log(key);
        console.log("petion de amistad de :" + key);
        console.log("nombre" + nameBussines(key));
        var nombre = nameBussines(key + '');
        console.log("descripcion " + descriptionId(key + ''));
        var descripcion = "";
        descripcion = descriptionId(key + '');
        var imagen = "";
        if (urlImg(key) == "") {
            imagen = "https://ind.proz.com/zf/images/default_user_512px.png";
        } else {
            imagen = urlImg(key);
        }
        dat += "<div class='col-12'><div class='viewMessage selectedItem' onclick='selectedItem(this)'><div><div class='viewContact'><img src='" + imagen + "' class='perfil' alt=''><div class='contacDat'><div class='nameContact'><h4>" + nombre + "</h4></div></div></div><div class='message'><h5>" + descripcion + "</h5></div></div></div>    <div id='opcionesAceptar' style='width:98px; float:right;margin-top:-20px'>    <button onclick='acceptPetition(this)' class='buttonFriendRequestStyle' style='margin-left:10px;'><i class='fa fa-check' aria-hidden='true'></i></button><button onclick='toRefuse(this)' class='buttonFriendRequestStyle'><i class='fa fa-minus' aria-hidden='true'></i></button></div></div>";
        dat += "<br><br>";
        info++;
    }
    dat += "<br><br>";
    document.getElementById('infoFrienRequest').innerHTML = info;
    document.getElementById("viewMessages2").innerHTML = dat;
}
//funcion que me devuelve la descripcion de un item
function descriptionId(i) {
    var itemTemporal = jsonListUser[i];
    return itemTemporal['description'];
}


//funcion que acepta la peticion de aamistad y agrega al usuario a tus circulos
function acceptPetition(obj){
    var nombre=stripHtmlTags(obj.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    console.log(nombre);
    //console.log(obj);
    var refFriendRequestTorefuse=databaseService.ref('friendRequest').child(id.value).child(idItem(nombre+''));
    refFriendRequestTorefuse.remove();
    //agrega este contacto en mis circulos
    var refBusiness_circleAdd=databaseService.ref('business_circle').child(id.value).child(idItem(nombre+''));
    var refBusiness_circleAdd2=databaseService.ref('business_circle').child(idItem(nombre+'')).child(id.value);
    //agrego mi contacto en sus circulos
    try{
        refBusiness_circleAdd2.update({
            name_bussines:nameBussines(id.value)+"",
            description:descriptionId(id.value)+""
        });
        console.log("se agrego mi contacto a sus circulos");
    }catch(e){};
    try{
        refBusiness_circleAdd.update({
            name_bussines:nombre,
            description:descriptionId(idItem(nombre+''))
        });
        console.log("se agrego a mi circulo");
    }catch(e){};

    console.log("se agrego correctamente a tus circulos");
}


//funcion que rechaza la peticion de amistad
function toRefuse(obj) { 
    var nombre=stripHtmlTags(obj.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
    console.log(nombre);
    var refFriendRequestTorefuse=databaseService.ref('friendRequest').child(id.value).child(idItem(nombre));
    refFriendRequestTorefuse.remove();
    console.log("funcion de borrar item terminado");
}


//verifico si el usuario ya sta en mi circulo
function viewCircleList(id){
   //console.log(jsonBusiness_circle);
    try{
        for(var k in jsonBusiness_circle){
            if(k==id){
                return true;
            }
        }
        return false;
    }catch(e){}
    return false;
}





//eventos click de las opciones del chat
document.getElementById("buttonContact").addEventListener("click", mostrarContactos);
document.getElementById("buttonMessagge").addEventListener("click", mostrarMensajes);
document.getElementById("buttonMessageGroup").addEventListener("click", mostrarMensajesGrupos);
document.getElementById("buttonFriendRequest").addEventListener("click", mostrarSolicitudes);
//evento enter para el imput 
document.getElementById("enviarCaja").addEventListener("keypress", sendMessage);

//evento del input de buscar
document.getElementById("search").addEventListener("keyup", buscar);





function mostrarContactos() {
    document.getElementById("contact").className = "show";
    document.getElementById("myMessages").className = "hide";
    document.getElementById("myMessagesGroup").className = "hide";
    document.getElementById("friendRequest").className = "hide";

    document.getElementById("buttonContact").className = "col-xs-3 col-sm-3 col-md-3 optionButton selected";
    document.getElementById("buttonMessagge").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessageGroup").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonFriendRequest").className = "col-xs-3 col-sm-3 col-md-3 optionButton";

};

function mostrarMensajes() {
    document.getElementById("contact").className = "hide";
    document.getElementById("myMessages").className = "show";
    document.getElementById("myMessagesGroup").className = "hide";
    document.getElementById("friendRequest").className = "hide";

    document.getElementById("buttonContact").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessagge").className = "col-xs-3 col-sm-3 col-md-3 optionButton selected";
    document.getElementById("buttonMessageGroup").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonFriendRequest").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
};

function mostrarMensajesGrupos() {
    document.getElementById("contact").className = "hide";
    document.getElementById("myMessages").className = "hide";
    document.getElementById("myMessagesGroup").className = "show";
    document.getElementById("friendRequest").className = "hide";

    document.getElementById("buttonContact").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessagge").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessageGroup").className = "col-xs-3 col-sm-3 col-md-3 optionButton selected";
    document.getElementById("buttonFriendRequest").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
};

function mostrarSolicitudes() {
    document.getElementById("contact").className = "hide";
    document.getElementById("myMessages").className = "hide";
    document.getElementById("myMessagesGroup").className = "hide";
    document.getElementById("friendRequest").className = "show";

    document.getElementById("buttonContact").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessagge").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonMessageGroup").className = "col-xs-3 col-sm-3 col-md-3 optionButton";
    document.getElementById("buttonFriendRequest").className = "col-xs-3 col-sm-3 col-md-3 optionButton selected";
  
};


window.onbeforeunload = salir;
 

function salir()
{
    myOfLine();
}

function tono(){
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'audio/ding.mp3');
    audioElement.play();
}
