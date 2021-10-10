<?php
/**
 * Date de création : 06.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * -Ce fichier vérifie le token de l'utilisateur envoyé en POST
 * -Si il est valide, renvoie une réponse http avec le token de session, sinon renvoie une erreur http avec le code 200
 *
 * Remarque :
 *
 * Sources :
 * la vérification du token facebook se fait avec la librairie officiel de facebook
 * https://github.com/facebookarchive/php-graph-sdk/tree/master
 *
 * Readme avec des exemples
 * https://github.com/facebookarchive/php-graph-sdk/blob/master/docs/examples/access_token_from_javascript.md
 *
 * Obtenir les informations de l'utilisateur, liste des méthodes :
 * https://github.com/facebookarchive/php-graph-sdk/blob/master/docs/reference/GraphNode.md#graphuser-instance-methods
 */

require_once  '../../headers.php';
require_once '../../constante.php';

//Api facebook
require_once SERVER_URL . '/utils/vendor/autoload.php';
include_once SERVER_DB;
include_once SERVER_URL . '/modele/user.php';
include_once SERVER_URL . '/utils/authentification/authentification.php';
include_once SERVER_URL . '/utils/authentification/JwtTokenKey.php';
include_once SERVER_URL . '/utils/authentification/UserToken.php';

$data = json_decode(file_get_contents("php://input"));

try {
    $params = parse_ini_file(SERVER_URL . '/zone_protected/facebook.ini');
    if ($params === false) {
        throw new Exception("Erreur lors de la lecture du fichier de configuration de la db");
    }
}
catch(Exception $e) {
    echo("Erreur: ".$e -> getMessage());
}

$fb = new Facebook\Facebook([
    'app_id' => $params['app_id'],
    'app_secret' => $params['app_secret'],
    'default_graph_version' => $params['default_graph_version']
]);

$idFacebook = $data->token;

if (empty("$idFacebook")) {
    echo json_encode(array("message" => "Aucun token n'a été envoyé"));
    exit;
}

$secret_key = new JwtTokenKey();

try {
    $answer = $fb->get('/me?fields=id,name,email', "$idFacebook");
    $me = $answer->getGraphUser();
} catch (\Facebook\Exception\FacebookResponseException $e) {
    // Quand Graph retourne une erreur
    json_encode(array("message" => "Graph returned an error: " . $e->getMessage()));
    http_response_code(400);
    exit;
} catch (\Facebook\Exception\FacebookSDKException $e) {
    // Quand la validation échoue ou tout autres erreurs
    json_encode(array("message" => "Facebook SDK returned an error: " . $e->getMessage()));
    http_response_code(400);
    exit;
}

$id = $me->getId();

if (empty($id)) {
    $answer = array(
        "status" => "error",
        "error" => true,
        "message" => "Aucun id"
    );
} else {
    // Récupération infos utilisateurs
    $name = $me->getName();
    $email = $me->getEmail();

    $idCompte = '';
    //Envoie de la requête SQL pour les informations du fichier dans la BDD
    $TABLE_ROOT = 'compte';

    // test si le login ou l'email existe déjà pour éviter qu'il y ait deux utilisateurs ayant le même login ou la même adresse email
    $ligne = getCompteFacebookById($id, $con); // récupère la valeur du login sélectionné s'il y en a un

    // Test le résultat
    if (empty($ligne['idFacebook'])) {
        //Insertion dans compte
        $query = "INSERT INTO $TABLE_ROOT (idFacebook, nomProfil, email, estActif) VALUES (:id, :name, :email, 1)";

        $stmt = $con->prepare($query);
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':email', $email);

        if ($stmt->execute()) {
            //Récupération de l'id de l'utilisateur nouvellement ajouté dans compte
            $idCompte = $con->lastInsertId();
            $tableName = 'prive';

            $query = "INSERT INTO $tableName (id, dateDerniereConnexion) VALUES (:id, now())";

            $stmt = $con->prepare($query);
            $stmt->bindValue(':id', $idCompte);

            //Erreur insertion BDD => exit
            if (!($stmt->execute())) {
                $answer = array(
                    "status" => "error",
                    "error" => true,
                    "message" => "L'utilisateur n'a pas pu être ajouté"
                );
                echo json_encode($answer);
                exit();
            }
        } else { //erreur insertion BDD => exit
            $answer = array(
                "status" => "error",
                "error" => true,
                "message" => "Erreur lors de l'ajout de l'utilisateur dans la BDD"
            );
            echo json_encode($answer);
            exit;
        }
    } else { //Pas d'insertion dans la BDD
        //Récupération id
        $idCompte = $ligne['id'];

        //Mise à jour de l'email si un changement a eu lieu
        if ($ligne['email'] != $email) {
            $query = "UPDATE $TABLE_ROOT SET email = :email WHERE id = :idCompte";
            $stmt = $con->prepare($query);
            $stmt->bindValue(':email', $email);
            $stmt->bindValue(':idCompte', $idCompte);

            //Erreur mise à jour BDD => exit
            if (!($stmt->execute())) {
                $answer = array(
                    "status" => "error",
                    "error" => true,
                    "message" => "Erreur lors de la mise à jour de l'adresse email"
                );
                echo json_encode($answer);
                exit();
            }
        }
    }

    $infoCompte = getCompteById($idCompte, $con);
    $infoUserInstitution = getInstitutionById($idCompte, $con);
    $infoUserPriv = getPrivateUsersById($idCompte, $con);


    $username = $infoCompte['nomProfil'];
    $idFacebook = $infoCompte['idFacebook'];

    $userToken = new UserToken();

    // Configuration du token
    $issuer_claim = JwtTokenKey::getISSUE();
    $audience_claim = JwtTokenKey::getAUD();
    $issuedat_claim = time(); // issued at
    $notbefore_claim = $issuedat_claim; //Pas avant, en secondes
    $expire_claim = $issuedat_claim + JwtTokenKey::getTimeOut(); // temps avant expiration


    // nomProfil commun aux utilisateurs privés et aux institutions
    $userToken->setUsername($username);

    if (isset($infoUserPriv['id'])) {
        $userToken->setIsAuthenticated(True);
        $userToken->setId($infoUserPriv['id']);
        $token = array(
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "nbf" => $notbefore_claim,
            "exp" => $expire_claim,
            "data" => $userToken->creeArrayPourToken()
        );
        $jwt = $secret_key->createToken($token);
        $userToken->setBearerToken($jwt);
        $answer = $userToken->creeArrayPourReponse();
    } elseif (isset($infoUserInstitution['id'])) {
        // Mise à jour des données de l'utilisateur pour le token
        $userToken->setIsValid($infoUserInstitution['estValide']);
        $userToken->setIsInstitution(True);
        $userToken->setIsAuthenticated(True);
        $userToken->setId($infoUserInstitution['id']);
        $token = array(
            "iss" => $issuer_claim,
            "aud" => $audience_claim,
            "iat" => $issuedat_claim,
            "nbf" => $notbefore_claim,
            "exp" => $expire_claim,
            "data" => $userToken->creeArrayPourToken()
        );

        //Création du token avec la clé
        $jwt = $secret_key->createToken($token);

        $userToken->setBearerToken($jwt);
        $answer = $userToken->creeArrayPourReponse();
    } else { //erreur
        $answer = array(
            "status" => "error",
            "error" => false,
            "message" => "Aucun utilisateur trouvé",
            "isInstitution" => "false"
        );
        http_response_code(400);
    }
}
echo json_encode($answer);

