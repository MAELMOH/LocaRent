const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Modèle Property (Biens Immobiliers ou Véhicules)
const Property = sequelize.define('Property', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Le nom du bien est requis' }
        }
    },
    type: {
        type: DataTypes.ENUM('immobilier', 'vehicule'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['immobilier', 'vehicule']],
                msg: 'Le type doit être soit immobilier, soit véhicule'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'L\'adresse ou localisation est requise' }
        }
    },
    price_per_day: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: 'Le prix doit être un nombre valide' },
            min: {
                args: [1],
                msg: 'Le prix doit être supérieur à 0'
            }
        }
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,  // Désactive les champs createdAt et updatedAt automatiques
    hooks: {
        beforeCreate: (property) => {
            if (!property.description) {
                property.description = `Aucune description fournie pour ${property.name}`;
            }
        }
    }
});

// Méthode pour changer la disponibilité du bien
Property.prototype.toggleAvailability = async function () {
    this.available = !this.available;
    await this.save();
    return this;
};

module.exports = Property;
