// tests/integration/server.test.ts
import request from 'supertest';
import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

describe('Server Health Check', () => {
  it('should return 200 on health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});