<?php
/**
Date de création : 04.05.2021
Dernier contributeur : Dylan Canton
Groupe : PRO-A-07
Description : Fichier pour modifier les informations d'une image
 */

require_once '../../headers.php';
require_once '../../constante.php';
require_once SERVER_DB;
include_once SECURITY_FUNCTIONS;

$data = json_decode(file_get_contents("php://input"));

$id = dataIntParam("idMedia", $data);

$sql = "UPDATE `media` SET `titre`=:title,`auteur`=:author,`description`=:description WHERE idMedia = :id";

$query = $con->prepare($sql);
$query->bindValue(':id', $id);
$query->bindValue(':title', $data->title);
$query->bindValue(':author', $data->author);
$query->bindValue(':description', $data->description);


if($query->execute())
{
    http_response_code(200);
}
else
{
    http_response_code(404);
}

