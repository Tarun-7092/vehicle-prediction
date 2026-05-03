import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Breakdown Prediction API',
      version: '1.0.0',
      description: 'Production-ready REST API for vehicle breakdown prediction powered by ML',
      contact: {
        name: 'API Support',
        email: 'support@vehiclepredict.io',
      },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development Server' },
      { url: 'https://api.vehiclepredict.io', description: 'Production Server' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Prediction: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            engine_rpm: { type: 'number' },
            lub_oil_pressure: { type: 'number' },
            fuel_pressure: { type: 'number' },
            coolant_pressure: { type: 'number' },
            lub_oil_temp: { type: 'number' },
            coolant_temp: { type: 'number' },
            prediction: { type: 'number' },
            failure_probability: { type: 'number' },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;