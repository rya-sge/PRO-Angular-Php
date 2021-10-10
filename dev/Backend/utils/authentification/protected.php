<?php
/**
 * Date de création : 28.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Récupère le token d'authentification de l'utilisateur
 * Sources :
 * Librairie utilisée pour les tokens : https://github.com/firebase/php-jwt
 */

require_once 'protected_template.php';

if(isset($error)){
    $response = array(
        "status" => "error",
        "error" => true,
        "message" => $error
    );

    echo json_encode($response);
    exit();
}
?>
