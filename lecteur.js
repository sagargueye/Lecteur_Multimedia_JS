window.addEventListener("load", ready);

/*********************************************************/	

function ready(){
	var arraySRCvideo = new Array( "nature.mp4","gateau.mp4", "brico.mp4", "gateau.ogg","cuisine.mp4");
	var mavideo=document.getElementById('idvideo');
	var btLecteurAuto=document.getElementById("bouton");
	var list=document.getElementById('tableau');
	// lecture video par defaut
	mavideo.setAttribute('src', arraySRCvideo[0]);
	// mavideo.play();

	function fontion_setInterval(){
		var time=mavideo.currentTime;
		var dureevideo= mavideo.duration;
		document.querySelector('#progressTime').textContent = formatTime(time,dureevideo);
		var idligne = document.getElementById("tableau");
		var arrayLignes=idligne.rows; //l'array est stocké dans une variable
		var longueur = arrayLignes.length;//on peut donc appliquer la propriété length
		var i=0; //on définit un incrémenteur qui représentera la clé
		//boucle pour alterner les couleurs de la playlist
		while(i<longueur){
			if(i % 2 == 0)//si la clé est paire
			{
				arrayLignes[i].style.backgroundColor = "#EDF3F6";
			}
			else //elle est impaire
			{
				arrayLignes[i].style.backgroundColor = "#D2EBF4";
			}
			i++;
		}
		
	}//fin fontion_setInterval
	setInterval(fontion_setInterval, 1000);// on appelle fontion_setInterval chaque 1seconde
	//appelle des fonctions:
	remplirtab(list,arraySRCvideo );
	clicksurunevideodelalist(mavideo, list);
	lectureAutomatique(btLecteurAuto,mavideo, list);
		
}//fin fonction ready


/*********************************************gestion de la video(control)*******************/

function play(mavideo, control) {
	var player = document.querySelector('#' + mavideo);
		
	if (player.paused) {
		player.play();
		control.src = 'Play2.jpg';
	} else {
		player.pause();	
		control.src = 'pause2.jpg';
	}
}
function resume(mavideo) {
		var player = document.querySelector('#' + mavideo);
		player.currentTime = 0;
		player.pause();
	}
function volume(mavideo, vol) {
	var player = document.querySelector('#' + mavideo);
	player.volume = vol;    
}
function update(player) {
    var duration = player.duration;    // Durée totale
    var time     = player.currentTime; // Temps écoulé
    var fraction = time / duration;
    var percent  = Math.ceil(fraction * 100);
    var progress = document.querySelector('#progressBar');
    progress.style.width = percent + '%';
    progress.textContent = percent + '%';

}
//gestion de la durée du video et le temps ecoulé
function formatTime(time,dureevideo) {
    var hours = Math.floor(time / 3600);
	var hoursvideo=Math.floor(dureevideo / 3600);
    var mins  = Math.floor((time % 3600) / 60);
	var minsvideo  = Math.floor((dureevideo % 3600) / 60);
    var secs  = Math.floor(time % 60);
    if (secs < 10) {
        secs = "0" + secs;
    } 
	var secsvideo = Math.floor(dureevideo % 60);
    if (secsvideo < 10) {
        secsvideo = "0" + secsvideo;
    }
	if (minsvideo < 10) {
            minsvideo = "0" + minsvideo;
    }
    if (hours) {
        if (mins < 10) {
            mins = "0" + mins;
        }
		if (hoursvideo) {
			return hours + ":" + mins + ":" + secs+"/"+hoursvideo+ ":" + minsvideo + ":" + secsvideo; // hh:mm:ss
		}else{
			return hours + ":" + mins + ":" + secs+"/"+ minsvideo + ":" + secsvideo; // hh:mm:ss
		}
    } else {
		if (hoursvideo) {
			return mins + ":" + secs+"/"+hoursvideo+ ":" + minsvideo + ":" + secsvideo; // mm:ss
		}else{
			return mins + ":" + secs+"/"+ minsvideo + ":" + secsvideo; // mm:ss
		}
    }
}

//click sur la barre de progression pour avancer la video
function clickProgress(idPlayer, control, event) {
    var parent = getPosition(control);    // La position absolue de la progressBar
    var target = getMousePosition(event); // L'endroit de la progressBar où on a cliqué
    var player = document.querySelector('#' + idPlayer);
    var x = target.x - parent.x; 
    var wrapperWidth = document.querySelector('#progressBarControl').offsetWidth;
    var percent = Math.ceil((x / wrapperWidth) * 100);    
    var duration = player.duration;
    player.currentTime = (duration * percent) / 100;
}
function getMousePosition(event) {
    return {
        x: event.pageX,
        y: event.pageY
    };
}
function getPosition(element){
    var top = 0, left = 0;
    do {
        top  += element.offsetTop;
        left += element.offsetLeft;
    } while (element = element.offsetParent);
    return { x: left, y: top };
}
//*********************************************gestion playlist************************************/

//on remplir le tableau playlist avec notre array de video 
function remplirtab(playlist, arraySRCvideo){
	var r = playlist.rows;
	var longueur=r.length;
	var i;
	var indice=0;
	for(i=1;i<longueur; i++){
		
		playlist.rows[i].cells[0].innerHTML = indice+1;indice++;
		//verifier pour la taille de liste des video
		if(i-1<arraySRCvideo.length){
			playlist.rows[i].cells[1].innerHTML = arraySRCvideo[i-1];
		}else{playlist.rows[i].cells[1].innerHTML = "fin des videos";}
	}
	
}
/***********************************lecture automatique de la video suivante**********************************/

