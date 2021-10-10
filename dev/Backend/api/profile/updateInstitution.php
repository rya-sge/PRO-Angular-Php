<?php
/**
Date de création : 14.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description :
- Sert à mettre à jour les informations d'une institution
 */
require_once '../../headers.php';
require_once '../../constante.php';
require_once SERVER_DB;
require_once SERVER_PROTECTED;
//---------------------------------

function getCityId($name, $npa, $con){
    $sql = "SELECT id FROM ville WHERE nom = :name AND npa = :npa";

    $query = $con->prepare($sql);
    $query->bindValue(':name', $name);
    $query->bindValue(':npa', $npa);

    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

function getDomainId($name, $con){
    $sql = "SELECT id FROM domaine WHERE nom = :name";

    $query = $con->prepare($sql);
    $query->bindValue(':name', $name);

    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

function updateInstitution($id, $name, $description, $url, $wType, $wText, $street, $city_id, $domain_id, $con)
{
    $request = "UPDATE institution SET "
                . "description = :desc "
                . ", siteWeb = :url "
                . ", typeWatermark = :wtype "
                . ", ville_id = :city "
                . ", domaine_id = :dom "
                . ", rue = :street "
                . " WHERE id = :id";

    $query = $con->prepare($request);
    $query->bindValue(':desc', $description);
    $query->bindValue(':url', $url);
    $query->bindValue(':wtype', $wType);
    $query->bindValue(':city', $city_id);
    $query->bindValue(':dom', $domain_id);
    $query->bindValue(':street', $street);
    $query->bindValue(':id', $id);

    $res = $query->execute();

    if( ! $res){
        http_response_code(500);
        return;
    }

    // mettre à jour le nom du compte
    $request2 = "UPDATE compte SET nomProfil = :name WHERE id = :id";
    $query = $con->prepare($request2);
    $query->bindParam(':name', $name);
    $query->bindParam(':id', $id);

    $res = $query->execute();
    if( ! $res){
        http_response_code(500);
        return;
    }

    // On le met à jour seulement si le type est "texte". Je n'ai pas trouvé d'autre moyen que de faire une requête séparée
    if($wType == 0){
        $watermarkReq = "UPDATE institution SET filigrane = :wtext WHERE id = :id";
        $query = $con->prepare($watermarkReq);
        $query->bindParam(':wtext',$wText);
        $query->bindParam(':id', $id);
        $res = $query->execute();
        if( ! $res){
            http_response_code(500);
        }
    }

}

// Vérif que l'utilisateur est bien une institution
if(! $user->isIsInstitution()){
    echo "Vous n'êtes pas une institution";
    http_response_code(400);
    return;
}

$data = json_decode(file_get_contents("php://input"));
$npa = $data->adresse->npa;
$city = $data->adresse->ville;
$domain = $data->domaine;

// Vérification des champs
if(empty($npa) || ! ctype_digit($npa)|| empty($city) || empty($domain)){
    echo "Erreur de requête";
    http_response_code(500);
}

// Récupération de l'id de la ville
$city_id = getCityId($city, $npa, $con);

// Récupération de l'id du domaine
$domain_id = getDomainId($domain, $con);

// Modification dans la BDD
if(empty($city_id) || empty($domain_id)){
    http_response_code(500);
    echo "Cette ville ou ce domaine n'existe pas";
    return;
}

updateInstitution($user->getId(), $data->nom, $data->description, $data->url,
    $data->watermark->type, $data->watermark->texte, $data->adresse->rue, $city_id['id'], $domain_id['id'], $con);
