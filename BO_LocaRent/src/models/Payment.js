const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Rental = require('./Rental');

// Modèle Payment (Paiements)
const Payment = sequelize.define('Payment', {
    rental_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Rental,
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: 'Le montant doit être un nombre valide' },
            min: {
                args: [0.01],
                msg: 'Le montant doit être supérieur à zéro'
            }
        }
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    payment_method: {
        type: DataTypes.ENUM('carte', 'virement', 'espèces'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['carte', 'virement', 'espèces']],
                msg: 'Méthode de paiement invalide'
            }
        }
    },
    status: {
        type: DataTypes.ENUM('validé', 'en attente'),
        defaultValue: 'en attente'
    }
}, {
    timestamps: false,
    hooks: {
        beforeCreate: async (payment) => {
            const rental = await Rental.findByPk(payment.rental_id);
            if (!rental) {
                throw new Error('La location associée n\'existe pas');
            }
        }
    }
});

// Association avec Rental (clé étrangère)
Rental.hasMany(Payment, { foreignKey: 'rental_id' });
Payment.belongsTo(Rental, { foreignKey: 'rental_id' });

// Méthode pour valider un paiement
Payment.prototype.validatePayment = async function () {
    this.status = 'validé';
    await this.save();
    return this;
};

module.exports = Payment;
