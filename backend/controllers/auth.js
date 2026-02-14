const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// Generic auth controller factory for a Mongoose Model
function makeAuthController(Model, roleName, LoginModel) {
  return {
    async register(req, res) {
      try {
        const data = { ...req.body, role: roleName };

        // email uniqueness across collections is enforced by server.js caller

        // create document; pre-save hook will hash password
        const doc = await Model.create(data);

        // audit
        try { await LoginModel.create({ email: data.email, role: roleName, activity: 'signup' }); } catch (e) { console.warn('signup log failed', e && e.message ? e.message : e); }

        const safe = doc.toObject ? doc.toObject() : doc;
        if (safe.password) delete safe.password;
        return res.json({ message: 'Registration successful', [roleName]: safe });
      } catch (err) {
        return res.status(400).json({ message: 'Registration failed', error: err.message });
      }
    },

    async login(req, res) {
      try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        // use select to get password for comparison
        const user = await Model.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        let passwordMatches = false;
        if (user.password && user.password.startsWith('$2')) {
          passwordMatches = await bcrypt.compare(password, user.password);
        } else {
          passwordMatches = user.password === password;
        }

        if (!passwordMatches) return res.status(401).json({ message: 'Invalid credentials' });

        const safe = user.toObject ? user.toObject() : user;
        if (safe.password) delete safe.password;

        try { await LoginModel.create({ email: user.email, role: roleName, activity: 'login' }); } catch (e) { console.warn('login log failed', e && e.message ? e.message : e); }

        return res.json({ message: 'Login successful', [roleName]: safe });
      } catch (err) {
        return res.status(500).json({ message: 'Login error', error: err.message });
      }
    },

    async update(req, res) {
      try {
        const { email, ...update } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required to identify the user' });

        // prevent changing role/accessLevel by client
        if (update.role) delete update.role;
        if (roleName === 'admin' && update.accessLevel) delete update.accessLevel;

        // for password updates, load the doc and set then save to trigger pre-save
        if (update.password) {
          const doc = await Model.findOne({ email });
          if (!doc) return res.status(404).json({ message: 'User not found' });
          doc.set(update);
          await doc.save();
          const safe = doc.toObject ? doc.toObject() : doc;
          if (safe.password) delete safe.password;
          try { await LoginModel.create({ email, role: roleName, activity: 'profile_update' }); } catch (e) { console.warn('profile update log failed', e && e.message ? e.message : e); }
          return res.json({ message: 'Changes Saved', [roleName]: safe });
        }

        const updated = await Model.findOneAndUpdate({ email }, update, { new: true }).lean();
        if (!updated) return res.status(404).json({ message: 'User not found' });
        if (updated.password) delete updated.password;

        try { await LoginModel.create({ email, role: roleName, activity: 'profile_update' }); } catch (e) { console.warn('profile update log failed', e && e.message ? e.message : e); }

        return res.json({ message: 'Changes Saved', [roleName]: updated });
      } catch (err) {
        return res.status(400).json({ message: 'Update failed', error: err.message });
      }
    }
,

    // POST /api/<role>/forgot
    async forgotPassword(req, res) {
      try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        const user = await Model.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No user with that email' });

        const resetToken = user.getResetPasswordToken();
        await user.save();

        // construct reset URL pointing to client (CLIENT_URL env) or localhost
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        const message = `You requested a password reset. Use this token or visit the link: ${resetUrl}`;

        try {
          const sendResult = await sendEmail({ to: user.email, subject: 'Password Reset', text: message });
          // If email isn't configured or we're in non-production, return the token for dev testing
          const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
          const isProd = process.env.NODE_ENV === 'production';
          if (!emailConfigured || !isProd) {
            return res.json({ message: 'Reset token generated (dev)', resetToken });
          }
          return res.json({ message: 'Reset token sent' });
        } catch (sendErr) {
          // clear token fields
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save();
          return res.status(500).json({ message: 'Failed to send reset email', error: sendErr && sendErr.message ? sendErr.message : sendErr });
        }
      } catch (err) {
        return res.status(500).json({ message: 'Forgot password error', error: err.message });
      }
    },

    // POST /api/<role>/reset/:token
    async resetPassword(req, res) {
      try {
        const { token } = req.params;
        const { password } = req.body;
        if (!token) return res.status(400).json({ message: 'Token is required' });
        if (!password) return res.status(400).json({ message: 'New password is required' });

        const crypto = require('crypto');
        const hashed = crypto.createHash('sha256').update(token).digest('hex');

        const user = await Model.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = password; // pre-save will hash
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        try { if (LoginModel) await LoginModel.create({ email: user.email, role: roleName, activity: 'profile_update' }); } catch (e) { console.warn('profile update log failed', e && e.message ? e.message : e); }

        return res.json({ message: 'Password reset successful' });
      } catch (err) {
        return res.status(500).json({ message: 'Reset password error', error: err.message });
      }
    }
  };
}

module.exports = { makeAuthController };

