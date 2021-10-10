<?php
/**
Date de création : 06.04.2021
Dernier contributeur : Quentin Le Ray et Ryan Sauge
Groupe : PRO-A-07
Description : Effectue la connexion à la base de donnée
Sources :
Beaucoup basé sur php.net : https://www.php.net/manual/fr/book.pdo.php
 */



function connect()
{
    try {
        $params = parse_ini_file('db.ini');
        if ($params === false) {
            throw new Exception("Erreur lors de la lecture du fichier de configuration de la db");
        }
    }
    catch(Exception $e) {
        echo("Erreur: ".$e -> getMessage());
    }

    try
    {
        $pdo = new PDO("mysql:dbname=" . $params['database'] . ";host=" . $params['host'] . ";charset=utf8;port=" . $params['port'], $params['user'], $params['password']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    }
    catch(PDOException $e)
    {
        echo("Erreur: ".$e -> getMessage());
        die();
    }
    return $pdo;
}

$con = connect();
