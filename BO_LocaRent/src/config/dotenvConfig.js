const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Vérification des variables d'environnement essentielles
const requiredEnv = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'PORT'
];

requiredEnv.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`❌ Erreur: La variable d'environnement ${envVar} est manquante.`);
        process.exit(1); // Arrête l'application si une variable critique est absente
    }
});

console.log('✅ Variables d\'environnement chargées avec succès.');

module.exports = process.env;
