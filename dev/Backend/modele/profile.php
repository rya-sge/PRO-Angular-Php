<?php
/**
 * Date de création : 13.05.2021
 * Dernier contributeur : David Pellissier
 * Groupe : PRO-A-07
 * Description :
 * Requêtes associées au profil d'une institution
 * Sources :
 */
// -----------------------------

function getInstitution($id, $con, $validity){

    $fields = "institution.id, institution.description, compte.nomProfil AS nom, institution.siteWeb AS url, institution.rue, institution.ville_id, institution.domaine_id";
    $request = "SELECT $fields FROM institution "
                ."INNER JOIN compte ON institution.id = compte.id "
                ."WHERE institution.id = :id";

    if($validity){
        $request .= " AND institution.estValide = 1";
    }

    // Exécution de la requete
    $query = $con->prepare($request);
    $query->bindValue(':id', $id);

    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

function getCity($id, $con){
    $sql = "SELECT ville.npa, ville.nom FROM ville " .
            "WHERE ville.id = :id";

    $query = $con->prepare($sql);
    $query->bindValue(':id', $id);

    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

function getDomain($id, $con){
    $sql = "SELECT nom FROM domaine WHERE id = :id";

    $query = $con->prepare($sql);
    $query->bindValue(':id', $id);

    if($query->execute()){
        return $query->fetch();
    }

    return null;
}


