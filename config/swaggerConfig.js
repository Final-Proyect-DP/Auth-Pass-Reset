require('dotenv').config();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth and Password Reset API',
      version: '1.0.0',
      description: 'API for authentication and password reset'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3013}`,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        PasswordReset: {
          type: 'object',
          required: ['email', 'resetCode', 'newPassword'],
          properties: {
            email: {
              type: 'string',
              description: 'User email'
            },
            resetCode: {
              type: 'string',
              description: 'Reset code'
            },
            newPassword: {
              type: 'string',
              description: 'New password'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerOptions;