<?php

/**
Date de création : 04.05.2021
Dernier contributeur : Dylan Canton
Groupe : PRO-A-07
Description : Récupération des liens d'images sur le serveur Backend
 */

require_once '../../headers.php';
require_once '../../constante.php';
include_once SERVER_PROTECTED;
include_once SERVER_DB;

// URL du dossier contenant les medias du site
$MEDIA_SERVER_URL = SERVER_URL_MEDIA;

// Récupération de l'ID de l'institution
$id = $user->getId();

$urlId = "/".$id."/visites/";

// Tableau pour stocker le résultat de la requête
$images = [];

// Requête SQL
$query = "SELECT idMedia, nomFichier FROM `media` WHERE institution_id = :id";

$stmt = $con->prepare($query);
$stmt->bindValue(':id', $id);

if($stmt->execute()){
    $cr = 0;

    // AJout de chaque ligne du résultat dans un tableau
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
       $images[$cr]['nomFichier'] = SERVER_URL_MEDIA_FRONTEND.$urlId.$row['nomFichier'];
       $images[$cr]['idMedia'] = $row['idMedia'];
       $cr++;
    }

    //Envoie du résultat vers le frontend
    echo json_encode(['data'=>$images]);
}
else{
    $response = array(
       "status" => "error",
       "error" => true,
       "message" => "Error getting images"
    );
    http_response_code(500);
    echo json_encode($response);
}

