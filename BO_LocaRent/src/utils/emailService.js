const nodemailer = require('nodemailer');
require('dotenv').config();
const logger = require('./logger');

// Configuration du transporteur (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fonction générique pour envoyer des emails
const sendEmail = async (to, subject, text, html = null) => {
    const mailOptions = {
        from: `"LocaRent" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`📧 Email envoyé à ${to} : ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error(`❌ Erreur lors de l'envoi de l'email à ${to}: ${error.message}`);
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
};

// Fonction pour envoyer un email de bienvenue
const sendWelcomeEmail = async (userEmail, username) => {
    const subject = 'Bienvenue chez LocaRent 🚀';
    const text = `Bonjour ${username},\n\nBienvenue sur LocaRent. Nous sommes ravis de vous compter parmi nous !`;
    const html = `
        <h1>Bienvenue ${username} !</h1>
        <p>Merci de rejoindre LocaRent. Si vous avez des questions, n'hésitez pas à nous contacter.</p>
    `;

    await sendEmail(userEmail, subject, text, html);
};

// Fonction pour envoyer une notification de paiement
const sendPaymentNotification = async (userEmail, amount) => {
    const subject = 'Confirmation de votre paiement';
    const text = `Votre paiement de ${amount}€ a bien été reçu. Merci pour votre confiance.`;
    const html = `
        <h1>Paiement reçu</h1>
        <p>Nous avons bien reçu votre paiement de <strong>${amount}€</strong>.</p>
    `;

    await sendEmail(userEmail, subject, text, html);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendPaymentNotification
};
