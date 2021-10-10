<?php

/**
Date de création : 23.05.2021
Dernier contributeur : Dylan Canton
Groupe : PRO-A-07
Description : Fichier pour récupérer les institutions depuis la BDD
*/

require_once '../../headers.php';
require_once '../../constante.php';
include_once SERVER_DB;

// Tableau pour stocker le résultat de la requête
$institutions = [];

// Requête SQL
$query = "SELECT institution.id, compte.nomProfil FROM institution INNER JOIN compte ON institution.id = compte.id WHERE estValide = 1 ORDER BY id DESC LIMIT 3";

$stmt = $con->prepare($query);
if($stmt->execute()){
    $cr = 0;

    // Ajout de chaque ligne du résultat dans un tableau
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
       $institutions[$cr]['id'] = $row['id'];
       $institutions[$cr]['name'] = $row['nomProfil'];
       $cr++;
    }

    //Envoie du résultat vers le frontend
    echo json_encode(['data'=>$institutions]);
}
else{
    $response = array(
       "status" => "error",
       "error" => true,
       "message" => "Error getting institutions"
    );
    http_response_code(500);
    echo json_encode($response);
}
