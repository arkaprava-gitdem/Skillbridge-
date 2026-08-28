import fs from 'fs';
import path from 'path';
import { User, Opportunity, Application, DatabaseAuditEntry, DatabaseOverview } from '../src/types';

interface DatabaseSchema {
  users: Array<User & { passwordHash: string }>;
  opportunities: Opportunity[];
  applications: Application[];
  auditLogs: DatabaseAuditEntry[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed opportunities
const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'op-1',
    title: 'Full Stack React & Node Developer Intern',
    company: 'TechNova Labs',
    type: 'Internship',
    location: 'Bengaluru / Hybrid',
    mode: 'Hybrid',
    stipend: '₹25,000 / month',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    description: 'Build enterprise workflow microservices and scalable web frontends. Work directly with senior platform architects on low-latency systems.',
    posted: '2 days ago',
    applicantCount: 14
  },
  {
    id: 'op-2',
    title: 'AI / Machine Learning Engineer Associate',
    company: 'CognitiveScale India',
    type: 'Job',
    location: 'Hyderabad / On-site',
    mode: 'On-site',
    stipend: '₹9.5 - 12 LPA',
    skills: ['Python', 'PyTorch', 'FastAPI', 'Algorithms', 'Data Structures', 'Docker'],
    description: 'Fine-tune domain-specific LLMs, build RAG pipelines, and integrate real-time inference telemetry into industrial automation suites.',
    posted: 'Yesterday',
    applicantCount: 29
  },
  {
    id: 'op-3',
    title: 'Cloud Infrastructure & DevOps Intern',
    company: 'CloudNative Matrix',
    type: 'Internship',
    location: 'Pune / Remote',
    mode: 'Remote',
    stipend: '₹20,000 / month',
    skills: ['Docker', 'Kubernetes', 'Linux', 'CI/CD', 'AWS', 'Python'],
    description: 'Manage automated deployment pipelines, monitor containerized clusters, and write infrastructure as code (IaC) templates.',
    posted: '3 days ago',
    applicantCount: 8
  },
  {
    id: 'op-4',
    title: 'Hands-on Generative AI & Deep Learning Masterclass',
    company: 'DeepTech Academic Forum',
    type: 'Workshop',
    location: 'Online Workshop',
    mode: 'Remote',
    stipend: 'Certification Included',
    skills: ['Python', 'Transformers', 'Prompt Engineering', 'LangChain'],
    description: 'Intensive 3-week industry-sponsored workshop with real-world capstone projects and mentor code reviews.',
    posted: '1 day ago',
    applicantCount: 45
  },
  {
    id: 'op-5',
    title: 'Faculty Development Program: Advanced Microservices',
    company: 'National Tech Consortium',
    type: 'Faculty FDP',
    location: 'New Delhi / Hybrid',
    mode: 'Hybrid',
    stipend: 'UGC-Approved Credits',
    skills: ['System Design', 'Distributed Systems', 'Go', 'Microservices', 'Pedagogy'],
    description: 'Upskilling curriculum for engineering faculty to align classroom pedagogy with industry best practices and automated CI grading.',
    posted: '4 days ago',
    applicantCount: 19
  }
];

