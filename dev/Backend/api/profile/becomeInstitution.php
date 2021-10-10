<?php
/**
Date de création : 03.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description :
-Ce fichier fait le changement du type de compte privé pour devenir une institution
-Dans la BDD, l'entrée dans la table "utilisateur" est déplacée dans la table "institution"
 */

require_once  '../../headers.php';
require_once '../../constante.php';
require_once SERVER_DB;
include_once SERVER_PROTECTED;
include_once SERVER_URL . '/modele/user.php';


function insertInstitutionAccount($id, $con){
    $request = "INSERT INTO institution (id, estValide, typeWatermark) VALUES (? , 0, 2)";
    $con->prepare($request)->execute([$id]);
}

$id = $user->getId();

// Créer l'entrée Institution
insertInstitutionAccount($id, $con);

// Supprimer l'entrée Utilisateur
delUserAccount($id, $con);

// Copier l'image de profil
$image = SERVER_URL_MEDIA . "/default-institution.jpg";
$folder = SERVER_URL_MEDIA . "/$id";
$imageDest = $folder . "/profil.jpg";

// Créer le dossier de l'institution
if(!file_exists($folder)){
    mkdir($folder, 0777, true);
}

copy($image, $imageDest);
