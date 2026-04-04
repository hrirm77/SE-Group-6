import AuthService from './AuthService.js';
import User from './User.js';

describe('AuthService tests', () => {
  let authService;

  beforeEach(() => {
    const users = [new User(1, 'user@mealcraft.com', 'PassWord1')];
    authService = new AuthService(users, []);
  });

  test('login success', () => {
    const result = authService.login('user@mealcraft.com', 'PassWord1');

    expect(result.success).toBe(true);
    expect(result.message).toBe('Successful login');
    expect(result.redirect).toBe('dashboard');
    expect(result.sessionToken).toBeDefined();
  });

  test('incorrect password', () => {
    const result = authService.login('user@mealcraft.com', 'WrongPsswd');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Incorrect password');
  });

  test('account not found', () => {
    const result = authService.login('nobody@mealcraft.com', 'PassWord1');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Account not found');
  });

  test('email is required', () => {
    const result = authService.login('', 'PassWord1');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Email is required');
  });

  test('password is required', () => {
    const result = authService.login('user@mealcraft.com', '');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Password is required');
  });

  test('email and password are required', () => {
    const result = authService.login('', '');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Email and password are required');
  });

  test('invalid email format', () => {
    const result = authService.login('notanemail', 'ab');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email format');
  });

  test('logout success', () => {
    const loginResult = authService.login('user@mealcraft.com', 'PassWord1');
    const result = authService.logout(loginResult.sessionToken);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Logged out successfully');
    expect(result.redirect).toBe('login');
  });

  test('logout expired session', () => {
    const result = authService.logout('expired-token');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Session expired');
    expect(result.redirect).toBe('login');
  });
});