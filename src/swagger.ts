import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const openapi = {
  openapi: '3.0.0',
  info: { title: 'Koinsave API', version: '1.0.0' },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      RegisterRequest: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email','password'] },
      LoginRequest: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email','password'] },
      TransferRequest: { type: 'object', properties: { toUserId: { type: 'integer' }, amount: { type: 'number' } }, required: ['toUserId','amount'] },
    },
  },
  paths: {
    '/api/auth/register': {
      post: { summary: 'Register', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } }, responses: { '201': { description: 'Created' }, '400': { description: 'Bad Request' } } }
    },
    '/api/auth/login': {
      post: { summary: 'Login', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } }, responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } } }
    },
    '/api/users/me': {
      get: { summary: 'Get current user', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } } }
    },
    '/api/transactions/transfer': {
      post: { summary: 'Transfer funds', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TransferRequest' } } } }, responses: { '201': { description: 'Created' }, '400': { description: 'Bad Request' }, '401': { description: 'Unauthorized' } } }
    },
    '/api/transactions': {
      get: { summary: 'List transactions', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } } }
    }
  }
};

export function mountSwagger(router: Router) {
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
}