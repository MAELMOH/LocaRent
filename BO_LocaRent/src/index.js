const app = require('./app');
const { connectDB } = require('./config/db');
require('./config/dotenvConfig');
const logger = require('./utils/logger');

// Définition du port
const PORT = process.env.PORT || 5000;

// Connexion à la base de données
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`🚀 Serveur lancé sur le port ${PORT}`);
            console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error(`❌ Erreur lors du démarrage du serveur : ${error.message}`);
        process.exit(1); // Arrêter l'application en cas d'erreur critique
    }
};

startServer();
