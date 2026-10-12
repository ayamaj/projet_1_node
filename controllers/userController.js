const {
    estNonVide,
    estEmailValide
} = require("../utils/validators");


// Données utilisateurs en mémoire

let users = [
    {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        role: "admin"
    },
    {
        id: 2,
        name: "Aya",
        email: "aya@gmail.com",
        role: "user"
    }
];

let prochainUserId = 3;


// 1. Récupérer tous les utilisateurs

const getAllUsers = (req, res) => {

    const { role } = req.query;

    let resultat = users;

    if (role) {
        resultat = users.filter(
            u => u.role === role
        );
    }

    res.status(200).json({
        total: resultat.length,
        users: resultat
    });
};


// 2. Récupérer un utilisateur par ID

const getUserById = (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(
        u => u.id === id
    );

    if (!user) {
        return res.status(404).json({
            error: `Utilisateur ${id} introuvable`
        });
    }

    res.status(200).json(user);
};


// 3. Créer un utilisateur

const createUser = (req, res) => {

    const {
        name,
        email,
        role
    } = req.body;


    // Validation du nom

    if (!estNonVide(name)) {
        return res.status(400).json({
            error: "Le nom est obligatoire"
        });
    }


    // Validation de l'email

    if (!estEmailValide(email)) {
        return res.status(400).json({
            error: "L'email est invalide"
        });
    }

    const nouvelUser = {
        id: prochainUserId++,
        name,
        email,
        role: role || "user"
    };


    users.push(nouvelUser);


    res.status(201).json({
        message: "Utilisateur créé",
        user: nouvelUser
    });
};


// 4. Supprimer un utilisateur

const deleteUser = (req, res) => {

    const id = Number(req.params.id);

    const userExiste = users.some(
        u => u.id === id
    );


    if (!userExiste) {
        return res.status(404).json({
            error: `Utilisateur ${id} introuvable`
        });
    }


    users = users.filter(
        u => u.id !== id
    );


    res.status(200).json({
        message: `Utilisateur ${id} supprimé avec succès`
    });
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};