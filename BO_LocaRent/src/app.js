const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import des routes
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Import des middlewares
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Logger HTTP (morgan)
app.use(morgan('dev'));

// Sécuriser les en-têtes HTTP (helmet)
app.use(helmet());

// Activer CORS pour permettre les requêtes cross-origin
app.use(cors());

// Limiteur de requêtes pour prévenir les attaques par déni de service (DDoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use(limiter);

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);

// Route de test de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur LocaRent API');
});

// Gestion des routes non trouvées
app.use(notFound);

// Gestion des erreurs globales
app.use(errorHandler);

module.exports = app;