function lectureAutomatique(bt,mavideo, list){
	bt.addEventListener("click", function (){
		console.log("a");
		if(bt.innerHTML=="desactiver"){
				console.log("b");
			bt.innerHTML="activer";
			bt.style.borderColor='#59cd27';
			var f= setInterval(function (){
				//comparaison de la duree ecoulée avec celle de la video
				if(mavideo.currentTime==mavideo.duration){
					LectureNextVideo(mavideo, list);
						console.log("c");
				}
			}, 1000);
			//si on reclick de nouveau sur le bouton, on delete le setinterval 
			//et le bouton passe en desactive
				bt.addEventListener("click", function (){
					 clearInterval(f);
					 bt.innerHTML=="desactiver";
				});
			console.log('hey jpasse ici on active');
		}else{
			console.log("d");
			bt.style.borderColor='#d34836';
			bt.innerHTML="desactiver";
			console.log('hey jpasse ici on desactive');
			console.log("e");
		}
	});
}

/*******************gestion des boutons suivants et precedents********************/

//lecture automatique de la video suivante 
function LectureNextVideo(idvideo, playlist){

	//on récupere l'indice de la video en lecture dans le playlist
	var src=idvideo.getAttribute("src");
	var indiceDuVideoDansPlaylist;
	var arrayLignes =playlist.rows;
	for(var i=1;i<arrayLignes.length; i++)
	{
		if(playlist.rows[i].cells[1].innerHTML ==src){
			indiceDuVideoDansPlaylist=i;
			console.log(indiceDuVideoDansPlaylist);
		}
	}
	//si la video est la derniere sur la liste alors on lit la 1ere video de la liste
	if(indiceDuVideoDansPlaylist==(i-1)){
		idvideo.setAttribute("src", playlist.rows[1].cells[1].innerHTML  );
		console.log(playlist.rows[1].cells[1].innerHTML );
	}else//sinon on lit la suivante
	{
		var x=indiceDuVideoDansPlaylist+1;//ya un bleme ici
		console.log(playlist.rows[x].cells[1].innerHTML );
		idvideo.setAttribute("src", playlist.rows[x].cells[1].innerHTML );
	}
	console.log(idvideo.getAttribute("src"));
	idvideo.play();
	
	

}

function LecturePrecedentVideo(idvideo, playlist){
		//on récupere l'indice de la video en lecture dans le playlist
	var src=idvideo.getAttribute("src");
	var indiceDuVideoDansPlaylist;
	var arrayLignes =playlist.rows;
	
	for(var i=arrayLignes.length-1;i>0; i--)
	{
		console.log(arrayLignes.length);
		console.log(i);
		if(playlist.rows[i].cells[1].innerHTML ==src){
			indiceDuVideoDansPlaylist=i;
			console.log(indiceDuVideoDansPlaylist);
		}
	}
	//si la video est la premiere sur la liste alors on lit la derniere video de la liste
	if(indiceDuVideoDansPlaylist==1){
		idvideo.setAttribute("src", playlist.rows[arrayLignes.length-1].cells[1].innerHTML  );
		console.log(1 );
	}else//sinon on lit la precedente
	{
		var x=indiceDuVideoDansPlaylist-1;
		console.log(2 );
		idvideo.setAttribute("src", playlist.rows[x].cells[1].innerHTML );
	}
	console.log(idvideo.getAttribute("src"));
	idvideo.play();
}

/***********************************lancer une video de la playlist avec un click**********************************/
function clicksurunevideodelalist(mavideo, list){
	var arrayLignes=list.rows; //l'array est stocké dans une variable
	var longueur = arrayLignes.length;
	for(var i=1;i<longueur; i++){
		var currentRows=list.rows[i];
		ajoutEventPlaylist(currentRows,mavideo);
	}
}

function ajoutEventPlaylist(currentRows, mavideo){
	//evenement sur les elements du playlst
	currentRows.addEventListener("click",  function() {
				var src = currentRows.cells[1].innerHTML;
				mavideo.setAttribute("src",src);
				mavideo.play();
		});
}
/****************************deplacer une ligne de la playlist*************************************/
/*
function eventdeplacerligne(source, cible, list){	
	var sourceRows=list.rows[source];
	var ciblerows=list.rows[cible];
	sourceRows.addEventListener("mousedown", function(){
		ciblerows.addEventListener("mouseup", function(){
			deplacerLigne(source, cible, list);
		});
		
	});
}	


function dp(list){
	var longueur = list.rows.length;
	var i=0;
	for(var i=1;i<longueur; i++){
		eventdeplacerligne(i, i+1, list);
	}
	
}

function deplacerLigne(source, cible, list){
    //on initialise nos variables
    var ligne = list.rows[source];//on copie la ligne
    var nouvelle = list.insertRow(cible);//on insère la nouvelle ligne
    var cellules = ligne.cells;
    //on boucle pour pouvoir agir sur chaque cellule
    for(var i=0; i<cellules.length; i++)
    {
        nouvelle.insertCell(-1).innerHTML += cellules[i].innerHTML;//on copie chaque cellule de l'ancienne à la nouvelle ligne
    }
    //on supprimer l'ancienne ligne
    list.deleteRow(ligne.rowIndex);//on met ligne.rowIndex et non pas source car le numéro d'index a pu changer
}*/
