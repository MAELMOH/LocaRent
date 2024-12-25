const { body, validationResult } = require('express-validator');

// Middleware de validation des données pour l'inscription d'un utilisateur
exports.validateUserRegistration = [
    body('username')
        .notEmpty().withMessage('Le nom d\'utilisateur est requis')
        .isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit comporter au moins 3 caractères'),

    body('email')
        .notEmpty().withMessage('L\'email est requis')
        .isEmail().withMessage('L\'email n\'est pas valide'),

    body('password')
        .notEmpty().withMessage('Le mot de passe est requis')
        .isLength({ min: 6 }).withMessage('Le mot de passe doit comporter au moins 6 caractères'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware de validation pour la création d'un bien (property)
exports.validateProperty = [
    body('name')
        .notEmpty().withMessage('Le nom du bien est requis'),

    body('type')
        .notEmpty().withMessage('Le type de bien est requis')
        .isIn(['immobilier', 'vehicule']).withMessage('Le type doit être soit immobilier, soit vehicule'),

    body('price_per_day')
        .notEmpty().withMessage('Le prix par jour est requis')
        .isFloat({ min: 1 }).withMessage('Le prix doit être supérieur à 0'),

    body('location')
        .notEmpty().withMessage('La localisation est requise'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware de validation pour la création d'un contrat de location
exports.validateRental = [
    body('user_id')
        .notEmpty().withMessage('L\'ID utilisateur est requis')
        .isInt().withMessage('L\'ID utilisateur doit être un nombre entier'),

    body('property_id')
        .notEmpty().withMessage('L\'ID du bien est requis')
        .isInt().withMessage('L\'ID du bien doit être un nombre entier'),

    body('start_date')
        .notEmpty().withMessage('La date de début est requise')
        .isISO8601().withMessage('La date de début doit être une date valide'),

    body('end_date')
        .notEmpty().withMessage('La date de fin est requise')
        .isISO8601().withMessage('La date de fin doit être une date valide')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.start_date)) {
                throw new Error('La date de fin doit être postérieure à la date de début');
            }
            return true;
        }),

    body('total_price')
        .notEmpty().withMessage('Le prix total est requis')
        .isFloat({ min: 0 }).withMessage('Le prix total ne peut pas être négatif'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
