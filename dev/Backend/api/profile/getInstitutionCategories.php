<?php
/**
Date de création : 08.06.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description : Récupération de toutes les catégories associées à une institution publique
 */
require_once '../../headers.php';
require_once '../../constante.php';
require_once SERVER_DB;
include_once SECURITY_FUNCTIONS;
// -----------------------------


function getCategories($id, $con){
    $sql = "SELECT categorie.nom FROM categorie" .
            " INNER JOIN visite_categorie ON categorie.id = visite_categorie.categorie_id" .
            " INNER JOIN visite ON visite_categorie.visite_id = visite.id" .
            " WHERE institution_id = :id";
    $query = $con->prepare($sql);
    $query->bindValue(':id', $id);

    if($query->execute()){
        return $query->fetchAll(PDO::FETCH_COLUMN);
    }

    return null;
}

$data = json_decode(file_get_contents("php://input"));
$id = dataIntParam('id', $data);


// Récupération de l'institution
$cat = getCategories($id, $con);

// Réponse
http_response_code(200);
echo json_encode($cat);

