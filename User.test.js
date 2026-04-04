import User from './User.js';

describe('UC5: Login - User model tests', () => {
  let user;

  beforeEach(() => {
    user = new User(1, 'user@mealcraft.com', 'PassWord1');
  });

  test('valid password returns true', () => {
    expect(user.getUserId()).toBe(1);
    expect(user.getEmail()).toBe('user@mealcraft.com');
    expect(user.validatePassword('PassWord1')).toBe(true);
  });

  test('invalid password returns false', () => {
    expect(user.validatePassword('WrongPsswd')).toBe(false);
  });

  test('empty password returns false', () => {
    expect(user.validatePassword('')).toBe(false);
  });
});