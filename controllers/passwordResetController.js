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
                message: 'Email, reset code and new password are required' 
            });
        }

        const storedCode = await redisUtils.getToken(email);
        
        if (!storedCode) {
            logger.info(`Reset code not found for email ${email}`);
            return res.status(400).json({ 
                message: 'Reset code not found or expired' 
            });
        }

        if (String(resetCode) !== String(storedCode)) {
            logger.info(`Invalid reset code for email ${email}`);
            return res.status(400).json({ 
                message: 'Invalid reset code' 
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = user._id.toString();

        try {
            await sendLoginMessage(userId, hashedPassword);
            logger.info(`Login message sent for user ${userId}`);
        } catch (error) {
            logger.error(`Error sending login message: ${error.message}`);
        }

        logger.info(`Password successfully updated for ${email}`);
        res.status(200).json({ message: 'Password successfully updated' });
    } catch (error) {
        logger.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    resetPassword
};
