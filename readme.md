# Docker Librairy

Docker Librairy est une application multi-conteneurs qui vous permet de gérer une bibliothèque de livres via une API Node.js et un frontend web. Elle utilise MySQL pour la persistance des données, Express pour l'API et Nginx pour servir le frontend.

---

## Prérequis

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Installation & Configuration (à partir de zéro)

1. **Cloner le dépôt**  
   Ouvrez un terminal et exécutez :
   ```bash
   git clone <URL_DU_REPO>
   cd <NOM_DU_REPO>
   ```

2. **Vérifier la structure du projet**  
   Le projet doit ressembler à ceci :
   ```
   .
   ├── docker-compose.yml
   ├── node-api/          # Code source de l'API Node.js
   ├── frontend/          # Code source du frontend (HTML, CSS, JS)
   └── db-init/           # Scripts SQL d'initialisation (ex. init.sql)
   ```

3. **Démarrer l'application**  
   Construisez et lancez les conteneurs avec :
   ```bash
   docker-compose up --build --force-recreate -V
   ```
   Cette commande crée les images pour l'API et le frontend, configure les réseaux et volumes nécessaires, et démarre l'application.

---

## Détail des Services et Technologies Installés

### 1. **Base de données (db)**
- **Image** : `mysql:8`
- **Configuration** :
    - `MYSQL_ROOT_PASSWORD`: `root`
    - `MYSQL_DATABASE`: `docker-librairy`
    - Encodage en `utf8mb4` pour une gestion correcte des caractères spéciaux.
- **Volumes** :  
  Les données MySQL sont stockées dans le volume `db_data` pour persistance.
- **Réseau** :  
  Connecté au réseau interne `backend_network` (inaccessible de l'extérieur).

### 2. **API (api)**
- **Technologies** :
    - **Node.js** avec **Express**
- **Fonctionnalités** :
    - Fournit des endpoints pour récupérer, ajouter et supprimer des livres.
    - Se connecte à la base de données MySQL pour les opérations CRUD.
- **Réseaux** :
    - Connecté à `backend_network` (pour accéder à la DB) et à `frontend_network` (pour communiquer avec le frontend).
- **Dépendances** :  
  Démarre uniquement après que le service `db` soit sain (via `depends_on` et `healthcheck`).

### 3. **Frontend (frontend)**
- **Technologies** :
    - HTML, CSS, JavaScript
    - **Nginx** est utilisé pour servir les fichiers statiques.
- **Fonctionnalités** :
    - Interface utilisateur permettant de rechercher, ajouter et supprimer des livres.
    - Affiche une liste de livres et offre un système de filtres.
- **Réseau** :
    - Exposé publiquement sur le port `8080` (lié au port `80` du conteneur).
    - Communique avec l'API via le réseau `frontend_network`.

---

## Réseau et Volumes

- **Networks** :
    - `backend_network` : Réseau privé pour la communication entre l'API et la base de données.
    - `frontend_network` : Réseau pour permettre au frontend d'appeler l'API.

- **Volumes** :
    - `db_data` : Stocke les données MySQL pour assurer la persistance des données.

---

## Utilisation de l'Application

1. **Accès au Frontend**  
   Ouvrez votre navigateur et rendez-vous sur [http://localhost:8080](http://localhost:8080).

2. **Fonctionnalités**
    - **Recherche & Filtrage** : Utilisez la barre de recherche et le select pour filtrer les livres par nom ou par genre.
    - **Ajout de Livre** : Cliquez sur le bouton "+" pour ouvrir une modal et ajoutez un nouveau livre via le formulaire.
    - **Suppression de Livre** : Utilisez le bouton "Supprimer" à côté de chaque livre pour le retirer de la base.

---

## Commande Docker Compose

Voici le fichier `docker-compose.yml` utilisé pour orchestrer les services :

```yaml
version: '3'

networks:
  backend_network:
    internal: true
  frontend_network:
    driver: bridge

services:
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: docker-librairy
      MYSQL_CHARSET: utf8mb4
      MYSQL_COLLATION: utf8mb4_unicode_ci
    volumes:
      - db_data:/var/lib/mysql
      - ./db-init/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
      interval: 5s

  api:
    build: ./node-api
    expose:
      - "3000"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - backend_network
      - frontend_network

  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - api
    networks:
      - frontend_network

volumes:
  db_data:
```

---

## Conclusion

Ce projet est une démonstration complète de la manière de construire et déployer une application web multi-conteneurs en utilisant Docker et Docker Compose. L'application vous permet de gérer une bibliothèque de livres avec une API Node.js, une base de données MySQL et un frontend dynamique, tout en étant facilement déployable et configurable.

N'hésitez pas à consulter les logs avec `docker-compose logs` pour déboguer ou personnaliser la configuration selon vos besoins.
