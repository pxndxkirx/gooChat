function detectar(){
	console.log("cambio detectado");
	//con esta funcion escondo chat;
	if(screen.width<992){
		document.getElementById('scrollContainer').style.display="none";
	}else{
		document.getElementById('scrollContainer').style.display="block";		
	}
}
detectar();
window.onresize = detectar;