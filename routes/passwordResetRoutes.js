const express = require('express');
const { resetPassword } = require('../controllers/passwordResetController');
const router = express.Router();

/**
 * @swagger
 * /api/password-reset:
 *   post:
 *     tags:
 *       - Password Reset
 *     summary: Reset user password
 *     description: Reset user password using email and reset code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - resetCode
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               resetCode:
 *                 type: string
 *                 description: Reset code sent to user
 *               newPassword:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid reset code or email
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/', resetPassword);

module.exports = router;
