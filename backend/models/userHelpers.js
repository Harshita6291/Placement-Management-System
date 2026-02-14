const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function applyAuthMethods(schema) {
  // pre-save: hash password only when modified
  schema.pre('save', async function (next) {
    if (!this.isModified || !this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
  });

  // compare entered password with stored hash
  schema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  // get signed JWT token
  schema.methods.getSignedJwtToken = function () {
    return jwt.sign(
      { id: this._id.toString(), role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  };

  // generate and set password reset token (stored hashed) and expiry
  schema.methods.getResetPasswordToken = function () {
    const crypto = require('crypto');
    // raw token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // store hashed token on model and expiry
    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordToken = hashed;
    // expiry in minutes from env or default 15
    const expireMinutes = parseInt(process.env.RESET_PASSWORD_EXPIRE_MIN || '15', 10);
    this.resetPasswordExpire = Date.now() + expireMinutes * 60 * 1000;

    return resetToken;
  };
}

module.exports = { applyAuthMethods };
