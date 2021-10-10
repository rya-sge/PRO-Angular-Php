<?php
/**
 * Date de création : 28.04.2021
 * Dernier contributeur : Ryan Sauge
 * Groupe : PRO-A-07
 * Description :
 * Information de l'utilisateur pour créer le token
 */

/**
 * Class représentant les données qui seront utilisées pour la création du token d'authentification
 */
class UserToken {
    private $id = '';
    private $username = '';
    private $isAuthenticated = false;
    private $isValid = false;
    private $isInstitution = false;
    private $bearerToken = '';

    /**
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }



    /**
     * @return bool
     */
    public function isIsValid()
    {
        return $this->isValid;
    }

    /**
     * @param bool $isValid
     */
    public function setIsValid($isValid)
    {
        $this->isValid = $isValid;
    }

    /**
     * @param string $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
    }

    /**
     * @param bool $isAuthenticated
     */
    public function setIsAuthenticated($isAuthenticated)
    {
        $this->isAuthenticated = $isAuthenticated;
    }

    /**
     * @param bool $isInstitution
     */
    public function setIsInstitution($isInstitution)
    {
        $this->isInstitution = $isInstitution;
    }

    /**
     * @param string $bearerToken
     */
    public function setBearerToken($bearerToken)
    {
        $this->bearerToken = $bearerToken;
    }

    /**
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @return bool
     */
    public function isAuthenticated()
    {
        return $this->isAuthenticated;
    }

    /**
     * @return bool
     */
    public function isIsInstitution()
    {
        return $this->isInstitution;
    }

    /**
     * @return string
     */
    public function getBearerToken()
    {
        return $this->bearerToken;
    }

    /**
     * @return array
     */
    public function creeArrayPourToken(){
        return array(
            "username" => $this->username,
            "isAuthenticated" => $this->isAuthenticated,
            "isInstitution" => $this->isInstitution,
            "isValid" => $this->isValid,
            "id" => $this->id
        );
    }

    /**
     * @return array
     */
    public function creeArrayPourReponse(){
        return array(
            "username" => $this->username,
            "isAuthenticated" => $this->isAuthenticated,
            "isInstitution" => $this->isInstitution,
            "isValid" => $this->isValid,
            "bearerToken" =>$this->bearerToken
        );
    }
}

?>
