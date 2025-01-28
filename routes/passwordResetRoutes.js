const express = require('express');
const { resetPassword } = require('../controllers/passwordResetController');
const router = express.Router();

/**
 * @swagger
 * /api/password-reset:
 *   post:
 *     summary: Reset user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *               resetCode:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid reset code
 *       500:
 *         description: Internal server error
 */
router.post('/', resetPassword);

module.exports = router;
