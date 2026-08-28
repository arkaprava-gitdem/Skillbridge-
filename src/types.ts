export type UserRole = 'student' | 'industry' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college?: string;
  company?: string;
  department?: string;
  major?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills: string[];
  certifications: string[];
  projects: Array<{
    id: string;
    title: string;
    description: string;
    tech: string[];
    link?: string;
  }>;
  skillScores: Record<string, number>;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'Internship' | 'Job' | 'Workshop' | 'Faculty FDP';
  location: string;
  mode: 'Remote' | 'Hybrid' | 'On-site';
  stipend: string;
  skills: string[];
  description: string;
  posted: string;
  applicantCount: number;
  createdBy?: string;
  matchScore?: number;
}

export interface Application {
  id: string;
  opportunityId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userCollege?: string;
  userSkills?: string[];
  opportunity: Opportunity;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected';
  appliedOn: string;
  notes?: string;
}

export interface InstitutionStats {
  students: number;
  activeOpportunities: number;
  applications: number;
  selected: number;
  placementRate: string;
}

export interface SkillDemandItem {
  skill: string;
  demand: number;
}

export interface DatabaseAuditEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  collection: 'users' | 'opportunities' | 'applications' | 'assessments';
}

export interface DatabaseOverview {
  totalUsers: number;
  totalOpportunities: number;
  totalApplications: number;
  lastUpdated: string;
  recentAuditLogs: DatabaseAuditEntry[];
}
