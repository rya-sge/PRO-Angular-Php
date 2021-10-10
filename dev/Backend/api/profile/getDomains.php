<?php
/**
Date de création : 14.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description : Récupération des domaines de la BDD
 */
require_once '../../headers.php';
require_once '../../constante.php';
require_once SERVER_DB;

$request = "SELECT nom AS name FROM domaine";

$response = $con->query($request)->fetchAll();

echo json_encode($response);

