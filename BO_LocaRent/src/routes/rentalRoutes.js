const express = require('express');
const {
    createRental,
    getAllRentals,
    getRentalById,
    completeRental,
    cancelRental,
    deleteRental
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques
router.get('/', protect, getAllRentals);              // Récupérer tous les contrats de location
router.get('/:id', protect, getRentalById);           // Récupérer un contrat spécifique par ID

// Routes protégées (JWT)
router.post('/', protect, createRental);              // Créer un contrat de location
router.put('/:id/complete', protect, completeRental); // Terminer un contrat
router.put('/:id/cancel', protect, cancelRental);     // Annuler un contrat
router.delete('/:id', protect, admin, deleteRental);  // Supprimer un contrat (admin uniquement)

module.exports = router;
