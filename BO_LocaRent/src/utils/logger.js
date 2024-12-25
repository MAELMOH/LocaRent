const winston = require('winston');
const path = require('path');

// Définir les niveaux de logs personnalisés (facultatif)
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
};

// Créer un logger Winston
const logger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        // Log des erreurs dans un fichier
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error'
        }),
        // Log combiné pour toutes les autres informations
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log')
        })
    ]
});

// Ajouter la console pour le développement
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level}: ${message}`;
            })
        )
    }));
}

// Appliquer les couleurs définies
winston.addColors(customLevels.colors);

// Export du logger pour une utilisation globale
module.exports = logger;
