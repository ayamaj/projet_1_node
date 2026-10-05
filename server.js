const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());


// DONNÉES : ARTICLES

const articles = [
    {
        id: 1,
        title: 'Bienvenue sur le blog',
        author: 'Admin'
    },
    {
        id: 2,
        title: 'Mon premier serveur Express',
        author: 'Aya'
    },
    {
        id: 3,
        title: 'Tester une API avec Postman',
        author: 'Aya'
    }
];


// DONNÉES : UTILISATEURS

const users = [
    {
        id: 1,
        name: 'Aya',
        email: 'aya@gmail.com'
    },
    {
        id: 2,
        name: 'Youssef',
        email: 'youssef@gmail.com'
    },
    {
        id: 3,
        name: 'Ali',
        email: 'ali@gmail.com'
    }
];


// GET /

app.get('/', (req, res) => {
    res.json({
        message: "Bonjour, je suis l'API du blog"
    });
});


// GET /api/articles
// Tous les articles

app.get('/api/articles', (req, res) => {

    const { author } = req.query;

    let resultat = articles;

    if (author) {
        resultat = articles.filter(a => a.author === author);
    }

    res.json({
        total: resultat.length,
        articles: resultat
    });
});


// GET /api/articles/:id
// Un seul article

app.get('/api/articles/:id', (req, res) => {

    const id = Number(req.params.id);

    const article = articles.find(a => a.id === id);

    if (!article) {
        return res.status(404).json({
            error: `Article ${id} introuvable`
        });
    }

    res.json(article);
});



// POST /api/articles
// Créer un article

let prochainId = 4;

app.post('/api/articles', (req, res) => {

    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            error: "Le titre et l’auteur sont obligatoires"
        });
    }

    const nouvelArticle = {
        id: prochainId,
        title: title,
        author: author
    };

    prochainId = prochainId + 1;

    articles.push(nouvelArticle);

    res.status(201).json({
        message: 'Article créé',
        article: nouvelArticle
    });
});


// EXERCICE 1
// GET /about

app.get('/about', (req, res) => {

    res.json({
        application: 'API du blog',
        nom: 'Aya Majdoub',
        version: '1.0.0'
    });
});


// EXERCICE 1
// GET /api/users


app.get('/api/users', (req, res) => {

    const { name } = req.query;

    let resultat = users;

    if (name) {
        resultat = users.filter(user => user.name === name);
    }

    res.json(resultat);
});



// EXERCICE 1
// GET /api/users/:id

app.get('/api/users/:id', (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            error: `Utilisateur ${id} introuvable`
        });
    }

    res.json(user);
});


// EXERCICE 1
// POST /contact

app.post('/contact', (req, res) => {

    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({
            error: "L'email et le message sont obligatoires"
        });
    }

    res.status(200).json({
        message: "Merci, votre message a bien été reçu"
    });
});


// DÉMARRER LE SERVEUR

app.listen(PORT, () => {

    console.log(`Serveur disponible sur http://localhost:${PORT}`);

});