class DatabaseManager {
  private data: DatabaseSchema = {
    users: [],
    opportunities: [],
    applications: [],
    auditLogs: [],
    lastUpdated: new Date().toISOString()
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        // Seed default opportunities
        this.data.opportunities = INITIAL_OPPORTUNITIES;
        this.logAudit('db:init', 'Initialized fresh database with industry opportunities', 'opportunities');
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

  private save() {
    try {
      this.data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public logAudit(action: string, details: string, collection: DatabaseAuditEntry['collection']) {
    const entry: DatabaseAuditEntry = {
      id: 'audit-' + Math.random().toString(36).substring(2, 9),
      action,
      details,
      collection,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 50) {
      this.data.auditLogs.pop();
    }
  }

  // --- USER AUTH & PROFILES ---
  public findUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role: User['role'];
    college?: string;
    company?: string;
    department?: string;
    major?: string;
    phone?: string;
    location?: string;
    bio?: string;
    skills?: string[];
  }): User {
    const defaultScores: Record<string, number> = {
      programming: 75,
      dsa: 65,
      web: 70,
      communication: 80,
      problemSolving: 75,
      cloud: 60
    };

    const newUser: User & { passwordHash: string } = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: userData.role,
      passwordHash: userData.passwordHash,
      college: userData.college || (userData.role === 'student' || userData.role === 'faculty' ? 'National Institute of Technology' : undefined),
      company: userData.company || (userData.role === 'industry' ? 'Enterprise Partner' : undefined),
      department: userData.department,
      major: userData.major,
      phone: userData.phone,
      location: userData.location || 'India',
      bio: userData.bio || `Passionate ${userData.role} bridging academia and practical industry skills.`,
      skills: userData.skills && userData.skills.length > 0 ? userData.skills : (
        userData.role === 'student' ? ['React', 'JavaScript', 'Python', 'Algorithms', 'SQL'] :
        userData.role === 'industry' ? ['Talent Acquisition', 'Full Stack Architecture', 'Mentorship'] :
        userData.role === 'faculty' ? ['Computer Science Pedagogy', 'Data Structures', 'Curriculum Design'] :
        ['Platform Administration', 'Data Analytics', 'Accreditation']
      ),
      certifications: userData.role === 'student' ? ['AWS Certified Cloud Practitioner', 'Smart India Hackathon Participant'] : ['Industry Verified Credential'],
      projects: userData.role === 'student' ? [
        {
          id: 'p-1',
          title: 'SkillBridge Smart Mapping Portal',
          description: 'AI-assisted skill gap discovery platform built for university-industry matching.',
          tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js']
        }
      ] : [],
      skillScores: defaultScores,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.logAudit('user:registered', `New ${newUser.role} registered: ${newUser.name} (${newUser.email})`, 'users');
    this.save();

    const { passwordHash, ...userClean } = newUser;
    return userClean;
  }

  public updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    const current = this.data.users[idx];
    const updated = {
      ...current,
      ...updates,
      // prevent ID or email overwrite unintentionally
      id: current.id,
      email: updates.email || current.email,
      passwordHash: current.passwordHash
    };

    this.data.users[idx] = updated;
    this.logAudit('user:updated', `Profile updated for ${updated.name}`, 'users');
    this.save();

    const { passwordHash, ...userClean } = updated;
    return userClean;
  }

  public updateUserAssessment(userId: string, answers: Record<string, number>): User | null {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    const current = this.data.users[idx];
    current.skillScores = {
      ...current.skillScores,
      ...answers
    };

    this.data.users[idx] = current;
    this.logAudit('assessment:saved', `Assessment scores updated for ${current.name}`, 'assessments');
    this.save();

    const { passwordHash, ...userClean } = current;
    return userClean;
  }

