const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (fallback to local URI)
// strip surrounding quotes if .env value was quoted (dotenv keeps quotes)
let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pms';
// strip surrounding quotes if .env value was quoted
mongoUri = typeof mongoUri === 'string' ? mongoUri.replace(/^['"]|['"]$/g, '') : mongoUri;
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err && err.message ? err.message : err));

// Base schema fields shared by user types
const baseFields = {
  name: String,
  email: { type: String, index: true, unique: false },
  password: String,
  phone: String,
  year: String,
  course: String,
  cgpa: String,
  skills: String,
  role: String,
  // faculty-specific fields (optional for other roles)
  employeeId: String,
  department: String,
  designation: String,
  specialization: String,
  experience: String,
};

// Create schemas and models for each user type
const studentSchema = new mongoose.Schema(baseFields, { timestamps: true });
const facultySchema = new mongoose.Schema(baseFields, { timestamps: true });

// TPO schema: intentionally remove `experience` from TPO documents
const tpoFields = { ...baseFields };
delete tpoFields.experience;
const tpoSchema = new mongoose.Schema(tpoFields, { timestamps: true });

// Admin schema: remove `department` and add `accessLevel`
const adminFields = { ...baseFields };
adminFields.accessLevel = String;
delete adminFields.department;
const adminSchema = new mongoose.Schema(adminFields, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
const Faculty = mongoose.model('Faculty', facultySchema);
const Tpo = mongoose.model('Tpo', tpoSchema);
const Admin = mongoose.model('Admin', adminSchema);

// One-time admin cleanup: remove department and ensure accessLevel exists (default 'Full')
(async () => {
  try {
    const unsetRes = await Admin.updateMany({ department: { $exists: true } }, { $unset: { department: "" } });
    if (unsetRes && unsetRes.modifiedCount) console.log(`Removed 'department' from ${unsetRes.modifiedCount} admin document(s)`);

    const setRes = await Admin.updateMany({ accessLevel: { $exists: false } }, { $set: { accessLevel: 'Full' } });
    if (setRes && setRes.modifiedCount) console.log(`Set accessLevel='Full' on ${setRes.modifiedCount} admin document(s)`);
  } catch (e) {
    console.warn('Admin cleanup failed:', e && e.message ? e.message : e);
  }
})();

// One-time cleanup: remove any existing `experience` field from TPO documents
(async () => {
  try {
    const res = await Tpo.updateMany({ experience: { $exists: true } }, { $unset: { experience: "" } });
    if (res && res.modifiedCount) {
      console.log(`Removed 'experience' from ${res.modifiedCount} TPO document(s)`);
    }
  } catch (e) {
    // non-fatal - log and continue
    console.warn('TPO experience cleanup failed:', e && e.message ? e.message : e);
  }
})();

// Login activity schema - stores signup/login events
const loginSchema = new mongoose.Schema({
  email: { type: String, index: true },
  role: String,
  activity: String, // 'signup' or 'login'
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Login = mongoose.model('Login', loginSchema);

// Helper to check if an email exists in any user collection
async function emailExists(email) {
  if (!email) return false;
  const collections = [Student, Faculty, Tpo, Admin];
  for (const Model of collections) {
    const found = await Model.findOne({ email }).lean();
    if (found) return true;
  }
  return false;
}

// Helper to create routes for a given model and path
function setupUserRoutes(pathName, Model, singularKey) {
  // Register
  app.post(`/api/${pathName}/register`, async (req, res) => {
    try {
      const data = { ...req.body };
      // Prevent re-use of the same email across any user type
      if (await emailExists(data.email)) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      // enforce role on the saved document so it's always stored in the intended collection
      data.role = singularKey;
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      // create only in the provided Model/collection
      const doc = await Model.create(data);

      // record signup activity
      try {
        await Login.create({ email: data.email, role: singularKey, activity: 'signup' });
      } catch (logErr) {
        console.warn('Failed to record signup activity:', logErr && logErr.message ? logErr.message : logErr);
      }

      const { password: _pw, ...safe } = doc.toObject ? doc.toObject() : doc;
      return res.json({ message: 'Registration successful', [singularKey]: safe });
    } catch (err) {
      res.status(400).json({ message: 'Registration failed', error: err.message });
    }
  });

  // Login
  app.post(`/api/${pathName}/login`, async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Model.findOne({ email }).lean();
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      let passwordMatches = false;
      if (user.password && user.password.startsWith('$2')) {
        passwordMatches = await bcrypt.compare(password, user.password);
      } else {
        // support legacy plaintext passwords during migration
        passwordMatches = user.password === password;
      }

      if (passwordMatches) {
        // remove password before sending
        const { password, ...safe } = user;
        // record login activity for this role-specific login
        try {
          await Login.create({ email: user.email, role: singularKey, activity: 'login' });
        } catch (logErr) {
          console.warn('Failed to record login activity:', logErr && logErr.message ? logErr.message : logErr);
        }
        return res.json({ message: 'Login successful', [singularKey]: safe });
      }

      return res.status(401).json({ message: 'Invalid credentials' });
    } catch (err) {
      return res.status(500).json({ message: 'Login error', error: err.message });
    }
  });

  // Update
  app.post(`/api/${pathName}/update`, async (req, res) => {
    try {
      const { email, ...update } = req.body;
      if (!email) return res.status(400).json({ message: 'Email is required to identify the user' });

      if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
      }

      // protect immutable/read-only fields depending on role
      try {
        // never allow clients to change role
        if (update.role) delete update.role;
        // admin-specific: prevent admin users from modifying their role or accessLevel, but allow employeeId edits
        if (singularKey === 'admin') {
          if (update.accessLevel) delete update.accessLevel;
        }
      } catch (e) {
        // ignore
      }

      const updated = await Model.findOneAndUpdate({ email }, update, { new: true }).lean();
      if (!updated) return res.status(404).json({ message: 'User not found' });

      // record profile update activity in logins collection
      try {
        if (typeof Login !== 'undefined') {
          await Login.create({ email, role: singularKey, activity: 'profile_update' });
        }
      } catch (logErr) {
        console.warn('Failed to record profile update activity:', logErr && logErr.message ? logErr.message : logErr);
      }

      const { password, ...safe } = updated;
      return res.json({ message: 'Changes Saved', [singularKey]: safe });
    } catch (err) {
      return res.status(400).json({ message: 'Update failed', error: err.message });
    }
  });
}

