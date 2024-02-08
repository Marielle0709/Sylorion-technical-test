const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 3001;
const bcrypt = require("bcrypt");
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

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

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findMany({
      where: {
        username: username,
        password: password,
      },
    });
    console.log(user);
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

// Endpoint pour afficher les factures d'un utilisateur
app.get("/api/user/:userId/factures", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Recherchez les factures associées à l'utilisateur
    const factures = await prisma.facture.findMany({
      where: { userId },
    });

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
