<?php

include_once 'authentification.php';
include_once 'JwtTokenKey.php';
include_once 'UserToken.php';
//jwt token
require_once dirname(__FILE__) . '/../vendor/autoload.php';


$user = new UserToken();
$jwt = getBearerToken();
$response = array(
    "status" => "success",
    "error" => false,
    "message" =>$jwt
);

/*
 * Attention : les champs data doivent correspond aux champs es token
 */
if(isset($jwt)){
    try {
        $secret_key = new JwtTokenKey();
        $decoded = $secret_key->decodeToken($jwt);
        $user->setId($decoded->data->id);
        $user->setIsInstitution($decoded->data->isInstitution);
        $user->setIsValid($decoded->data->isValid);
        $user->setIsAuthenticated(True);
        $user->setUsername($decoded->data->username);
        // Pour debug
        // Access is granted. Add code of the operation here
        // $decoded_array = (array) $decoded;
        // echo "Decode:\n" . print_r($decoded_array, true) . "\n";
        // $str = "Decode:\n" . print_r($decoded_array, true) . "\n";
        $response = array(
            "status" => "success",
            "error" => false,
            "message" =>array(
                "id"=>$user->getId(),
                "isInstitution"=>$user->isIsInstitution(),
                "isValid" => $user->isIsValid()
            )
        );
    } catch (Exception $e) {
        $error = $e->getMessage();
    }

}else{
    http_response_code(401);
    $error = "Acces refuse. Le token n'a pas pu etre vérifie";
}
?>
