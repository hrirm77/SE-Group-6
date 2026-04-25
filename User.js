/**
 * User Model
 * Represents a registered user.
 * UC5 (Login)
 * @author Michael + Advaith
 */
class User {
  /**
   * @param {number} userId
   * @param {string} email
   * @param {string} password
   */
  constructor(userId, email, password) {
    this._userId = userId;
    this._email = email;
    this._password = password;
  }

  getUserId() {
    return this._userId;
  }

  getEmail() {
    return this._email;
  }

  getPassword() {
    return this._password;
  }

  validatePassword(password) {
    return this._password === password;
  }
}

export default User;