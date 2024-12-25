const { Sequelize } = require('sequelize');
require('dotenv').config();

// Création de la connexion Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false // Désactive les logs SQL (utile pour la production)
    }
);

// Fonction pour tester la connexion à la base de données
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données réussie');
    } catch (error) {
        console.error('❌ Échec de la connexion à la base de données:', error.message);
        process.exit(1); // Arrête l'application en cas d'erreur
    }
};

// Synchronisation des modèles avec la base de données
const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true }); // `alter: true` met à jour la DB sans perte de données
        console.log('🔄 Base de données synchronisée');
    } catch (error) {
        console.error('❌ Échec de la synchronisation:', error.message);
    }
};

module.exports = { sequelize, connectDB, syncDB };
