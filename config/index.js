const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Password Reset Service',
      version: '1.0.0',
      description: 'API for resetting passwords',
    },
    servers: [
      {
        url: 'http://localhost:3013',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

module.exports = { swaggerOptions };
