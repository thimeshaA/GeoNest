const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/index');
const User = require('../../server/models/User');

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    close: jest.fn().mockResolvedValue(true)
  }
}));

// Mock the User model
const mockUser = {
  _id: '123',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  save: jest.fn(),
  comparePassword: jest.fn()
};

jest.mock('../../server/models/User', () => {
  function UserMock(data) {
    return {
      ...mockUser,
      ...data
    };
  }
  UserMock.findOne = jest.fn();
  return UserMock;
});

describe('Authentication Routes', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockUser.save.mockClear();
    mockUser.comparePassword.mockClear();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      mockUser.save.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not register a user with existing email', async () => {
      const existingUser = {
        _id: '123',
        username: 'existinguser',
        email: 'test@example.com'
      };

      User.findOne.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not login with invalid credentials', async () => {
      mockUser.comparePassword.mockResolvedValue(false);
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
}); 