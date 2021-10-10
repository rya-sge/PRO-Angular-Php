<?php
/**
Date de création : 25.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description : Headers à inclure dans chaque fichier
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, Authorization, X-Requested-With, Content-Type, Accept");

function exception_handler(){ http_response_code(500); echo("Internal error"); exit; }

// évite que les exceptions soient renvoyées vers le frontend. désactiver pour débugger mais ne pas oublier de remettre
set_exception_handler('exception_handler');

// Activer pour développement localhost uniquement
// Pour éviter l'erreur CORS Preflight

if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
    http_response_code(200);
    exit;
}
// */