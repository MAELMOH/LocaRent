const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../config/jwtConfig');

// Protéger les routes avec JWT
exports.protect = async (req, res, next) => {
    let token;

    // Vérifie si le token est présent dans l'en-tête Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];  // Récupérer le token après "Bearer"
            
            // Vérifier et décoder le token
            const decoded = verifyToken(token);

            // Récupérer l'utilisateur correspondant au token (sans le mot de passe)
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }

            next();  // Passe à la route suivante
        } catch (error) {
            res.status(401).json({ message: 'Token invalide ou expiré' });
        }
    } else {
        res.status(401).json({ message: 'Accès non autorisé, aucun token fourni' });
    }
};

// Vérifier si l'utilisateur est admin
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();  // Passe à la route suivante
    } else {
        res.status(403).json({ message: 'Accès refusé, autorisation admin requise' });
    }
};

// Vérifier si l'utilisateur est propriétaire de la ressource ou admin
exports.ownerOrAdmin = (model) => async (req, res, next) => {
    const { id } = req.params;

    try {
        const resource = await model.findByPk(id);

        if (!resource) {
            return res.status(404).json({ message: 'Ressource non trouvée' });
        }

        // Vérifier si l'utilisateur est le propriétaire ou un admin
        if (resource.user_id === req.user.id || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Accès interdit, vous n\'êtes pas autorisé à accéder à cette ressource' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification des droits' });
    }
};
