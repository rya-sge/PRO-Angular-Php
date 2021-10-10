<?php
/**
 * Date de création : 28.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Fonction pour vérifier que l'utilisateur est authentifié sur le site
 * Sources :
 *https://www.techiediaries.com/php-jwt-authentication-tutorial/
 *https://stackoverflow.com/questions/40582161/how-to-properly-use-bearer-tokens
 */



/**
 * Obtenir l'Authorization header
 * Sources : https://stackoverflow.com/questions/40582161/how-to-properly-use-bearer-tokens
 * @return string|null
 */
function getAuthorizationHeader(){
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    }
    else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        // Fix pour des anciennes version d'Android
        // Ce patch fait qu'on ne se préoccupe pas des majuscules
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        //print_r($requestHeaders);
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}



/**
 * Récupérer le token d'accès depuis le header
 * Source : https://stackoverflow.com/questions/40582161/how-to-properly-use-bearer-tokens
 * @return mixed|string
 */
function getBearerToken() {
    $headers = getAuthorizationHeader();
    // HEADER: Get the access token from the header
    if (!empty($headers)) {
        if (preg_match('/bearerToken\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }/*else{ Pour le debug
            return "Le token n'a pas pu être trouvé";
        }*/
    }/*else{ Pour le debug
        return "Aucun header de fourni";
    }*/
    return null;
}





?>
