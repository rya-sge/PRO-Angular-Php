<?php
/**
 * Date de création : 14.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Requête à la BDD pour les utilisateurs(compte, institution, privé)
 * Sources :
 */
// -----------------------------

/*
 * @brief  contient la requête permettant d'avoir toutes les informations de l'utilisateur passé en paramètre
 * @param le login de l'utilisateur
 * @return $resultats. Il s'agit d'jeu de résultats retourné en tant qu'array
 */
function getCompteById($id, $con)
{
    // Création de la string pour la requête
    $request = "SELECT * 
                FROM compte 
                WHERE id = :id";
    $query = $con->prepare($request);
    $query->bindValue(':id', $id);

    // Exécution de la requete
    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

/**
 * @param $id
 * @return mixed
 */
function getCompteFacebookById($id, $con){
    $request = "SELECT * 
                 FROM compte
                 WHERE idFacebook = :id";

    $query = $con->prepare($request);
    $query->bindValue(':id', $id);

    // Exécution de la requete
    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

/*
 * @brief  contient la requête permettant d'avoir toutes les informations de l'utilisateur passé en paramètre
 * @param le login de l'utilisateur
 * @return $resultats. Il s'agit d'jeu de résultats retourné en tant qu'array
 */
function getPrivateUsersById($id, $con)
{
    // Création de la string pour la requête
    $request = "SELECT * 
                FROM prive 
                WHERE id = :id";
    // Exécution de la requete
    $query = $con->prepare($request);
    $query->bindValue(':id', $id);

    // Exécution de la requete
    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

/*
 * @brief  contient la requête permettant d'avoir toutes les informations de l'utilisateur passé en paramètre
 * @param le login de l'utilisateur
 * @return $resultats. Il s'agit d'jeu de résultats retourné en tant qu'array
 */
function getInstitutionById($id, $con)
{
    // Création de la string pour la requête
    $request = "SELECT * 
                FROM institution 
                WHERE id = :id";
    $query = $con->prepare($request);
    $query->bindValue(':id', $id);

    // Exécution de la requete
    if($query->execute()){
        return $query->fetch();
    }

    return null;
}

/**
 * @brief Supprime un compte de la table Compte
 * @param $id
 * @param $con
 * @return bool true si la requête s'est bien passée
 */
function delAccount($id, $con):bool
{
    $request = "DELETE FROM compte WHERE id = :id";

    $query = $con->prepare($request);
    $query->bindValue(':id', $id);

    // Exécution de la requete
    if($query->execute()){
        return true;
    }

    return false;
}

/**
 * @brief Supprime un compte de la table Privé
 * @param $id
 * @param $con
 * @return bool true si la requête s'est bien passée
 */
function delUserAccount($id, $con):bool
{
    $request = "DELETE FROM prive WHERE id = :id";
    $query = $con->prepare($request);
    $query->bindValue(':id', $id);

    // Exécution de la requete
    if($query->execute()){
        return true;
    }

    return false;
}
