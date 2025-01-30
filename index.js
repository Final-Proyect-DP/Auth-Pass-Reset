const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const logger = require('./config/logger');
const userCreateConsumer = require('./consumers/userCreateConsumer');
const userDeleteConsumer = require('./consumers/userDeleteConsumer');
const passwordResetRoutes = require('./routes/passwordResetRoutes'); // Agregar esta línea

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Ensure dotenv is loaded before importing swaggerOptions
dotenv.config();
const swaggerOptions = require('./config/swaggerConfig');

const app = express();
const PORT = process.env.PORT || 3018;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Agregar las rutas de password reset
app.use('/api/password-reset', passwordResetRoutes);

connectDB().then(() => {
  const server = app.listen(PORT, HOST, () => {
    logger.info(`Server running on http://${HOST}:${PORT}`);
    logger.info(`Swagger documentation available at http://${HOST}:${PORT}/api-docs`);
  });

  // Start Kafka consumers
  userCreateConsumer.run().catch(err => {
    logger.error('Error starting userCreateConsumer:', err);
  });
  // userDeleteConsumer.run().catch(err => {
  //   logger.error('Error starting userDeleteConsumer:', err);
  // });


}).catch(err => {
  logger.error('Server error:', err.message, err.stack);
});
