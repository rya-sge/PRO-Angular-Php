<?php

/**
Date de création : 23.05.2021
Dernier contributeur : Dylan Canton
Groupe : PRO-A-07
Description : Fichier pour récupérer les visites depuis la BDD
*/

require_once '../../headers.php';
require_once '../../constante.php';
include_once SERVER_DB;

// Tableau pour stocker le résultat de la requête
$visits = [];

// Requête SQL
$query = "SELECT id, titre FROM visite WHERE estVisible = 1 ORDER BY id DESC LIMIT 3";

$stmt = $con->prepare($query);
if($stmt->execute()){
    $cr = 0;

    // AJout de chaque ligne du résultat dans un tableau
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
       $visits[$cr]['id'] = $row['id'];
       $visits[$cr]['name'] = $row['titre'];
       $cr++;
    }

    //Envoie du résultat vers le frontend
    echo json_encode(['data'=>$visits]);
}
else{
    $response = array(
       "status" => "error",
       "error" => true,
       "message" => "Error getting visits"
    );
    http_response_code(500);
    echo json_encode($response);
}
