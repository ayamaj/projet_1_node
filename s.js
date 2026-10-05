//serveur
const express = require('express');   // 1. load the Express framework module
const app = express();                // 2. instantiate the server application
const PORT = 3000;

// 3. route definition: executed when a client requests GET /
app.get('/', (req, res) => {
  res.json({ message: "Hello, I am the blog API" });
});

// Nos données. Elles reviennent à l'état initial à chaque redémarrage :
// MongoDB les rendra permanentes à la séance 3.
const articles = [
  { id: 1, title: 'Bienvenue sur le blog', author: 'Admin' },
  { id: 2, title: 'Mon premier serveur Express', author: 'Aya' },
  { id: 3, title: 'Tester une API avec Postman', author: 'Aya' }
];

// GET /api/articles -> tous les articles
app.get('/api/articles', (req, res) => {
  res.json({ total: articles.length, articles: articles });
});

// GET /api/articles/2 -> l'article dont l'id vaut 2
app.get('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id);          // "2" -> 2
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ error: `Article ${id} introuvable` });
  }
  res.json(article);
});

// GET /api/articles            -> tous les articles
// GET /api/articles?author=Aya -> seulement ceux d'Aya
app.get('/api/articles', (req, res) => {
  const { author } = req.query;   // = const author = req.query.author;

  let resultat = articles;
  if (author) {                   // si le client a précisé ?author=...
    resultat = articles.filter(a => a.author === author);
  }
  res.json({ total: resultat.length, articles: resultat });
});

// 4. bind and listen: await incoming HTTP requests on port 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 

let prochainId = 4;   // le prochain id à attribuer (les ids 1, 2 et 3 existent déjà)

// POST /api/articles -> crée un article avec { "title": "...", "author": "..." }
app.post('/api/articles', (req, res) => {
  const { title, author } = req.body;   // déstructuration (étape 5)

  if (!title || !author) {   // validation : les deux champs sont obligatoires
    return res.status(400).json({ error: "Le titre et l'auteur sont obligatoires" });
  }

  const nouvelArticle = { id: prochainId, title: title, author: author };
  prochainId = prochainId + 1;
  articles.push(nouvelArticle);

  res.status(201).json({ message: 'Article créé', article: nouvelArticle });
});