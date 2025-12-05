const request = require('supertest');
const app = require('../../src/app');

describe('Prueba de integración: creación de producto', () => {

  test('Crea un item correctamente', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ sku: 'A-001', nombre: 'Cable HDMI', stockMin: 2 });

    expect(res.status).toBe(201);
    expect(res.body.data.sku).toBe('A-001');
    expect(res.body.data.nombre).toBe('Cable HDMI');
    expect(res.body.data.stock).toBe(0);
  });

});
