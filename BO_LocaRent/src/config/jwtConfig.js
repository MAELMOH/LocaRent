const jwt = require('jsonwebtoken');
require('dotenv').config();

// Générer un token JWT
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },  // Payload (contenu du token)
        process.env.JWT_SECRET,  // Clé secrète
        { expiresIn: '7d' }  // Durée de validité du token
    );
};

// Vérifier et décoder un token JWT
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token invalide ou expiré');
    }
};

// Décoder un token sans le vérifier (utile pour extraire rapidement des infos)
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};
