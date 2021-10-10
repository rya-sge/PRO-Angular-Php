<?php
/**
Date de création : 25.05.2021
Dernier contributeur : David Pellissier
Groupe : PRO-A-07
Description : Diverses fonctions de vérification de paramètres
 */

function checkInt($val, $paramName){
    if(! ctype_digit($val) && !is_int($val))
    {
        http_response_code(400);
        echo "$paramName needs to be an integer";
        exit;
    }

    return intval($val);
}

function getIntParam($paramName):int
{
    if(!isset($_GET[$paramName]))
    {
        http_response_code(400);
        echo "$paramName is no set";
        exit;
    }

    $val = $_GET[$paramName];

    $val = checkInt($val, $paramName);

    return $val;
}

function dataIntParam($paramName, $data):int
{
    if(!isset($data->$paramName))
    {
        http_response_code(400);
        echo "$paramName is no set";
        exit;
    }

    $val = $data->$paramName;

    $val = checkInt($val, $paramName);

    return $val;
}



