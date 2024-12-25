const express = require('express');
const {
    createPayment,
    getAllPayments,
    getPaymentById,
    validatePayment,
    deletePayment,
    getPaymentsByRental
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes publiques protégées (JWT)
router.get('/', protect, getAllPayments);                // Récupérer tous les paiements
router.get('/:id', protect, getPaymentById);             // Récupérer un paiement par ID
router.get('/rental/:rental_id', protect, getPaymentsByRental); // Récupérer les paiements par contrat

// Routes protégées (JWT)
router.post('/', protect, createPayment);                // Enregistrer un paiement
router.put('/:id/validate', protect, admin, validatePayment);  // Valider un paiement (admin)
router.delete('/:id', protect, admin, deletePayment);    // Supprimer un paiement (admin)

module.exports = router;
