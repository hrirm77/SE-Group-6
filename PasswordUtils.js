class PasswordUtils {
  static isValidFormat(password) {
    return password && password.length >= 8;
  }

  static hash(password) {
    // Basic hash simulation for the purpose of the SE assignment
    let hash = 0;
    if (password.length === 0) return hash.toString();
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
}

export default PasswordUtils;