// Setup routes for all user types
setupUserRoutes('students', Student, 'student');
setupUserRoutes('faculty', Faculty, 'faculty');
setupUserRoutes('tpo', Tpo, 'tpo');
setupUserRoutes('admin', Admin, 'admin');

// Role-agnostic login endpoint: searches each user collection for the email
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const collections = [
      { model: Student, role: 'student' },
      { model: Faculty, role: 'faculty' },
      { model: Tpo, role: 'tpo' },
      { model: Admin, role: 'admin' },
    ];

    for (const entry of collections) {
      const user = await entry.model.findOne({ email }).lean();
      if (!user) continue;

      let passwordMatches = false;
      if (user.password && user.password.startsWith('$2')) {
        passwordMatches = await bcrypt.compare(password, user.password);
      } else {
        passwordMatches = user.password === password;
      }

      if (passwordMatches) {
        const { password, ...safe } = user;
        // record login activity
        try {
          await Login.create({ email: user.email, role: entry.role, activity: 'login' });
        } catch (logErr) {
          console.warn('Failed to record login activity:', logErr && logErr.message ? logErr.message : logErr);
        }
        return res.json({ message: 'Login successful', role: entry.role, user: safe });
      }
      // if user found but password mismatch, immediately return invalid
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    return res.status(500).json({ message: 'Login error', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});