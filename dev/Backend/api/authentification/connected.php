<?php
/**
Date de création : 06.04.2021
Dernier contributeur : Quentin Le Ray et Ryan Sauge
Groupe : PRO-A-07
Description : Renvoie un utilisateur en json
Est utlisé pour permettre à l'utilisateur de rester connecté
Sources :
Beaucoup basé sur php.net : https://www.php.net/manual/fr/book.pdo.php
 *
 */

require_once  '../../headers.php';
require_once '../../constante.php';
include_once(SERVER_PROTECTED);

$answer = $user->creeArrayPourReponse();
echo json_encode($answer);
