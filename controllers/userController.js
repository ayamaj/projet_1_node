const User = require('../models/userModel');
const Article = require('../models/articleModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing from environment variables');
    }

    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        return res.status(200).json(user);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant invalide' });
        }

        return res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        const article = await Article.findOne({ author: req.params.id });
        if (article) {
            return res.status(400).json({
                message: 'Impossible de supprimer un utilisateur ayant des articles publiés'
            });
        }

        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: 'Utilisateur supprimé avec succès',
            id: req.params.id
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Identifiant invalide' });
        }

        return res.status(500).json({ message: err.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, bio, phone } = req.body || {};

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                message: 'Le nom, l’email et le mot de passe sont obligatoires'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            age,
            bio,
            phone,
            role: 'user'
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }

        if (err.code === 11000) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }

        return res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                message: 'L’email et le mot de passe sont obligatoires'
            });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getUserProfile = (req, res) => {
    return res.status(200).json(req.user);
};

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body || {};

        if (
            typeof oldPassword !== 'string' ||
            !oldPassword ||
            typeof newPassword !== 'string' ||
            !newPassword
        ) {
            return res.status(400).json({
                message: 'Les anciens et nouveaux mots de passe sont obligatoires'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Le nouveau mot de passe doit comporter au moins 6 caractères'
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        if (!(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body || {};
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        return res.status(200).json(user);
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

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    registerUser,
    loginUser,
    getUserProfile,
    updatePassword,
    updateUserRole
};
