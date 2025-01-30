const User = require('../models/User');
const redisUtils = require('../utils/redisUtils');
const { hashPassword } = require('../utils/bcryptUtils');
const logger = require('../config/logger');
const { sendLoginMessage } = require('../producers/producer');

const resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        // Verificar que todos los campos necesarios estén presentes
        if (!email || !resetCode || !newPassword) {
            return res.status(400).json({ 
                message: 'Se requieren email, código de reset y nueva contraseña' 
            });
        }

        // Verificar el código de reset usando Redis
        try {
            await redisUtils.verifyResetCode(email, resetCode);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
        

        // Si el código es válido, actualizar la contraseña
        const hashedPassword = await hashPassword(newPassword);
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        const userId = user._id.toString();

        console.log('id:', userId);


        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Enviar mensaje a Kafka con las nuevas credenciales
        try {
            await sendLoginMessage(userId, hashedPassword);
            logger.info(`Mensaje de login enviado para usuario ${user._id}`);
        } catch (error) {
            logger.error(`Error al enviar mensaje de login: ${error.message}`);
            // Continuamos con la respuesta exitosa aunque falle el envío del mensaje
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
