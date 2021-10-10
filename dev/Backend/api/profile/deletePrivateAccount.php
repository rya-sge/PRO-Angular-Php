<?php
/**
 * Date de création : 13.05.2021
 * Dernier contributeur : David Pellissier
 * Groupe : PRO-A-07
 * Description :
 * Requête pour la suppression d'un compte Privé utilisateur
 */
require_once '../../headers.php';
include_once '../../constante.php';
include_once SERVER_PROTECTED;
include_once SERVER_DB;
include_once SERVER_URL . '/modele/user.php';

if(!$user->isIsInstitution()){
    $id = $user->getId();

    delUserAccount($id, $con);
    delAccount($id, $con);

    http_response_code(200);
}
else{
    http_response_code(400);
}



