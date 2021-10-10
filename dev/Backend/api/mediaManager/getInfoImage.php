<?php

/**
Date de création : 10.05.2021
Dernier contributeur : Dylan Canton
Groupe : PRO-A-07
Description : Fichier pour récupérer les informations d'une image depuis la BDD
*/

require_once '../../headers.php';
require_once '../../constante.php';
require_once SERVER_DB;
include_once SECURITY_FUNCTIONS;

// Récupération des données du frontend
$data = json_decode(file_get_contents("php://input"));
$idMedia = checkInt("$data", 'idMedia');

// Tableau pour stocker le résultat de la requête
$images = [];

// Requête SQL
$query = "SELECT titre, auteur, description FROM `media` WHERE idMedia = :data";

$stmt = $con->prepare($query);
$stmt->bindValue(':data', $data);

if($stmt->execute()){
    $cr = 0;

    // AJout de chaque ligne du résultat dans un tableau
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
       $images[$cr]['titre'] = $row['titre'];
       $images[$cr]['auteur'] = $row['auteur'];
       $images[$cr]['description'] = $row['description'];
       $cr++;
    }

    //Envoie du résultat vers le frontend
    echo json_encode(['data'=>$images]);
}
else{
    $response = array(
       "status" => "error",
       "error" => true,
       "message" => "Error getting images infos"
    );
    http_response_code(500);
    echo json_encode($response);
}
