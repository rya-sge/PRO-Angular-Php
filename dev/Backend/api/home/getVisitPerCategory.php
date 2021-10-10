<?php

/**
Date de création : 10.05.2021
Dernier contributeur : Dylan Canton
Groupe : PRO-A-07
Description : Fichier pour récupérer les visites d'une catégorie depuis la BDD
*/

require_once '../../headers.php';
require_once '../../constante.php';
include_once SERVER_DB;
include_once SECURITY_FUNCTIONS;

// Récupération des données du frontend (Id de la catégorie)
$idCategory = json_decode(file_get_contents("php://input"));

$idCategory = checkInt($idCategory, "id");

// Tableau pour stocker le résultat de la requête
$visits = [];

// Requête SQL
$query = "SELECT visite.id, visite.titre, visite.description, visite.estVisible
          FROM visite
            INNER JOIN visite_categorie
            ON visite.id = visite_categorie.visite_id
          WHERE visite_categorie.categorie_id = :idCategory AND visite.estVisible = 1";

$stmt = $con->prepare($query);
$stmt->bindValue(':idCategory', $idCategory);

if($stmt->execute()){
    $cr = 0;

    // Ajout de chaque ligne du résultat dans un tableau
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
       $visits[$cr]['id'] = $row['id'];
       $visits[$cr]['title'] = $row['titre'];
       $visits[$cr]['description'] = $row['description'];
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
