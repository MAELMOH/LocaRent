const Rental = require('../models/Rental');
const Property = require('../models/Property');
const User = require('../models/User');

// Créer un contrat de location
exports.createRental = async (req, res) => {
    const { user_id, property_id, start_date, end_date, total_price } = req.body;

    try {
        // Vérifier si le bien est disponible
        const property = await Property.findByPk(property_id);
        if (!property || !property.available) {
            return res.status(400).json({ message: 'Le bien n\'est pas disponible' });
        }

        // Créer le contrat de location
        const newRental = await Rental.create({
            user_id,
            property_id,
            start_date,
            end_date,
            total_price
        });

        // Mettre à jour la disponibilité du bien à indisponible
        property.available = false;
        await property.save();

        res.status(201).json({
            message: 'Contrat de location créé avec succès',
            rental: newRental
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du contrat de location' });
    }
};

// Récupérer tous les contrats de location
exports.getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.findAll({
            include: [
                { model: Property, attributes: ['name', 'location', 'type'] },
                { model: User, attributes: ['username', 'email'] }
            ]
        });

        res.json(rentals);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des contrats de location' });
    }
};

// Récupérer un contrat par ID
exports.getRentalById = async (req, res) => {
    const { id } = req.params;

    try {
        const rental = await Rental.findByPk(id, {
            include: [
                { model: Property, attributes: ['name', 'location', 'type'] },
                { model: User, attributes: ['username', 'email'] }
            ]
        });

        if (!rental) {
            return res.status(404).json({ message: 'Contrat de location non trouvé' });
        }

        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du contrat de location' });
    }
};

// Terminer un contrat de location
exports.completeRental = async (req, res) => {
    const { id } = req.params;

    try {
        const rental = await Rental.findByPk(id);

        if (!rental) {
            return res.status(404).json({ message: 'Contrat de location non trouvé' });
        }

        // Terminer la location
        rental.status = 'terminé';
        await rental.save();

        // Rendre le bien à nouveau disponible
        const property = await Property.findByPk(rental.property_id);
        property.available = true;
        await property.save();

        res.json({
            message: 'Contrat de location terminé avec succès',
            rental
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la clôture du contrat de location' });
    }
};

// Annuler un contrat de location
exports.cancelRental = async (req, res) => {
    const { id } = req.params;

    try {
        const rental = await Rental.findByPk(id);

        if (!rental) {
            return res.status(404).json({ message: 'Contrat de location non trouvé' });
        }

        // Annuler la location
        rental.status = 'annulé';
        await rental.save();

        // Rendre le bien disponible à nouveau
        const property = await Property.findByPk(rental.property_id);
        property.available = true;
        await property.save();

        res.json({
            message: 'Contrat de location annulé avec succès',
            rental
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'annulation du contrat de location' });
    }
};

// Supprimer un contrat de location
exports.deleteRental = async (req, res) => {
    const { id } = req.params;

    try {
        const rental = await Rental.findByPk(id);

        if (!rental) {
            return res.status(404).json({ message: 'Contrat de location non trouvé' });
        }

        // Suppression du contrat
        await rental.destroy();

        res.json({ message: 'Contrat de location supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du contrat de location' });
    }
};
