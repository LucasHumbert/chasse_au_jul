/* 
    Auteur		: Lucas HUMBERT
    Date créat.	: 25/05/2020
    Description	: Script simulant une chasse au trésor avec des évenement placées aléatoirement. Le but est de sauver le trésor (JuL).
*/


//initialisation de certaines variables
let coordonneeX = Math.floor(Math.random() * 8);
let coordonneeY = Math.floor(Math.random() * 8);                        //tirage aléatoire des coordonnées du trésor
var idTresor = String(coordonneeX) + '-' + String(coordonneeY);         //id du trésor en fonction de ses coordonnées
let compteur = 0;                                                       
let monTableau = Tableau2D(8, 8);                                       
let tableau = "<table id='fondtable'><tr>";
let commentaire = "JuL n'a plus d'essence dans son T-MAX. Il faut l'aider<br />";
let bruitageJul = new Audio('ressources/WESH ALORS.mp3');
let bruitageRageux = new Audio('ressources/Canard.mp3');                        



//création des 2 groupes de rageux ayant des coordonnées différentes de celles du trésor
let coordonneeXRageux1 = 0;
let coordonneeYRageux1 = 0;
do {
    coordonneeXRageux1 = Math.floor(Math.random() * 8);
    coordonneeYRageux1 = Math.floor(Math.random() * 8); 
} while (coordonneeXRageux1 == coordonneeX && coordonneeYRageux1 == coordonneeY);
let idRageux1 = String(coordonneeXRageux1) + '-' + String(coordonneeYRageux1);
//console.log("id rageux 1 : " + idRageux1);

let coordonneeXRageux2 = 0;
let coordonneeYRageux2 = 0;
do {
    coordonneeXRageux2 = Math.floor(Math.random() * 8);
    coordonneeYRageux2 = Math.floor(Math.random() * 8); 
} while (coordonneeXRageux2 == coordonneeX && coordonneeYRageux2 == coordonneeY || coordonneeXRageux2 == coordonneeXRageux1 && coordonneeYRageux2 == coordonneeYRageux1);
let idRageux2 = String(coordonneeXRageux2) + '-' + String(coordonneeYRageux2);
//console.log("id rageux 2 : " + idRageux2);




//fonction qui renvoit un tableau 2D
function Tableau2D(x, y) {
    var array2D = new Array(x);
    for (var i = 0; i < array2D.length; i++) {
        array2D[i] = new Array(y);
    }
    return array2D;
}


//fonction qui vérifie que la page soit complètement chargée avant de lancer la fonction initTab
window.onload = function() { initTab(); }


//fonction qui créer le tableau et place le trésor
function initTab() {
    monTableau[coordonneeX][coordonneeY] = "";
    //console.log("id tresor : " + idTresor);

    
    for (y = 0; y < monTableau.length; y++){
        tableau = tableau + "<tr>";
            for (i = 0; i < monTableau.length; i++){
                if (monTableau[y][i] != monTableau[coordonneeX][coordonneeY]){
                    monTableau[y][i] = " ";
                }
                tableau = tableau + "<td id=" + String(y) + "-" + String(i) + " onclick='choix(this.id)'; >" + monTableau[y][i] + "</td>";  //definir les id de chaques cases du tableau
            }
        tableau = tableau + "</tr>";
    }
    tableau = tableau + "</tr></table>"
    document.getElementById("emplacementTable").innerHTML = tableau;
}


//fonction qui récupère l'ID de la case cliquée et traite le résultat
function choix(id){
    caseTable = document.getElementById(id);
    //si clique sur le trésor
    if (id == idTresor){
        
        caseTable.setAttribute('class', 'good');        //changement de couleur
        console.log("Gagné");

        for (y = 0; y < monTableau.length; y++){
            for (i = 0; i < monTableau.length; i++){
                let caseId = y + "-" + i;
                document.getElementById(caseId).setAttribute('onclick', '');        //boucle qui permet de bloquer toutes les cases apres avoir trouvé le trésor
            }        
        }
        compteur++;
        afficherCompteur(compteur);
        afficherVictoire(); 
        bruitageJul.play();         //joue l'audio JuL
    
    //si clique sur un groupe de rageux
    } else if (id == idRageux1 || id == idRageux2){

        caseTable.setAttribute('class', 'rageux');      //changement de couleur
        caseTable.setAttribute('onclick', '');          //désactivation du onclick de la case pour empêcher le joueur de cliquer une nouvelle fois dessus
        compteur = compteur + 3;
        afficherCompteur(compteur);
        afficherCommentaire("</br><strong>JuL:</strong> T'es tombé sur un groupe de rageux <br /> <img src='ressources/rageux.jpg' classe='image' /><br /> Tu perds 3 minutes !<br /></br>");
        bruitageRageux.play();          //joue l'audio rageux
    
    //si clique sur la bonne ligne
    } else if (id == coordonneeX + "-0" || id == coordonneeX + "-1" || id == coordonneeX + "-2" || id == coordonneeX + "-3" || id == coordonneeX + "-4" || id == coordonneeX + "-5" || id == coordonneeX + "-6" || id == coordonneeX + "-7"){
        
        caseTable.setAttribute('class', 'ligne');       //changement de couleur
        caseTable.setAttribute('onclick', '');          //désactivation du onclick de la case
        compteur++;
        afficherCompteur(compteur);
        afficherCommentaire("<strong>JuL:</strong> La ligne est bonne !<br />");

    //si clique sur la bonne colonne
    } else if (id == "0-" + coordonneeY || id == "1-" + coordonneeY || id == "2-" + coordonneeY || id == "3-" + coordonneeY || id == "4-" + coordonneeY || id == "5-" + coordonneeY || id == "6-" + coordonneeY || id == "7-" + coordonneeY){

        caseTable.setAttribute('class', 'colonne');     //changement de couleur
        caseTable.setAttribute('onclick', '');          //désactivation du onclick de la case
        compteur++;
        afficherCompteur(compteur);
        afficherCommentaire("<strong>JuL:</strong> T'es sur la bonne colonne poto !<br />");

    //si clique sur une mauvaise case
    } else {


        caseTable.setAttribute('class', 'bad');         //changement de couleur
        caseTable.setAttribute('onclick', '');          //désactivation du onclick de la case         
        compteur++;
        afficherCompteur(compteur);
        afficherCommentaire("<strong>JuL:</strong> Plus vite ! <br />");
    }
}


//affche le compteur
function afficherCompteur(valeur){
    document.getElementById("compte").innerHTML = valeur;
}


//affiche les commentaires
function afficherCommentaire(message){

    commentaire = message + commentaire;

    document.getElementById("emplacementCommentaires").innerHTML = commentaire;
}


//affiche la fin du jeu ainsi qu'un bouton qui reload la page pour rejouer
function afficherVictoire(){
    message = "<img src='ressources/JuL.jpg' classe='image' /><br /><br /><strong>Bravo ! Tu as sauvé JuL en " + compteur + " minutes !</strong><br /><br /> <button onclick='window.location.reload(false)'> Rejouer </button>"
    document.getElementById("emplacementCommentaires").innerHTML = message;
}