
const express = require("express");
const dotenv = require("dotenv");

const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(express.json());

// Routes Articles
app.use("/api/articles", articleRoutes);

// Routes Users
app.use("/api/users", userRoutes);

// Route d'accueil
app.get("/", (req, res) => {
    res.json({
        message: "API du Blog - Serveur Modulaire Opérationnel (SoC)"
    });
});

// Connexion à MongoDB et démarrage du serveur
const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);

        app.listen(PORT, () => {
            console.log(
                `Serveur modulaire en écoute sur http://localhost:${PORT}`
            );
        });
    } catch (err) {
        console.error(
            "Erreur lors du démarrage du serveur :",
            err.message
        );
        process.exit(1);
    }
};

startServer();
