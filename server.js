const express = require("express");

const articleRoutes = require("./routes/articleRoutes");

const userRoutes = require("./routes/userRoutes");


const app = express();

const PORT = 3000;


// Middleware global

app.use(express.json());


// Routes Articles

app.use(
    "/api/articles",
    articleRoutes
);


// Routes Users

app.use(
    "/api/users",
    userRoutes
);


// Route d'accueil

app.get("/", (req, res) => {

    res.json({
        message: "API du Blog - Serveur Modulaire Opérationnel (SoC)"
    });

});


// Démarrage du serveur

app.listen(PORT, () => {

    console.log(
        `Serveur modulaire en écoute sur http://localhost:${PORT}`
    );

});