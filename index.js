require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importar cors
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const { swaggerOptions } = require('./config');

const app = express();
const port = process.env.PORT || 3000;

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors()); // Usar cors
app.use(express.json());
app.use('/api/password-reset', passwordResetRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
