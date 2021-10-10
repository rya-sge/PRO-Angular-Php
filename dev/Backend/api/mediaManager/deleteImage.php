<?php
/**
Date de création : 04.05.2021
Dernier contributeur : Dylan Canton
Groupe : PRO-A-07
Description : Fichier pour supprimer une image dans la BDD
 */

require_once '../../headers.php';
require_once '../../constante.php';
include_once SERVER_PROTECTED;
include_once SERVER_DB;
include_once SECURITY_FUNCTIONS;

$data = json_decode(file_get_contents("php://input"));
$idMedia = checkInt("$data", 'idMedia');

// Récupération de l'ID de l'institution
$id = $user->getId();


// Récupération du nom du fichier
$sql = "SELECT nomFichier FROM media WHERE idMedia = :idMedia";
// Préparation de la requête (sanitize, etc.)
$query = $con->prepare($sql);
$query->bindValue(':idMedia', $idMedia);
// Exécution de la requete
if($query->execute()) {
    $response = $query->fetch(PDO::FETCH_ASSOC);
} else {
    http_response_code(404);
    return;
}

$imageName = $response['nomFichier'];

// 1. Suppression de l'entrée de l'image dans la BDD
$sql = "DELETE FROM media WHERE idMedia = :data";

$query = $con->prepare($sql);
$query->bindValue(':data', $data);

if($query->execute())
{
    // 2. Suppression de l'image dans le backend si suppression dans BDD a réussi

    // Suppression de l'image
    unlink(SERVER_URL_MEDIA . "/" . $id . "/visites/" . $imageName);
    http_response_code(200);
    return;
}
else
{
    http_response_code(404);
    return;
}