<?php
/**
Date de création : 18.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description : Récupération des informations du watermark d'une institution
 */
require_once '../../headers.php';
require_once '../../constante.php';
include_once SERVER_DB;
include_once SERVER_PROTECTED;
// -----------------------------


function getWatermark($id, $con){
    $sql =  "SELECT typeWatermark AS type, filigrane AS texte FROM institution WHERE id =:id";

    $query = $con->prepare($sql);
    $query->bindValue(':id', $id);

    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

// Vérif que l'utilisateur est bien une institution
if(! $user->isIsInstitution())
{
    http_response_code(500);
    return;
}

$id = $user->getId();

// Récupération du watermark
$watermark = getWatermark($id, $con);

// Réponse
http_response_code(200);
echo json_encode($watermark);

