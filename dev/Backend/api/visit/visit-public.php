<?php
/**
Date de création : 15.05.2021
Dernier contributeur : Quentin Le Ray
Groupe : PRO-A-07
Description : Fichier pour l'affichage des visites publiques
 * Source : https://github.com/techiediaries/angular-php-example/blob/master/backend/index.php
 */

require_once '../../headers.php';
require_once '../../constante.php';
require_once SERVER_DB;
include_once SERVER_URL . '/modele/getVisit.php';
include_once SECURITY_FUNCTIONS;

if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
    http_response_code(200);
    return;
}

if (isset($_GET['idInstit'])) {
    $idInstit = getIntParam('idInstit');
    // Requête à la DB
    $result = getVisibleVisitsOfOneInstit($_GET['idInstit'], $con);
    if ($result) {
        //Ok
        echo json_encode($result);
    } else {
        //Erreur interne
        http_response_code(500);
    }
} elseif (isset($_GET['idVisit'])) {
    $idVisit = getIntParam('idVisit');

    $result = getFullVisibleVisit($idVisit, $con); //Pour version finale
    if ($result) { //Ok

        // Récupération de l'id de l'institution via la BDD car pas accès à $user
        $idInstit = $result[0]['institution_id'];

        // Met l'url complète de chaque image à afficher.
        for ($i = 0; $i < sizeof($result); $i++) {
            $result[$i]['image'] = SERVER_URL_MEDIA_FRONTEND."/".$idInstit."/visites/".$result[$i]['image'];
            // Suppression car pas besoin en frontend
            unset($result[$i]['institution_id']);
        }
        echo json_encode($result);

    } else { // Erreur interne
        http_response_code(500);
    }

} else {
    http_response_code(400);
}
