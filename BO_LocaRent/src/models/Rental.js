const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Property = require('./Property');

// Modèle Rental (Contrats de Location)
const Rental = sequelize.define('Rental', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Property,
            key: 'id'
        }
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: { msg: 'La date de début est invalide' },
            notEmpty: { msg: 'La date de début est requise' }
        }
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: { msg: 'La date de fin est invalide' },
            notEmpty: { msg: 'La date de fin est requise' },
            isAfterStartDate(value) {
                if (new Date(value) <= new Date(this.start_date)) {
                    throw new Error('La date de fin doit être postérieure à la date de début');
                }
            }
        }
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: 'Le prix total doit être un nombre' },
            min: {
                args: [0],
                msg: 'Le prix total ne peut pas être négatif'
            }
        }
    },
    status: {
        type: DataTypes.ENUM('en cours', 'terminé', 'annulé'),
        defaultValue: 'en cours'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    hooks: {
        beforeCreate: async (rental) => {
            const property = await Property.findByPk(rental.property_id);
            if (!property.available) {
                throw new Error('Le bien n\'est pas disponible pour la location');
            }
        }
    }
});

// Associations
User.hasMany(Rental, { foreignKey: 'user_id' });
Property.hasMany(Rental, { foreignKey: 'property_id' });
Rental.belongsTo(User, { foreignKey: 'user_id' });
Rental.belongsTo(Property, { foreignKey: 'property_id' });

// Méthode pour terminer une location
Rental.prototype.completeRental = async function () {
    this.status = 'terminé';
    await this.save();
    return this;
};

// Méthode pour annuler une location
Rental.prototype.cancelRental = async function () {
    this.status = 'annulé';
    await this.save();
    return this;
};

module.exports = Rental;
