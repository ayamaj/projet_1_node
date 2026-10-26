const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length).trim()
        : '';

    if (!token) {
        return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET is missing from environment variables' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Votre session a expiré, veuillez vous reconnecter'
            });
        }

        return res.status(401).json({
            message: 'Non autorisé, token invalide'
        });
    }

    try {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({
                message: 'Non autorisé, utilisateur introuvable'
            });
        }

        return next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user?.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        message: 'Accès refusé : droits administrateur requis'
    });
};

module.exports = { protect, adminOnly };
