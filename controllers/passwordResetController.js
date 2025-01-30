const User = require('../models/User');
const redisUtils = require('../utils/redisUtils');
const { hashPassword } = require('../utils/bcryptUtils');
const logger = require('../config/logger');
const { sendLoginMessage } = require('../producers/producer');

const resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        if (!email || !resetCode || !newPassword) {
            return res.status(400).json({ 
                message: 'Se requieren email, código de reset y nueva contraseña' 
            });
        }


        const storedCode = await redisUtils.getToken(email);
        
        if (!storedCode) {
            logger.info(`No existe código de reset para el email ${email}`);
            return res.status(400).json({ 
                message: 'Código de reset no encontrado o expirado' 
            });
        }

        if (String(resetCode) !== String(storedCode)) {
            logger.info(`Código de reset inválido para el email ${email}`);
            return res.status(400).json({ 
                message: 'Código de reset inválido' 
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const userId = user._id.toString();


        try {
            await sendLoginMessage(userId, hashedPassword);
            logger.info(`Mensaje de login enviado para usuario ${userId}`);
        } catch (error) {
            logger.error(`Error al enviar mensaje de login: ${error.message}`);
        }

        logger.info(`Contraseña actualizada exitosamente para ${email}`);
        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        logger.error('Error al resetear la contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    resetPassword
};
