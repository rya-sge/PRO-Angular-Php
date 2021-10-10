<?php
/**
 * Date de création : 04.05.2021
 * Dernier contributeur : Quentin Le Ray & Ryan Sauge
 * Groupe : PRO-A-07
 * Description : Fichier pour la gestion des visites par les institutions
 * Source : https://github.com/techiediaries/angular-php-example/blob/master/backend/index.php
 */

require_once '../../headers.php';
require_once '../../constante.php';
include_once SERVER_DB;
require_once SERVER_PROTECTED;
include_once SERVER_URL . '/modele/getVisit.php';
include_once SECURITY_FUNCTIONS;

if ($user->isAuthenticated() && $user->isIsInstitution()) {
    // Gestion requêtes
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET' :
            if (isset($_GET['idVisit'])) { // Requête pour une visite particulière
                $id = getIntParam('idVisit');
                $result = getFullVisit($id, $con); //Pour version finale
                if ($result) { //Ok

                    $userId = $user->getId();

                    // Met l'url complète de chaque image à afficher.
                    for ($i = 0; $i < sizeof($result['pictures']); $i++) {
                        $result['pictures'][$i]['nomFichier'] =
                            SERVER_URL_MEDIA_FRONTEND . "/" . $userId . "/visites/" . $result['pictures'][$i]['nomFichier'];
                    }
                    echo json_encode($result);

                } else { //Erreur interne
                    http_response_code(500);
                }

            } else { // Requête GET simple
                // Requête à la DB
                $result = getAllVisitsOfOneInstitution($user->getId(), $con);
                if ($result) {
                    //Ok
                    echo json_encode($result);
                } else {
                    //Erreur interne
                    http_response_code(500);
                }
            }
            break;
        // Seul une institution valide et authentifiée à le droit de créer des ressources
        case 'POST' :
            if ($user->isIsValid()) {
                // Requête à la DB
                $data = json_decode(file_get_contents("php://input"));

                if (isset($_GET['idVisit'])) { // Ajout d'images à une visite
                    $id = getIntParam('idVisit');

                    // Récupération ordre le plus élevé
                    $sql = "SELECT MAX(ordre) FROM visite_media
                        WHERE visite_id = :id";

                    $query = $con->prepare($sql);
                    $query->bindValue(':id', $id);

                    try {
                        $query->execute();
                    } catch (PDOException $e) {
                        return http_response_code(500);
                    }
                    $ordre = $query->fetch()['MAX(ordre)'];

                    // Vide la variable avant sa réutilisation
                    $sql = "";

                    // Ajoute les images à la visite
                    foreach ($data as $key => $value) {
                        if ($value != null) {
                            $ordre++;
                            $sql .= "INSERT INTO visite_media (visite_id, media_idMedia, ordre) 
                                        VALUES ('" . $id . "', '$key', '$ordre');"; // protégé par getIntParam
                        }
                    }

                    $query = $con->prepare($sql);

                    try {
                        $query->execute();
                    } catch (PDOException $e) {
                        return http_response_code(500);
                    }

                    //Ok
                    http_response_code(200);

                } else { // Ajout d'une visite
                    $sql = "INSERT INTO visite (titre, description, estVisible, institution_id) 
                            VALUES (:title, :description, false, :id );";

                    // Ajout des catégories
                    foreach ($data->categ as $cat) {
                        // LAST_INSERT_ID() est spécifique à MySQL
                        $sql .= "INSERT INTO visite_categorie (visite_id, categorie_id) 
                                VALUES (LAST_INSERT_ID(), " . checkInt($cat, "") . ");";
                    }

                    $query = $con->prepare($sql);

                    $query->bindValue(':title', $data->title);
                    $query->bindValue(':description', $data->description);
                    $query->bindValue(':id', $user->getId());

                    if ($query->execute()) {
                        //Ok
                        http_response_code(200);
                    } else {
                        //Erreur interne
                        http_response_code(500);
                    }
                }
            } else {
                http_response_code(400);
            }
            break;

        case 'PUT' :
            if (isset($_GET['idVisit'])) {
                $data = json_decode(file_get_contents("php://input"));
                $idVisit = getIntParam('idVisit');

                // Supression de toutes les catégories
                $sql = "DELETE FROM visite_categorie
                        WHERE visite_id = :idVisit;";

                $sql .= "UPDATE visite
                        SET titre = :title,
                        description = :description,
                        estVisible = :isVisible
                        WHERE id = :idVisit;";

                // Ajout des catégories séléctionnées
                foreach ($data->categ as $cat) {
                    $sql .= "INSERT INTO visite_categorie (visite_id, categorie_id) VALUES (:idVisit, " . checkInt($cat,
                            "") . ");";
                }
                $query = $con->prepare($sql);
                $query->bindValue(':title', $data->title);
                $query->bindValue(':description', $data->description);
                $query->bindValue(':isVisible', ($data->visible + 0)); // Converti null en 0
                $query->bindValue(':idVisit', $idVisit);

                try {
                    $query->execute();
                } catch (PDOException $e) {
                    // Erreur
                    return http_response_code(500);
                }

                // Ok
                http_response_code(200);

            } else {
                http_response_code(400);
            }
            break;

        case 'DELETE' :

            if (isset($_GET['idMedia']) && isset($_GET['idVisit'])) { // Suppression d'une image d'une visite
                $idMedia = getIntParam('idMedia');
                $idVisit = getIntParam('idVisit');

                $sql = "DELETE FROM visite_media
                        WHERE visite_id = :idVisit AND media_idMedia = :idMedia;";

                $query = $con->prepare($sql);
                $query->bindValue(':idVisit', $idVisit);
                $query->bindValue(':idMedia', $idMedia);

                try {
                    $query->execute();
                } catch (PDOException $e) {
                    // Erreur
                    return http_response_code(500);
                }

                // Ok
                http_response_code(200);

            } elseif (isset($_GET['idVisit'])) { // Supression d'une visite
                $idVisit = getIntParam('idVisit');

                // visite_id dans visite_media doit être en ON DELETE CASCADE au lieu de RESTRICT
                $sql = "DELETE FROM visite
                       WHERE id = :idVisit";

                $query = $con->prepare($sql);
                $query->bindValue(':idVisit', $idVisit);

                try {
                    $query->execute();
                } catch (PDOException $e) {
                    // Erreur
                    return http_response_code(500);
                }

                // Ok
                http_response_code(200);

            } else {
                http_response_code(400);
            }


            break;

        default :
            http_response_code(400);
            break;
    }
} else {
    //Authentification requise
    http_response_code(401);
}



