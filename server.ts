import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import { UserRole } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Token helper
function generateToken(userId: string): string {
  const payload = { userId, iat: Date.now() };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.userId) {
      return db.findUserById(parsed.userId);
    }
  } catch (err) {
    return null;
  }
  return null;
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = verifyToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ message: 'Authentication required. Please sign in.' });
    return;
  }
  (req as any).user = user;
  next();
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database stats & overview (Proves real-time database updates)
app.get('/api/database/overview', (req, res) => {
  const overview = db.getDatabaseOverview();
  res.json(overview);
});

// Register new user (Dynamically adds to database as per user input)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role, college, company, department, major, phone, location, bio, skills } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Please provide name, email, password, and role.' });
      return;
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ message: 'An account with this email already exists. Please sign in instead.' });
      return;
    }

    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim(),
      passwordHash: password, // In production use bcrypt
      role: role as UserRole,
      college: college?.trim(),
      company: company?.trim(),
      department: department?.trim(),
      major: major?.trim(),
      phone: phone?.trim(),
      location: location?.trim(),
      bio: bio?.trim(),
      skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [])
    });

    const token = generateToken(newUser.id);
    res.status(201).json({
      token,
      user: newUser,
      message: `Account created successfully for ${newUser.name}. Database updated!`
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message || 'Error creating account.' });
  }
});

// Login (Authenticates against database or auto-registers if new custom input)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password, autoCreateIfNotFound, role, name, college, company } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide both email and password.' });
      return;
    }

    let user = db.findUserByEmail(email);

    if (!user) {
      // If user is logging in with brand new input and wants instant provisioning or direct login
      if (autoCreateIfNotFound) {
        const derivedName = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
        const createdUser = db.createUser({
          name: derivedName,
          email: email.trim(),
          passwordHash: password,
          role: (role as UserRole) || 'student',
          college: college || 'National Institute of Technology',
          company: company || 'Partner Enterprise'
        });
        const token = generateToken(createdUser.id);
        res.json({
          token,
          user: createdUser,
          message: `Welcome ${createdUser.name}! Your account has been saved to the database.`
        });
        return;
      }

      res.status(401).json({
        message: 'No account found with this email. Please click "Create Account" below to register in the database.'
      });
      return;
    }

    // Check password
    if (user.passwordHash !== password) {
      res.status(401).json({ message: 'Invalid password. Please check your credentials.' });
      return;
    }

    db.recordLogin(user.id);
    const token = generateToken(user.id);
    const { passwordHash, ...userClean } = user;

    res.json({
      token,
      user: userClean,
      message: `Welcome back, ${user.name}!`
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Login failed.' });
  }
});

// Get current authenticated user
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = (req as any).user;
  const { passwordHash, ...userClean } = user;
  res.json({ user: userClean });
});

// Update user profile (Changes user data in database)
app.put('/api/auth/profile', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { name, college, company, department, major, phone, location, bio, skills, certifications, projects } = req.body;

    const updatedUser = db.updateUserProfile(user.id, {
      name: name !== undefined ? name : user.name,
      college: college !== undefined ? college : user.college,
      company: company !== undefined ? company : user.company,
      department: department !== undefined ? department : user.department,
      major: major !== undefined ? major : user.major,
      phone: phone !== undefined ? phone : user.phone,
      location: location !== undefined ? location : user.location,
      bio: bio !== undefined ? bio : user.bio,
      skills: Array.isArray(skills) ? skills : user.skills,
      certifications: Array.isArray(certifications) ? certifications : user.certifications,
      projects: Array.isArray(projects) ? projects : user.projects
    });

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user: updatedUser, message: 'Profile updated in database successfully.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

// Save Skill Assessment (Recalculates skills and saves into database)
app.post('/api/assessments', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      res.status(400).json({ message: 'Assessment answers required' });
      return;
    }

    const updatedUser = db.updateUserAssessment(user.id, answers);
    res.json({
      user: updatedUser,
      message: 'Assessment completed and synced with database!'
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to save assessment' });
  }
});

// Get Opportunities (Search, Filter, and Skill Compatibility)
app.get('/api/opportunities', (req, res) => {
  const user = verifyToken(req.headers.authorization);
  const q = req.query.q as string | undefined;
  const type = req.query.type as string | undefined;

  const opportunities = db.getOpportunities(q, type, user?.skills);
  res.json({ opportunities });
});

// Get Personalized Recommendations for Student
app.get('/api/recommendations', (req, res) => {
  const user = verifyToken(req.headers.authorization);
  if (!user) {
    // If no user is logged in, return top recommended opportunities rather than a hard 401 error
    const publicRecs = db.getOpportunities(undefined, undefined, ['React', 'TypeScript', 'Python', 'AI / ML']).slice(0, 6);
    res.json({ recommendations: publicRecs });
    return;
  }
  const recommendations = db.getRecommendations(user);
  res.json({ recommendations: recommendations.slice(0, 6) });
});

// Post New Opportunity (Industry / Admin) -> Writes to Database
app.post('/api/opportunities', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { title, company, type, location, mode, stipend, skills, description } = req.body;

    if (!title || !company || !type || !skills) {
      res.status(400).json({ message: 'Title, company, type, and skills are required.' });
      return;
    }

    const skillsArray = Array.isArray(skills) ? skills : String(skills).split(',').map((s: string) => s.trim()).filter(Boolean);

    const opportunity = db.createOpportunity({
      title: title.trim(),
      company: company.trim(),
      type,
      location: location || 'Remote',
      mode: mode || 'Remote',
      stipend: stipend || 'Competitive',
      skills: skillsArray,
      description: description || ''
    }, user.id);

    res.status(201).json({
      opportunity,
      message: 'Opportunity successfully published and saved to database!'
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to publish opportunity.' });
  }
});

// Apply to Opportunity -> Writes Application to Database
app.post('/api/opportunities/:id/apply', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const result = db.applyToOpportunity(id, user);
    res.json({
      application: result.application,
      alreadyApplied: result.alreadyApplied,
      message: result.alreadyApplied
        ? 'You have already applied to this opportunity.'
        : 'Application submitted successfully and recorded in database!'
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message || 'Failed to submit application.' });
  }
});

// Get Applications for Current User (or all applications for industry/admin)
app.get('/api/applications', requireAuth, (req, res) => {
  const user = (req as any).user;

  if (user.role === 'industry' || user.role === 'admin') {
    const allApps = db.getAllApplications();
    res.json({ applications: allApps });
  } else {
    const userApps = db.getApplicationsForUser(user.id);
    res.json({ applications: userApps });
  }
});

// Update Application Status (Industry / Admin)
app.patch('/api/applications/:id/status', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    if (user.role !== 'industry' && user.role !== 'admin') {
      res.status(403).json({ message: 'Unauthorized. Only industry or admin can update status.' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;
    const updated = db.updateApplicationStatus(id, status);

    if (!updated) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json({ application: updated, message: `Application status updated to ${status} in database.` });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update application status.' });
  }
});

// Institution Analytics & Dynamic Skill Demand
app.get('/api/dashboard/institution', (req, res) => {
  const metrics = db.getInstitutionMetrics();
  res.json(metrics);
});

// --- VITE MIDDLEWARE & SERVER STARTUP ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (!process.env.VERCEL) {
  startServer().then((server) => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(
        `SkillBridge Full-Stack Server running at http://0.0.0.0:${PORT}`
      );
    });
  });
}

export default app;

startServer();
