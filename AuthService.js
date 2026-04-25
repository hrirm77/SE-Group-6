import User from './User.js';
import Session from './Session.js';

class AuthService {
  constructor(users = [], sessions = []) {
    this._users = users;
    this._sessions = sessions;
  }

  login(email, password) {
    if (!email && !password) {
      return { success: false, message: 'Email and password are required' };
    }

    if (!email) {
      return { success: false, message: 'Email is required' };
    }

    if (!password) {
      return { success: false, message: 'Password is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    const user = this._users.find((u) => u.getEmail() === email);
    if (!user) {
      return { success: false, message: 'Account not found' };
    }

    if (!user.validatePassword(password)) {
      return { success: false, message: 'Incorrect password' };
    }

    const token = `session-${user.getUserId()}`;
    const session = new Session(token, user.getUserId(), true);
    this._sessions.push(session);

    return {
      success: true,
      message: 'Successful login',
      redirect: 'dashboard',
      sessionToken: token
    };
  }

  logout(token) {
    const session = this._sessions.find((s) => s.getToken() === token);

    if (!session || !session.isActive()) {
      return {
        success: false,
        message: 'Session expired',
        redirect: 'login'
      };
    }

    session.logout();

    return {
      success: true,
      message: 'Logged out successfully',
      redirect: 'login'
    };
  }
}

export default AuthService;