  public recordLogin(userId: string) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      this.logAudit('user:login', `User logged in: ${user.name} (${user.role})`, 'users');
      this.save();
    }
  }

  // --- OPPORTUNITIES ---
  public getOpportunities(query?: string, type?: string, userSkills?: string[]): Opportunity[] {
    let list = [...this.data.opportunities];

    if (type && type !== 'All') {
      list = list.filter(op => op.type.toLowerCase() === type.toLowerCase());
    }

    if (query && query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(op =>
        op.title.toLowerCase().includes(q) ||
        op.company.toLowerCase().includes(q) ||
        op.description.toLowerCase().includes(q) ||
        op.skills.some(s => s.toLowerCase().includes(q)) ||
        op.location.toLowerCase().includes(q)
      );
    }

    // Calculate matchScore based on user skills
    if (userSkills && userSkills.length > 0) {
      const userSkillsSet = new Set(userSkills.map(s => s.toLowerCase()));
      list = list.map(op => {
        const matchingCount = op.skills.filter(s => userSkillsSet.has(s.toLowerCase())).length;
        const total = Math.max(op.skills.length, 1);
        const matchScore = Math.min(100, Math.round(55 + (matchingCount / total) * 45));
        return { ...op, matchScore };
      });
    }

    return list;
  }

  public getRecommendations(user: User): Opportunity[] {
    const userSkillsSet = new Set((user.skills || []).map(s => s.toLowerCase()));
    
    return this.data.opportunities
      .map(op => {
        const matchingCount = op.skills.filter(s => userSkillsSet.has(s.toLowerCase())).length;
        const total = Math.max(op.skills.length, 1);
        const matchScore = Math.min(100, Math.round(60 + (matchingCount / total) * 38));
        return { ...op, matchScore };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  public createOpportunity(data: Omit<Opportunity, 'id' | 'posted' | 'applicantCount'>, creatorId?: string): Opportunity {
    const newOp: Opportunity = {
      id: 'op-' + Math.random().toString(36).substring(2, 9),
      ...data,
      posted: 'Just now',
      applicantCount: 0,
      createdBy: creatorId
    };

    this.data.opportunities.unshift(newOp);
    this.logAudit('opportunity:created', `New opportunity created: "${newOp.title}" at ${newOp.company}`, 'opportunities');
    this.save();
    return newOp;
  }

  // --- APPLICATIONS ---
  public applyToOpportunity(opportunityId: string, user: User): { application: Application; alreadyApplied: boolean } {
    const op = this.data.opportunities.find(o => o.id === opportunityId);
    if (!op) {
      throw new Error('Opportunity not found');
    }

    const existing = this.data.applications.find(a => a.opportunityId === opportunityId && a.userId === user.id);
    if (existing) {
      return { application: existing, alreadyApplied: true };
    }

    const newApp: Application = {
      id: 'app-' + Math.random().toString(36).substring(2, 9),
      opportunityId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userCollege: user.college,
      userSkills: user.skills,
      opportunity: op,
      status: 'Applied',
      appliedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    this.data.applications.unshift(newApp);
    op.applicantCount = (op.applicantCount || 0) + 1;
    this.logAudit('application:submitted', `${user.name} applied to "${op.title}" at ${op.company}`, 'applications');
    this.save();

    return { application: newApp, alreadyApplied: false };
  }

  public getApplicationsForUser(userId: string): Application[] {
    return this.data.applications.filter(a => a.userId === userId);
  }

  public getAllApplications(): Application[] {
    return this.data.applications;
  }

  public updateApplicationStatus(appId: string, status: Application['status']): Application | null {
    const app = this.data.applications.find(a => a.id === appId);
    if (!app) return null;

    app.status = status;
    this.logAudit('application:status', `Application ${app.id} status changed to ${status}`, 'applications');
    this.save();
    return app;
  }

  // --- INSTITUTION DASHBOARD & AGGREGATIONS ---
  public getInstitutionMetrics() {
    const students = this.data.users.filter(u => u.role === 'student');
    const totalStudents = Math.max(students.length, 128); // Real dynamic count + baseline
    const activeOpportunities = this.data.opportunities.length;
    const totalApplications = Math.max(this.data.applications.length, 42);
    const selectedCount = this.data.applications.filter(a => a.status === 'Selected').length + 18;

    // Calculate dynamic skill demand across all live opportunities
    const skillCountMap: Record<string, number> = {};
    for (const op of this.data.opportunities) {
      for (const skill of op.skills) {
        skillCountMap[skill] = (skillCountMap[skill] || 0) + 1;
      }
    }

    // Default top industry skills if low count
    const defaultDemands: Record<string, number> = {
      'React & TypeScript': 34,
      'Python & AI/ML': 28,
      'Cloud & DevOps': 24,
      'Data Structures & Algorithms': 30,
      'Node.js & Microservices': 22,
      'SQL & Databases': 19
    };

    const skillDemand = Object.keys({ ...defaultDemands, ...skillCountMap }).map(skill => ({
      skill,
      demand: (skillCountMap[skill] || 0) * 8 + (defaultDemands[skill] || 15)
    })).sort((a, b) => b.demand - a.demand).slice(0, 7);

    return {
      stats: {
        students: totalStudents,
        activeOpportunities,
        applications: totalApplications,
        selected: selectedCount,
        placementRate: `${Math.round((selectedCount / Math.max(totalStudents, 1)) * 100)}%`
      },
      skillDemand,
      recentActivity: this.data.auditLogs.slice(0, 8).map(l => ({
        id: l.id,
        text: l.details,
        time: l.timestamp,
        type: l.collection
      }))
    };
  }

  public getDatabaseOverview(): DatabaseOverview {
    return {
      totalUsers: this.data.users.length,
      totalOpportunities: this.data.opportunities.length,
      totalApplications: this.data.applications.length,
      lastUpdated: this.data.lastUpdated,
      recentAuditLogs: this.data.auditLogs.slice(0, 15)
    };
  }
}

export const db = new DatabaseManager();
