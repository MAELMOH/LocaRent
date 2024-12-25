const Payment = require('../models/Payment');
const Rental = require('../models/Rental');

// Créer un paiement
exports.createPayment = async (req, res) => {
    const { rental_id, amount, payment_method } = req.body;

    try {
        // Vérifier si la location existe
        const rental = await Rental.findByPk(rental_id);
        if (!rental) {
            return res.status(404).json({ message: 'Contrat de location non trouvé' });
        }

        // Créer le paiement
        const payment = await Payment.create({
            rental_id,
            amount,
            payment_method,
            status: 'en attente'
        });

        res.status(201).json({
            message: 'Paiement enregistré avec succès',
            payment
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du paiement' });
    }
};

// Récupérer tous les paiements
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                { model: Rental, attributes: ['start_date', 'end_date', 'total_price'] }
            ]
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des paiements' });
    }
};

// Récupérer un paiement par ID
exports.getPaymentById = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findByPk(id, {
            include: [
                { model: Rental, attributes: ['start_date', 'end_date', 'total_price'] }
            ]
        });

        if (!payment) {
            return res.status(404).json({ message: 'Paiement non trouvé' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du paiement' });
    }
};

// Valider un paiement
exports.validatePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ message: 'Paiement non trouvé' });
        }

        // Valider le paiement
        payment.status = 'validé';
        await payment.save();

        res.json({
            message: 'Paiement validé avec succès',
            payment
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la validation du paiement' });
    }
};

// Supprimer un paiement
exports.deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ message: 'Paiement non trouvé' });
        }

        await payment.destroy();
        res.json({ message: 'Paiement supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du paiement' });
    }
};

// Récupérer les paiements d'une location spécifique
exports.getPaymentsByRental = async (req, res) => {
    const { rental_id } = req.params;

    try {
        const payments = await Payment.findAll({
            where: { rental_id }
        });

        if (payments.length === 0) {
            return res.status(404).json({ message: 'Aucun paiement trouvé pour cette location' });
        }

        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des paiements pour cette location' });
    }
};
