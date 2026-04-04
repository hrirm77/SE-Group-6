import Session from './Session.js';

describe('UC9: Logout - Session model tests', () => {
  test('new session starts active', () => {
    const session = new Session('token-123', 1);

    expect(session.getToken()).toBe('token-123');
    expect(session.getUserId()).toBe(1);
    expect(session.isActive()).toBe(true);
  });

  test('logout makes session inactive', () => {
    const session = new Session('token-123', 1);

    session.logout();

    expect(session.isActive()).toBe(false);
  });

  test('inactive session stays inactive after logout', () => {
    const session = new Session('expired-token', 1, false);

    expect(session.isActive()).toBe(false);

    session.logout();

    expect(session.isActive()).toBe(false);
  });
});