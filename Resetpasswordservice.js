// ResetPasswordService.js - UC7: Reset Password
// Handles both steps: (1) request reset link, (2) submit new password

const PasswordUtils = require("./PasswordUtils");

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

class ResetPasswordService {
  /**
   * @param {Database}     db
   * @param {EmailService} emailService
   */
  constructor(db, emailService) {
    this.db = db;
    this.emailService = emailService;
  }

  // ─── STEP 1: Request a password reset ────────────────────────────────────────

  /**
   * Validates email, generates a reset token, stores it, and emails it.
   * Returns { success, message }
   */
  requestReset(email) {
    // Exceptional: empty / missing email
    if (!email || typeof email !== "string" || email.trim() === "") {
      return { success: false, message: "Email is required." };
    }

    // Exceptional: invalid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, message: "Invalid email format." };
    }

    const user = this.db.findUserByEmail(email.trim());

    // Invalid: email not registered — we still return a generic message
    // (security best practice: don't confirm whether the email exists)
    if (!user) {
      return {
        success: true,
        message:
          "If that email is registered, a reset link has been sent.",
      };
    }

    // Generate token and set expiry
    const token = this._generateToken();
    const expiry = new Date(Date.now() + TOKEN_EXPIRY_MS);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    this.db.saveUser(user);

    this.emailService.sendPasswordResetEmail(user.email, token);

    return {
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    };
  }

  // ─── STEP 2: Submit new password using the token ─────────────────────────────

  /**
   * Validates token and new password, then updates the user's password.
   * Returns { success, message }
   */
  resetPassword(token, newPassword, confirmPassword) {
    // Exceptional: missing token
    if (!token || typeof token !== "string" || token.trim() === "") {
      return { success: false, message: "Reset token is required." };
    }

    // Exceptional: missing new password
    if (!newPassword || typeof newPassword !== "string" || newPassword.trim() === "") {
      return { success: false, message: "New password is required." };
    }

    // Exceptional: missing confirm password
    if (!confirmPassword || typeof confirmPassword !== "string" || confirmPassword.trim() === "") {
      return { success: false, message: "Please confirm your new password." };
    }

    // Invalid: passwords don't match
    if (newPassword !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    // Invalid: password too short (< 8 chars)
    if (!PasswordUtils.isValidFormat(newPassword)) {
      return {
        success: false,
        message: "Password must be at least 8 characters.",
      };
    }

    const user = this.db.findUserByResetToken(token.trim());

    // Invalid: token not found
    if (!user) {
      return { success: false, message: "Invalid or expired reset token." };
    }

    // Invalid: token expired
    if (!user.isResetTokenValid(token.trim())) {
      return { success: false, message: "Invalid or expired reset token." };
    }

    // Valid: update password and clear token
    user.passwordHash = PasswordUtils.hash(newPassword);
    user.clearResetToken();
    this.db.saveUser(user);

    return { success: true, message: "Password has been reset successfully." };
  }

  // ─── Private helper ───────────────────────────────────────────────────────────

  _generateToken() {
    // Produces a simple alphanumeric token (real app: use crypto.randomBytes)
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

module.exports = ResetPasswordService;