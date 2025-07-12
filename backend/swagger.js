const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task API',
      version: '1.0.0',
      description: 'API documentation for Task Management App',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Match your backend
      },
    ],
  },
  apis: ['./swaggerroute/*.js'], // Adjust path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
