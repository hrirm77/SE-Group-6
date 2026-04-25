/**
 * Session Model
 * Represents a logged-in user's session.
 * UC5 (Login), UC9 (Logout)
 * @author Michael + Advaith
 */
class Session {
  /**
   * @param {string} token
   * @param {number} userId
   * @param {boolean} active
   */
  constructor(token, userId, active = true) {
    this._token = token;
    this._userId = userId;
    this._active = active;
  }

  getToken() {
    return this._token;
  }

  getUserId() {
    return this._userId;
  }

  isActive() {
    return this._active;
  }

  logout() {
    this._active = false;
  }
}

export default Session;