const express = require('express');
const {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    toggleAvailability
} = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques
router.get('/', getAllProperties);                 // Récupérer tous les biens
router.get('/:id', getPropertyById);               // Récupérer un bien par ID

// Routes protégées (nécessitent un token JWT)
router.post('/', protect, admin, createProperty);  // Créer un bien (admin uniquement)
router.put('/:id', protect, admin, updateProperty); // Mettre à jour un bien
router.delete('/:id', protect, admin, deleteProperty); // Supprimer un bien
router.patch('/:id/toggle', protect, admin, toggleAvailability); // Changer la disponibilité d'un bien

module.exports = router;
