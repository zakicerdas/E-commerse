import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/api/v1',
      },
    ],
  },

  // ⚠️ PRODUKSI = DIST
  apis: ['./dist/routes/*.js'],
};

export default swaggerJsdoc(options);
