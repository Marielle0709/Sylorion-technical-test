const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3001;
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// Définition des options Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Facturation',
      version: '1.0.0',
      description: 'Une API de gestion de factures.',
    },
  },
  apis: [__filename], // Spécifiez le chemin de ce fichier
};

// Initialisation du swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Utilisation de swagger-ui-express pour afficher la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/facture:
 *   post:
 *     summary: Enregistre une nouvelle facture dans la base de données.
 *     tags:
 *       - Factures
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articles:
 *                 type: array
 *                 description: Liste des articles de la facture.
 *               prices:
 *                 type: array
 *                 description: Liste des prix des articles.
 *               buyer:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   address:
 *                     type: string
 *     responses:
 *       200:
 *         description: Succès - Données enregistrées dans la base de données.
 *       500:
 *         description: Erreur - Une erreur s'est produite lors de l'enregistrement des données.
 */
app.post("/api/facture", async (req, res) => {
  try {
    const { articles, prices, buyer } = req.body;

    // Générez un userId aléatoire (nombre entier)
    const userId = Math.floor(Math.random() * 1000000);

    // Vérifiez si l'utilisateur existe
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Si l'utilisateur n'existe pas, créez-le avec le buyerName
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          username: buyer.firstName + " " + buyer.lastName,
          password: "defaultPassword",
        },
      });
    }

    // Insérez les données dans la base de données via Prisma
    await prisma.facture.create({
      data: {
        articles: JSON.stringify(articles) || "",
        prices: JSON.stringify(prices) || "",
        buyerName: buyer.firstName + " " + buyer.lastName,
        buyerAddress: buyer.address,
        buyerPhone: "335543211",
        userId: user.id,
      },
    });

    res.status(200).json({
      message: "Données enregistrées avec succès dans la base de données.",
    });
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement des données dans la base de données :",
      error
    );
    res.status(500).json({
      error: "Une erreur s'est produite lors de l'enregistrement des données.",
    });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Connecte un utilisateur avec un nom d'utilisateur et un mot de passe.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *       401:
 *         description: Nom d'utilisateur ou mot de passe incorrect.
 *       500:
 *         description: Erreur - Une erreur s'est produite lors de la connexion.
 */
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findMany({
      where: {
        username: username,
        password: password,
      },
    });

    user.forEach((user) => {
      if (user && password === user.password) {
        res.status(200).json({ message: "Connexion réussie", userId: user.id, username: user.username });
      } else {
        res
          .status(401)
          .json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
      }
    });
    // Vérifiez si l'utilisateur existe et si le mot de passe est correct
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res
      .status(500)
      .json({ error: "Une erreur s'est produite lors de la connexion." });
  }
});

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Récupère la liste des utilisateurs.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Succès - Liste des utilisateurs.
 *       500:
 *         description: Erreur - Une erreur s'est produite lors de la récupération des utilisateurs.
 */
app.get("/api/user", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la récupération des utilisateurs.",
    });
  }
});

/**
 * @swagger
 * /api/factures:
 *   get:
 *     summary: Récupère la liste des factures.
 *     tags:
 *       - Factures
 *     responses:
 *       200:
 *         description: Succès - Liste des factures.
 *       500:
 *         description: Erreur - Une erreur s'est produite lors de la récupération des factures.
 */
app.get("/api/factures", async (req, res) => {
  try {
    const factures = await prisma.facture.findMany();
    res.status(200).json(factures);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la récupération des factures.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
