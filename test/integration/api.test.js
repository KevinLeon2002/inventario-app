const request = require('supertest');
const app = require('../../src/app');

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    test('GET /api/health debe retornar estado OK', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Auth API', () => {
    test('Login con credenciales correctas retorna éxito', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@tecnorepuestos.com',
          password: 'Admin123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Login con credenciales incorrectas falla', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@tecnorepuestos.com',
          password: 'WrongPassword!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});