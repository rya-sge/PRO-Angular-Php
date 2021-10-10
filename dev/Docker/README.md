# Environnement de développement Backend avec Docker Compose

Tous les fichiers sont disponibles dans le dossier "docker" du Git.

## Infrastructure

Quatre conteneurs sont utilisés pour l'environnement de développement

- web (apache) : Port 80. Serveur Backend lié au dossier "Backend".
- composer : installe toutes les dépendances PHP. S'arrête automatiquement lorsqu'il a fini ses tâches
- db (mysql) : Port 3306. Base de données. Les scripts situés dans "docker/dump" sont importés au démarrage
- adminer : Port 8080. Client web pour la gestion de la base de données
  - login: admin:test et root:test

## Fichiers de configuration

Les configurations ci-dessous doivent être utilisées

- Backend/zone_protected/db.ini

```ini
host=db
port=3306
database=swiss_culture_db
user=admin
password=test
```

- Backend/constante.php

```php
define("SERVER_URL", "/var/www/html/Backend");
define("SERVER_URL_MEDIA_FRONTEND", "http://localhost/media");
```

- SwissCulture/src/app/app.component.ts

```typescript
  static SERVER_URL_ROOT = 'http://localhost';
  static SERVER_BACKEND = AppComponent.SERVER_URL_ROOT + '/Backend';
```

## Préparation à l'exécution

> Cette procédure n'est à effectuer qu'à la première installation et lorsqu'il y a eu des changements dans le docker-compose ou dans les scripts de la BDD

1. Copier les scripts de "data/scripts" dans "docker/dump"
2. Build les images

```bash
docker-compose build
```
ou
```powershell
docker compose build
```
selon votre version de docker (resp. Toolbox ou Desktop).

## Démarrage des containers

Tout simplement `docker-compose up` ou `docker compose up` selon votre version.

Pour les arrêter, Ctrl+C suffit.
