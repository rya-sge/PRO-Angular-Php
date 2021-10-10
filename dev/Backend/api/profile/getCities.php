<?php
/**
Date de création : 13.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description : Récupération des villes de la BDD
 */

require_once '../../headers.php';
include_once '../../constante.php';
require_once SERVER_DB;

$request = "SELECT npa, nom FROM ville ";

$response = $con->query($request)->fetchAll();

echo json_encode($response);
