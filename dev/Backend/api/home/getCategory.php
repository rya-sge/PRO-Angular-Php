<?php

/**
Date de création : 10.05.2021
Dernier contributeur : Dylan Canton
Groupe : PRO-A-07
Description : Fichier pour récupérer les categories depuis la BDD
*/

require_once '../../headers.php';
require_once '../../constante.php';
include_once SERVER_DB;

// Tableau pour stocker le résultat de la requête
$categories = [];

// Requête SQL
$query = "SELECT id, nom FROM `categorie`";

$stmt = $con->prepare($query);
if($stmt->execute()){
    $cr = 0;

    // AJout de chaque ligne du résultat dans un tableau
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
       $categories[$cr]['id'] = $row['id'];
       $categories[$cr]['name'] = $row['nom'];
       $cr++;
    }

    //Envoie du résultat vers le frontend
    echo json_encode(['data'=>$categories]);
}
else{
    $response = array(
       "status" => "error",
       "error" => true,
       "message" => "Error getting categories"
    );
    http_response_code(500);
    echo json_encode($response);
}
