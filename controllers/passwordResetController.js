const bcryptUtils = require('../utils/bcryptUtils');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

const resetPassword = async (req, res) => {
  const { mail, resetCode, newPassword } = req.body;

  console.log('Petición recibida:', req.body);

  if (!resetCode) {
    return res.status(400).json({ error: 'Código de recuperación no proporcionado' });
  }

  try {
    const originalCode = await redisService.getCode(mail);

    console.log('Código original de Redis:', originalCode);
    console.log('Código proporcionado por el usuario:', resetCode);

    if (!originalCode || !resetCode) {
      return res.status(400).json({ error: 'Datos insuficientes para comparar códigos' });
    }

    // Comparar los dos códigos directamente sin hashearlos
    if (resetCode === originalCode) {
      const hashedPassword = await bcryptUtils.hashPassword(newPassword);
      await mongoService.updatePassword(mail, hashedPassword);
      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } else {
      res.status(400).json({ error: 'Código de recuperación incorrecto' });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

module.exports = { resetPassword };
