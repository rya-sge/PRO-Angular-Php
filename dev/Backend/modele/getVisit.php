<?php
/**
 * Date de création : 14.05.2021
 * Dernier contributeur : Quentin Le Ray
 * Groupe : PRO-A-07
 * Description : Fichier regroupant toutes les requêtes SELECT en rapport avec les visites
 * Sources :
 */

/**
 * @brief Récupère toutes les visites d'une institution
 * @param $idInstit int Id de l'institution
 * @param $con object Objet PDO pour la connexion à la BDD
 * @return false|mixed Faux si erreur, tableau avec les résultats si réussi
 */
function getAllVisitsOfOneInstitution($idInstit, $con) {
    // Création de la string pour la requête
    $sql = "SELECT id, titre, description, estVisible 
                FROM visite 
                WHERE institution_id = :idInstit";
    // Préparation de la requête (sanitize, etc.)
    $query = $con->prepare($sql);
    $query->bindValue(':idInstit', $idInstit);

    // Exécution de la requete
    if ($query->execute()) {
        return $query->fetchAll();
    } else {
        return false;
    }
}

/**
 * @brief Récupère la liste des visites visibles d'une institution
 * @param $idInstit int Id de l'institution
 * @param $con object Objet PDO pour la connexion à la BDD
 * @return false|mixed Faux si erreur, tableau avec les résultats si réussi
 */
function getVisibleVisitsOfOneInstit($idInstit, $con) {
    // Création de la string pour la requête
    $sql = "SELECT id, titre, description
                FROM visite 
                WHERE institution_id = :idInstit AND estVisible = 1";
    // Préparation de la requête (sanitize, etc.)
    $query = $con->prepare($sql);
    $query->bindValue(':idInstit', $idInstit);

    // Exécution de la requete
    if ($query->execute()) {
        return $query->fetchAll();
    } else {
        return false;
    }
}

/**
 * @brief Récupère la liste des images dans l'ordre d'une visite visible
 * @param $idVisit int Id de la visite
 * @param $con object Objet PDO pour la connexion à la BDD
 * @return false|mixed Faux si erreur, tableau avec les résultats si réussi
 */
function getFullVisibleVisit($idVisit, $con) {
    $sql = "SELECT nomFichier AS 'image', media.titre AS 'title', auteur, media.description, visite.institution_id FROM media
            INNER JOIN visite_media ON media.idMedia = visite_media.media_idMedia
            INNER JOIN visite ON visite_media.visite_id = visite.id
            WHERE visite_id = :idVisit AND estVisible = 1
            ORDER BY ordre ASC;";

    // Préparation de la requête (sanitize, etc.)
    $query = $con->prepare($sql);
    $query->bindValue(':idVisit', $idVisit);

    // Exécution de la requete
    if ($query->execute()) {
        return $query->fetchAll();
    } else {
        return false;
    }
}

/**
 * @brief Récupère toutes les infos d'une visite
 * @param $idVisit int Id de la visite
 * @param $con object Objet PDO pour la connexion à la BDD
 * @return false|mixed Faux si erreur, tableau avec les résultats si réussi
 */
function getFullVisit($idVisit, $con) {

    // Récup info visite
    $sql = "SELECT titre, description, estVisible 
                FROM visite
                WHERE id = :idVisit";

    // Préparation de la requête (sanitize, etc.)
    $query = $con->prepare($sql);
    $query->bindValue(':idVisit', $idVisit);

    // Exécution de la requete
    if ($query->execute()) {
        $data['visit'] = $query->fetchAll();
    } else {
        return false;
    }

    // Récup liste images de la visite
    $sql = "SELECT idMedia, nomFichier
                FROM media
                INNER JOIN visite_media ON media.idMedia = visite_media.media_idMedia
                WHERE visite_id = :idVisit
                ORDER BY ordre ASC";

    // Préparation de la requête (sanitize, etc.)
    $query = $con->prepare($sql);
    $query->bindValue(':idVisit', $idVisit);

    // Exécution de la requete
    if ($query->execute()) {
        $data['pictures'] = $query->fetchAll();
    } else {
        return false;
    }

    // Récup liste catégories de la visite
    $sql = "SELECT categorie.id, categorie.nom
            FROM categorie
            INNER JOIN visite_categorie ON categorie.id = visite_categorie.categorie_id
            WHERE visite_id = :idVisit";

    // Préparation de la requête (sanitize, etc.)
    $query = $con->prepare($sql);
    $query->bindValue(':idVisit', $idVisit);

    // Exécution de la requete
    if ($query->execute()) {
        $data['categories'] = $query->fetchAll();
    } else {
        return false;
    }

    return $data;
}