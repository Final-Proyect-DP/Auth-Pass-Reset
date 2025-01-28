require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const { swaggerOptions } = require('./config');
const userCreateConsumer = require('./consumers/userCreateConsumer');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

userCreateConsumer.run().catch(console.error);

app.use(cors());
app.use(express.json());
app.use('/api/password-reset', passwordResetRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
