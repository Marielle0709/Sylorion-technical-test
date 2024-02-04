# SYLORION Backend

Bienvenue dans l'application backend de SYLORION. Cette application est construite avec Node.js, Prisma, et MySQL.
Installation et Démarrage du Projet

 ## Installez les dépendances du projet :
    npm install

 ## Prisma

Prisma est un outil de gestion de base de données qui simplifie les opérations SQL et facilite le travail avec les bases de données relationnelles.

    Le fichier schema.prisma définit le schéma de la base de données à l'aide de la syntaxe Prisma.

    Les migrations Prisma sont utilisées pour appliquer ces changements de schéma à la base de données.

    Pour générer les fichiers Prisma, exécutez la commande suivante :

    npx prisma generate

    Vous pouvez également explorer les opérations CRUD générées automatiquement par Prisma en consultant le dossier prisma/client.

 ## API Endpoints

    L'application expose un endpoint pour enregistrer des données de facture :

        POST /api/facture

        Exemple de requête :
        {
        "articles": ["Produit A - 10.99 EUR", "Produit C - 5.99 EUR"],
        "prices": [10.99, 5.99],
        "buyer": {
            "firstName": "John",
            "lastName": "Doe",
            "address": "123 Main St, City",
            "phoneNumber": "123-456-7890"
        }
        }

        La requête enregistre la facture dans la base de données associée à un utilisateur.
        
## Configuration de la Base de Données

1. Installez MySQL sur votre machine si ce n'est pas déjà fait.

2. Créez une base de données MySQL pour l'application. Vous pouvez le faire à l'aide d'un outil comme MySQL Workbench ou via la ligne de commande.

3. Exécutez les migrations pour créer les tables nécessaires dans votre base de données :

   ```bash
   npx format prisma
   npx generate prisma
   npx prisma migrate dev
## demmarer le serveur
   ```bash
    node app.js

