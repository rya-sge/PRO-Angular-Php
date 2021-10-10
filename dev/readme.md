## Fichiers de configuration

> Selon la version du Git, les configurations de fichiers peuvent ne pas être adaptées à l'environnement de développement local. Il faut s'assurer que les options ci-dessous soient correctes pour votre système.

À noter que lorsque des chemins ou des adresses sont spécifiées, le caractère `/` de fin ne doit jamais être présent. 

### Backend/headers.php:

Les navigateurs actuels intègrent une protection CORS servant à empêcher les requêtes localhost.

Pour résumer, une requête de type "OPTIONS" est envoyée avant chaque requête vers le fichier dont le navigateur veux accéder. Si la requête OPTIONS envoie un message "200 : OK", alors l'exécution peut continuer, sinon la requête suivante est bloquée.

Ce mécanisme empêche le fonctionnement du site lorsqu'il est en cours de développement. Le bout de code ci-dessous sert à accepter toutes les requêtes "OPTIONS" afin de faire fonctionner l'application en local. Il doit être désactivé pour la mise en production. 

- S'assurer que le bout de code ci-dessous soit **décommenté**:

```php
if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
    http_response_code(200);
    exit;
}
```

### Backend/zone_protected/db.ini

Contient les informations de connexion vers la BDD depuis les fichiers backend.

Les options ci-dessous doivent être changées selon votre configuration:

- `host`: l'adresse de la base de données
- `port`: son port 
- `user`: le nom d'utilisateur ayant des droits d'admin sur la table `swiss_culture_db` 
- `password`: le mot de passe en clair de l'utilisateur

### Backend/constante.php

Ce fichier contient différentes constantes qui peuvent être appelées depuis les fichiers PHP. 

- `SERVER_URL` : le chemin absolu du dossier Backend **sur le serveur** (pas HTTP)
  - par exemple: */var/www/html/Backend*
- `SERVER_URL_MEDIA_FRONTEND` : l'adresse du dossier *media* accessible depuis le **frontend**
  - par exemple: *http://localhost/Backend/media*

Les autres constantes n'ont pas à être modifiées.

### SwissCulture/src/app/app.component.ts

Contient diverses constantes pouvant être utilisées depuis le frontend pour faire notamment les requêtes vers le backend.

- `SERVER_URL_ROOT` : La racine de l'adresse du serveur backend

  - en local, mettre: *'http://localhost'*

- `SERVER_BACKEND`: Se base sur `SERVER_URL_ROOT`, il faut ajouter le chemin vers la racine du dossier Backend

  - Par exemple:

    ```typescript
    static SERVER_BACKEND = AppComponent.SERVER_URL_ROOT + '/Backend';
    ```

Les autres constantes n'ont pas besoin d'être modifiées.

# 