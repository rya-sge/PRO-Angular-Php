<?php
/**
Date de création : ??.??.????
Création: Dylan
Dernières modifiation : David Pellissier
Le : 19.05.2021
Groupe : PRO-A-07
Description :
-Upload des images PNG et JPEG.
-Upload d'une image watermark.
-Upload d'une visite avec le cachet adapté selon l'institution.
- Upload d'une image de profil
 */

require_once '../headers.php';
include_once '../constante.php';
include_once SERVER_DB;
include_once SERVER_PROTECTED;
$response = array();

$data = json_decode(file_get_contents("php://input"));

//Extensions acceptées
$extensionList = array('.jpg', '.jpeg', '.JPG', '.png', '.PNG');
//Extensions pour jpeg
$jpegExtList = array('.jpg', '.jpeg', '.JPG');


if ($_FILES['image']) {
    //Récupération du nom de fichier et d'erreur si il y en a eu
    $avatarName = $_FILES["image"]["name"];
    $avatarTmpName = $_FILES["image"]["tmp_name"];
    $error = $_FILES["image"]["error"];

    // Récupération de l'extension
    $extension = strrchr($avatarName, '.');

    //Test de la validité de l'extension
    if (!in_array($extension, $extensionList)) {
        throw new Exception("Extension non acceptée");
        error_log("DEBUG : Extension non acceptée", 0);
    }

    // Si l'image est trop grande, alors elle n'est jamais stockée sur le serveur: exception
    if(empty($avatarTmpName)){
        throw new Exception("Fichier trop grand");
        error_log("DEBUG : Fichier trop grand", 0);
    }

    // Récupère l'info pour savoir s'il sagit de l'upload du watermark
    $isWatermark = ($_POST["isWatermark"] == "true");
    $isProfile = ($_POST["isProfile"] == "true");

    // Id de l'institution, prise par le token
    $idInstitution = $user->getId();

    // Création du path où sera stocké l'image
    $pictureLocation = SERVER_URL_MEDIA . '/' . $idInstitution;
    $wmLocation = $pictureLocation .  '/wm';
    if ($isWatermark) { // si c'est un watermark
        $pictureLocation = $wmLocation;
    }
    elseif (!$isProfile) { // si c'est une image de visite
        $pictureLocation .= '/visites';
    }

    // Création des dossier du path précédent s'ils n'existent pas encore
    if (!file_exists($pictureLocation)) {
        mkdir($pictureLocation, 0777, true);
    }

    // Application du watermark
    if (!$isWatermark && !$isProfile) {
        // Requête pour déterminer le type de wm dont nous avons besoin et sont text
        $db = connect();
        $query = "SELECT * 
                FROM institution 
                WHERE id = $idInstitution";
        // Exécution de la requete
        $qInstitution = $db->query($query);
        $qInstitution = $qInstitution->fetch();
        $wmType = $qInstitution['typeWatermark'];
        $filigrane = $qInstitution['filigrane'];

        if ($wmType == 0) {
            // Création du watermark par rapport à un texte

            // Créer un text watermark si wmType = 0
            if (in_array($extension, $jpegExtList)) {
                $imagetobewatermark = imagecreatefromjpeg($avatarTmpName);
            } else {
                $imagetobewatermark = imagecreatefrompng($avatarTmpName);
            }
            $watermarktext = $filigrane;
            $white = imagecolorallocate($imagetobewatermark, 255, 255, 255);


            // Creation de l'image contenant le texte sur fond blanc
            $font_height = imagefontheight(1);
            $font_width = imagefontwidth(1);
            $text = $watermarktext; // Texte du watermark

            // Formule pour le texte sur le timbre
            $width = (strlen($text) * $font_width) + 10;
            $height = $font_height + 2;

            // Création du timbre
            $stamp = @ImageCreate($width, $height)
            or die ("Cannot Initialize new GD image stream");

            $background_color = ImageColorAllocate($stamp, 255, 255, 255); // Le couleur de fond
            $text_color = ImageColorAllocate($stamp, 0, 0, 0);      // La couleur du text

            ImageString($stamp, 1, 5, 1, $text, $text_color); // Ajout du text sur le fond


            // Le text et son fond va être ajouter à l'image.

            // Marge sur le timbre
            $marge_right = 10;
            $marge_bottom = 10;
            $sx = imagesx($stamp);
            $sy = imagesy($stamp);


            // Formule pour la proportion du timbre par rapport à limage
            $factor = floor((imagesx($imagetobewatermark) / 1080) * imagesx($stamp) * 1.5);
            $factorY = floor((imagesx($imagetobewatermark) / 1080) * imagesy($stamp) * 1.5);


            $new_stamp = imagecreatetruecolor($factor, $factorY);
            imagealphablending($new_stamp, false);
            imagesavealpha($new_stamp, true);
            imagecopyresampled($new_stamp, $stamp, 0, 0, 0, 0, $factor, $factorY, imagesx($stamp), imagesy($stamp));

            // Copie le cachet sur la photo en utilisant les marges et la largeur de la
            // photo originale  afin de calculer la position du cachet
            imagecopy($imagetobewatermark, $new_stamp, imagesx($imagetobewatermark) - imagesx($new_stamp) - $marge_right, imagesy($imagetobewatermark) - imagesy($new_stamp) - $marge_bottom, 0, 0, imagesx($new_stamp), imagesy($new_stamp));

            // Affichage et libération de la mémoire
            if (in_array($extension, $jpegExtList)) {
                imagejpeg($imagetobewatermark, $avatarTmpName);
            } else {
                imagepng($imagetobewatermark, $avatarTmpName);
            }
            imagedestroy($imagetobewatermark);

        } elseif ($wmType == 1) {
            // Création du watermark par rapport à un timbre


            // Créer une image watermark si wmType = 1
            $stampExtension = strrchr($filigrane, '.');

            $wmPictureLocation = $wmLocation . "/" . $filigrane;

            if (in_array($stampExtension, $jpegExtList)) {
                $stamp = imagecreatefromjpeg($wmPictureLocation);
            } else {
                $stamp = imagecreatefrompng($wmPictureLocation);
            }


            if (in_array($extension, $jpegExtList)) {
                $im = imagecreatefromjpeg($avatarTmpName);
            } else {
                $im = imagecreatefrompng($avatarTmpName);
            }

            // Définit les marges pour le cachet et récupère la hauteur et la largeur de celui-ci
            $marge_right = 10;
            $marge_bottom = 10;
            $sx = imagesx($stamp);
            $sy = imagesy($stamp);

            // formules pour afficher le timbre proportionellement à l'image
            $coef = 0.5;
            $factor = floor(((imagesx($im) / 1080) * $coef) * imagesx($stamp));
            $factorY = floor(((imagesx($im) / 1080) * $coef) * imagesy($stamp));

            // Création du watermark
            $new_stamp = imagecreatetruecolor($factor, $factorY);
            imagealphablending($new_stamp, false);
            imagesavealpha($new_stamp, true);
            imagecopyresampled($new_stamp, $stamp, 0, 0, 0, 0, $factor, $factorY, imagesx($stamp), imagesy($stamp));

            // Copie le cachet sur la photo en utilisant les marges et la largeur de la
            // photo originale  afin de calculer la position du cachet
            imagecopy($im, $new_stamp, imagesx($im) - imagesx($new_stamp) - $marge_right, imagesy($im) - imagesy($new_stamp) - $marge_bottom, 0, 0, imagesx($new_stamp), imagesy($new_stamp));

            // Affichage et libération de la mémoire
            if (in_array($extension, $jpegExtList)) {
                imagejpeg($im, $avatarTmpName);
            } else {
                imagepng($im, $avatarTmpName);
            }

            imagedestroy($im);
        }

    }

    if ($error > 0) {
        $response = array(
            "status" => "error",
            "error" => true,
            "message" => "Error uploading the file"
        );
    }
    // Stockage du fichier
    else {
        if($isProfile){
            $uploadName = "profil.jpg";
        }
        else {
            //Hachage du nom de fichier
            $filename = hash_file('md5', $avatarTmpName);
            //Concaténation du nom + extension
            $uploadName = $filename . $extension;
        }

        //url de l'image
        $url = $pictureLocation . "/" . $uploadName;

        //Envoie du fichier vers le dossier backend
        if (move_uploaded_file($avatarTmpName, $url)) {

            //Envoie de la requête SQL pour les informations du fichier dans la BDD
            $tableName = 'media';

            if ($isWatermark) {
                $query = "UPDATE institution SET `typeWatermark`='1', `filigrane`='$uploadName' WHERE id=$idInstitution";

                $stmt = $con->prepare($query);
                if ($stmt->execute()) {
                    $response = array(
                        "status" => "success",
                        "error" => false,
                        "message" => "File uploaded successfully",
                        //"url" => $url
                    );
                } else {
                    $response = array(
                        "status" => "error",
                        "error" => true,
                        "message" => "Error uploading file infos in BDD"
                    );
                }

            } elseif(!$isProfile){ // ne pas stocker les images de profil
                $query = "INSERT INTO $tableName (`nomFichier`,`date`, `Institution_id`) VALUES ('$uploadName', NOW(), $idInstitution)";

                $stmt = $con->prepare($query);
                if ($stmt->execute()) {
                    $response = array(
                        "status" => "success",
                        "error" => false,
                        "message" => "File uploaded successfully",
                        //"url" => $url
                    );
                } else {
                    $response = array(
                        "status" => "error",
                        "error" => true,
                        "message" => "Error uploading file infos in BDD"
                    );
                }
            }

        } else {
            $response = array(
                "status" => "error",
                "error" => true,
                "message" => "Error uploading the file"
            );
        }
    }
}
else {
    $response = array(
        "status" => "error",
        "error" => true,
        "message" => "No file was sent!"
    );
}

echo json_encode($response);
?>
