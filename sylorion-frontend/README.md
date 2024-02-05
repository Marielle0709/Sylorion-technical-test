# SYLORION Frontend
Bienvenue dans l'application frontend de SYLORION. Cette application est construite avec React.

## Configuration et Démarrage du Projet

1. Installez Node.js sur votre machine si ce n'est pas déjà fait.

2. Clonez le répertoire du projet et accédez à la partie frontend :

   ```bash
   git clone https://github.com/Marielle0709/sylorion-technical-test.git
   cd sylorion-frontend

## Installez les dépendances du projet :
    bash
    npm install


## Démarrer l'application en mode développement :
    bash
    npm start
    Cela lancera l'application sur http://localhost:3000.

## Composants React

    L'application est structurée avec différents composants React pour faciliter la maintenance et la réutilisation du code. Voici une brève explication des principaux composants :

        OCRComponent: Composant principal pour l'analyse de factures. Il intègre la fonctionnalité de glisser-déposer pour télécharger les factures.

        MyDropzone: Un composant fonctionnel utilisant react-dropzone pour gérer le téléchargement de fichiers.

        Autres composants: D'autres composants peuvent être présents pour afficher les articles, les prix et les informations de l'acheteur.

## Communication avec le Backend

    Assurez-vous que le backend est en cours d'exécution à l'adresse spécifiée dans le fichier .env. Par défaut, l'application frontend suppose que le backend est accessible sur http://localhost:3001.# Getting Started with Create React App

    This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## builder le projet avec maven
    mvn clean install
