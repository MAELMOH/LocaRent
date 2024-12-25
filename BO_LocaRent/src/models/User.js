const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

// Modèle Utilisateur
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Le nom d\'utilisateur est requis' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Adresse email invalide' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 100],
                msg: 'Le mot de passe doit comporter au moins 6 caractères'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'client'),
        defaultValue: 'client'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,  // Désactive la création automatique des champs createdAt/updatedAt
    hooks: {
        // Avant de créer l'utilisateur, hacher le mot de passe
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        // Avant de mettre à jour le mot de passe
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Méthode pour vérifier le mot de passe
User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
