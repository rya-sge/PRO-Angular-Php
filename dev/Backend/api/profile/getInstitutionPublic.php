<?php
/**
Date de création : 13.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description : Récupération d'une institution publique
 */
require_once '../../headers.php';
require_once '../../constante.php';
require_once SERVER_DB;
require_once SERVER_URL . '/modele/profile.php';
include_once SECURITY_FUNCTIONS;
// -----------------------------

$data = json_decode(file_get_contents("php://input"));
$id = dataIntParam('id', $data);


// Récupération de l'institution
$institution = getInstitution($id, $con, true);

// Aucun résultat dans la BDD
if(empty($institution)){
    http_response_code('404');
    return;
}

// Récupération du domaine
$domain_id = $institution['domaine_id'];
$domain = getDomain($domain_id, $con);
$institution['domaine'] = $domain['nom'];
unset($institution['domaine_id']);

// Récupération de la ville associée à l'institution
$city_id = $institution['ville_id'];
$city = getCity($city_id, $con);

$institution['ville'] = $city;
unset($institution['ville_id']);

// Réponse
http_response_code(200);
echo json_encode($institution);

