// Vérifie si une chaîne n'est pas vide

const estNonVide = (chaine) => {

    return typeof chaine === "string"
        && chaine.trim().length > 0;

};

// Vérifie si un email est valide

const estEmailValide = (email) => {

    return typeof email === "string"
        && email.includes("@")
        && email.includes(".");

};

module.exports = {
    estNonVide,
    estEmailValide
};