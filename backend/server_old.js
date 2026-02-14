const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const busboy = require('busboy');
app.use(express.raw({ limit: '50mb' }));
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
  password: { type: String, required: true, select: false },
  phone: String,
  studentId: String,
  resumeFileName: String,
  resumeData: String, // Base64 encoded file
  year: String,
  course: String,
  cgpa: String,
  skills: String,
  role: String,
  // password reset fields
  resetPasswordToken: String,
  resetPasswordExpire: Date,
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

// expose models collection list for controllers needing cross-collection checks
app.set('collections', [Student, Faculty, Tpo, Admin]);

// attach auth helpers to schemas
try {
  const { applyAuthMethods } = require('./models/userHelpers');
  applyAuthMethods(studentSchema);
  applyAuthMethods(facultySchema);
  applyAuthMethods(tpoSchema);
  applyAuthMethods(adminSchema);
} catch (e) {
  console.warn('Auth helpers not attached:', e && e.message ? e.message : e);
}

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
  // Use controller-based handlers for register/login
  const { makeAuthController } = require('./controllers/auth');
  const controller = makeAuthController(Model, singularKey, Login);

  // registration with uniqueness check
  app.post(`/api/${pathName}/register`, async (req, res) => {
    try {
      const data = { ...req.body };
      if (await emailExists(data.email)) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      return controller.register(req, res);
    } catch (err) {
      return res.status(500).json({ message: 'Registration error', error: err.message });
    }
  });

  app.post(`/api/${pathName}/login`, controller.login);
  app.post(`/api/${pathName}/forgot`, controller.forgotPassword);
  app.post(`/api/${pathName}/reset/:token`, controller.resetPassword);

  // Update
  app.post(`/api/${pathName}/update`, async (req, res) => {
    try {
      const { email, ...update } = req.body;
      if (!email) return res.status(400).json({ message: 'Email is required to identify the user' });

      if (update.password) {
        // If a password update is requested, use findOne then set and save so the schema
        // pre('save') hook will hash the password exactly once.
        const existing = await Model.findOne({ email });
        if (!existing) return res.status(404).json({ message: 'User not found' });
        // copy non-password updates to the existing doc
        Object.keys(update).forEach(k => {
          if (k === 'password') return;
          existing[k] = update[k];
        });
        existing.password = update.password; // raw - pre('save') will hash
        const saved = await existing.save();
        const { password, ...safeSaved } = saved.toObject ? saved.toObject() : saved;

        // record profile update activity
        try {
          if (typeof Login !== 'undefined') await Login.create({ email, role: singularKey, activity: 'profile_update' });
        } catch (logErr) {
          console.warn('Failed to record profile update activity:', logErr && logErr.message ? logErr.message : logErr);
        }

        return res.json({ message: 'Changes Saved', [singularKey]: safeSaved });
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
      // select password explicitly
      const user = await entry.model.findOne({ email }).select('+password');
      if (!user) continue;

      let passwordMatches = false;
      if (user.password && user.password.startsWith('$2')) {
        passwordMatches = await bcrypt.compare(password, user.password);
      } else {
        passwordMatches = user.password === password;
      }

      if (passwordMatches) {
        const safe = user.toObject ? user.toObject() : user;
        delete safe.password;
        try {
          await Login.create({ email: user.email, role: entry.role, activity: 'login' });
        } catch (logErr) {
          console.warn('Failed to record login activity:', logErr && logErr.message ? logErr.message : logErr);
        }
        return res.json({ message: 'Login successful', role: entry.role, user: safe });
      }

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    return res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Resume upload endpoint for students
app.post('/api/students/upload-resume', async (req, res) => {
  try {
    const email = req.headers['x-student-email'];
    if (!email) return res.status(400).json({ message: 'Email header is required' });

    // Handle multipart file upload
    const busboy = require('busboy')({ headers: req.headers });
    let fileBuffer = null;
    let fileName = '';

    busboy.on('file', (fieldname, file, info) => {
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
        fileName = info.filename;
      });
    });

    busboy.on('close', async () => {
      if (!fileBuffer || !fileName) {
        return res.status(400).json({ message: 'No file provided' });
      }

      // Validate file type
      const validTypes = ['.pdf', '.docx'];
      const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
      if (!validTypes.includes(ext)) {
        return res.status(400).json({ message: 'Only PDF and DOCX files are allowed' });
      }

      // Convert to base64 for storage
      const fileData = fileBuffer.toString('base64');

      const updated = await Student.findOneAndUpdate(
        { email },
        {
          resumeFileName: fileName,
          resumeData: fileData,
        },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const { password, resumeData, ...safe } = updated;
      return res.json({ message: 'Resume uploaded successfully', student: safe });
    });

    busboy.on('error', (err) => {
      return res.status(500).json({ message: 'File upload error', error: err.message });
    });

    req.pipe(busboy);
  } catch (err) {
    return res.status(500).json({ message: 'Upload error', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});