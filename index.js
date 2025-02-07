// External dependencies imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Local file imports
const connectDB = require('./config/dbConfig');
const logger = require('./config/logger');
const userCreateConsumer = require('./consumers/userCreateConsumer');
const userDeleteConsumer = require('./consumers/userDeleteConsumer');
const passwordResetRoutes = require('./routes/passwordResetRoutes');

// Initial configuration
dotenv.config();
const swaggerOptions = require('./config/swaggerConfig');
const app = express();
const PORT = process.env.PORT || 3018;
const HOST = '0.0.0.0';

// CORS configuration
const corsOptions = {
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/password-reset', passwordResetRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'auth-pass-reset' });
});

// Server and services initialization
connectDB()
  .then(() => {
    const server = app.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
      logger.info(`Swagger documentation available at http://${HOST}:${PORT}/api-docs`);
    });

    const initializeConsumers = async () => {
      try {
        await userDeleteConsumer.run();
        await userCreateConsumer.run();
        logger.info('Kafka consumers initialized successfully! 🚀');
      } catch (err) {
        logger.error('Error starting Kafka consumers:', err);
        server.close();
      }
    };

    initializeConsumers();
  })
  .catch(err => {
    logger.error('Server error:', err.message);
  });
