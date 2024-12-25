const Property = require('../models/Property');

// Créer un bien immobilier ou véhicule
exports.createProperty = async (req, res) => {
    const { name, type, description, location, price_per_day, available } = req.body;

    try {
        const newProperty = await Property.create({
            name,
            type,
            description,
            location,
            price_per_day,
            available
        });

        res.status(201).json({
            message: 'Bien créé avec succès',
            property: newProperty
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du bien' });
    }
};

// Récupérer tous les biens disponibles
exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.findAll();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des biens' });
    }
};

// Récupérer un bien par son ID
exports.getPropertyById = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id);

        if (!property) {
            return res.status(404).json({ message: 'Bien non trouvé' });
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du bien' });
    }
};

// Mettre à jour un bien existant
exports.updateProperty = async (req, res) => {
    const { id } = req.params;
    const { name, type, description, location, price_per_day, available } = req.body;

    try {
        const property = await Property.findByPk(id);

        if (!property) {
            return res.status(404).json({ message: 'Bien non trouvé' });
        }

        // Mise à jour des champs
        property.name = name || property.name;
        property.type = type || property.type;
        property.description = description || property.description;
        property.location = location || property.location;
        property.price_per_day = price_per_day || property.price_per_day;
        property.available = available !== undefined ? available : property.available;

        await property.save();

        res.json({
            message: 'Bien mis à jour avec succès',
            property
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du bien' });
    }
};

// Supprimer un bien
exports.deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id);

        if (!property) {
            return res.status(404).json({ message: 'Bien non trouvé' });
        }

        await property.destroy();
        res.json({ message: 'Bien supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du bien' });
    }
};

// Changer la disponibilité d'un bien
exports.toggleAvailability = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id);

        if (!property) {
            return res.status(404).json({ message: 'Bien non trouvé' });
        }

        property.available = !property.available;
        await property.save();

        res.json({
            message: `La disponibilité du bien a été changée à ${property.available ? 'disponible' : 'indisponible'}`,
            property
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du changement de disponibilité' });
    }
};
