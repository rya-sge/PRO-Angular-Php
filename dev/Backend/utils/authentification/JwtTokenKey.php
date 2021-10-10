<?php
use \Firebase\JWT\JWT;
/**
 * Date de création : 28.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * TOP CONFIDENTIAL
 * Sources :
 * Github de la librairie utilisée :
 * https://github.com/firebase/php-jwt
 */
class JwtTokenKey{
    private $PRIVATE_KEY = <<<EOD
-----BEGIN RSA PRIVATE KEY-----
YOUR PRIVATE KEY
-----END RSA PRIVATE KEY-----
EOD;

    private $PUBLIC_KEY = <<<EOD
-----BEGIN PUBLIC KEY-----
YOUR PUBLIC KEY
-----END PUBLIC KEY-----
EOD;

    private $ALGORITHM = 'RS256';

    /**
     * @return string
     */
    public static function getISSUE()
    {
        return  "swissculture.tk";
    }

    /**
     * @return string
     */
    public static function getAUD()
    {
        return  "swissculture.tk";
    }

    /**
     * @return int temps en seconde, durée de vie du token
     */
    public static function getTimeOut(){
        return 14400; // 4heures
     }


    /**
     * @param $token
     * @return string
     */
    public function createToken($token){
        return  JWT::encode($token, $this->PRIVATE_KEY, $this->ALGORITHM);
    }

    /**
     * @param $jwt
     * @return object
     */
    public function decodeToken($jwt){
        return JWT::decode($jwt, $this->PUBLIC_KEY, array($this->ALGORITHM));
    }



}

?>
