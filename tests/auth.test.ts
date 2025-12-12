// tests/unit/auth.test.ts
import jwt from 'jsonwebtoken';

describe('JWT Token', () => {
  it('should create valid token', () => {
    const token = jwt.sign({ userId: '123' }, 'test-secret');
    expect(token).toBeTruthy();
  });

  it('should verify valid token', () => {
    const token = jwt.sign({ userId: '123' }, 'test-secret');
    const decoded = jwt.verify(token, 'test-secret');
    expect(decoded).toHaveProperty('userId', '123');
  });
});