<?php
/**
Date de création : 14.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description : Récupération d'une institution privée
 */
require_once '../../headers.php';
require_once '../../constante.php';
require_once SERVER_PROTECTED;
require_once SERVER_DB;
require_once SERVER_URL . '/modele/profile.php';
// -----------------------------

 // Vérif que l'utilisateur est bien une institution
if(! $user->isIsInstitution())
{
    http_response_code(500);
    return;
}

$id = $user->getId();

//$id = 1;
// Récupération de l'institution
$institution = getInstitution($id, $con, false);

// Aucun résultat dans la BDD
if(empty($institution)){
   echo json_encode($institution);
   http_response_code('404');
   return;
}

// Récupération du domaine s'il y en a un
$domain_id = $institution['domaine_id'];
if(! empty($domain_id)){
    $domain = getDomain($domain_id, $con);
    $institution['domaine'] = $domain['nom'];
}
else {
    $institution['domaine'] = "";
}
unset($institution['domaine_id']);

// Récupération de la ville s'il y en a une
$city_id = $institution['ville_id'];
if(! empty($city_id)){
    $city = getCity($city_id, $con);
    $institution['ville'] = $city;
}
else { // nécessaire pour la conversion en objet Instituion
    $institution['ville']['npa'] = "";
    $institution['ville']['nom'] = "";
}
unset($institution['ville_id']);

// Réponse
http_response_code(202);
echo json_encode($institution);

