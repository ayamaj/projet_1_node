const Article = require('../models/articleModel');

const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate('author', 'name email role');
        const resultat = req.query.author
            ? articles.filter(article => article.author?.name === req.query.author)
            : articles;

        return res.status(200).json({
            total: resultat.length,
            articles: resultat
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getMyArticles = async (req, res) => {
    try {
        const articles = await Article.find({ author: req.user._id })
            .populate('author', 'name email role');

        return res.status(200).json({
            total: articles.length,
            articles
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'name email role');

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable' });
        }

        return res.status(200).json(article);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: 'Identifiant de ressource invalide (format ObjectId attendu)'
            });
        }

        return res.status(500).json({ message: err.message });
    }
};

const createArticle = async (req, res) => {
    try {
        const { title, content } = req.body || {};

        if (
            typeof title !== 'string' ||
            !title.trim() ||
            typeof content !== 'string' ||
            !content.trim()
        ) {
            return res.status(400).json({
                message: 'Le titre et le contenu sont obligatoires'
            });
        }

        const newArticle = await Article.create({
            title: title.trim(),
            content: content.trim(),
            author: req.user._id
        });

        const populated = await newArticle.populate('author', 'name email role');
        return res.status(201).json(populated);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }
};

const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable' });
        }

        if (
            article.author.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: "Action interdite : vous n'êtes pas l'auteur de cet article"
            });
        }

        const { title, content } = req.body || {};
        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({ message: 'Le titre ne peut pas être vide' });
            }
            article.title = title.trim();
        }

        if (content !== undefined) {
            if (typeof content !== 'string' || !content.trim()) {
                return res.status(400).json({ message: 'Le contenu ne peut pas être vide' });
            }
            article.content = content.trim();
        }

        if (title === undefined && content === undefined) {
            return res.status(400).json({
                message: 'Au moins un champ (title ou content) est requis'
            });
        }

        const updated = await article.save();
        const populated = await updated.populate('author', 'name email role');
        return res.status(200).json(populated);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant invalide' });
        }

        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article introuvable' });
        }

        if (
            article.author.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: "Action interdite : vous n'êtes pas l'auteur de cet article"
            });
        }

        await Article.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: 'Article supprimé avec succès',
            id: req.params.id
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant invalide' });
        }

        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllArticles,
    getMyArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
