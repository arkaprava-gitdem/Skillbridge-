import { User, Opportunity, Application, InstitutionStats, SkillDemandItem, DatabaseOverview } from '../types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('token') || localStorage.getItem('skillbridge_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('skillbridge_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('skillbridge_token');
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth & Database User operations
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    college?: string;
    company?: string;
    department?: string;
    major?: string;
    phone?: string;
    location?: string;
    bio?: string;
    skills?: string[];
  }): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Registration failed');
    if (json.token) {
      setAuthToken(json.token);
    }
    return json;
  },

  async login(data: {
    email: string;
    password: string;
    autoCreateIfNotFound?: boolean;
    role?: string;
    name?: string;
    college?: string;
    company?: string;
  }): Promise<{ token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login failed');
    if (json.token) {
      setAuthToken(json.token);
    }
    return json;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Session expired');
    return json;
  },

  async getMe(): Promise<{ user: User }> {
    return this.getCurrentUser();
  },

  logout() {
    clearAuthToken();
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update profile');
    return json;
  },

  async submitAssessment(answers: Record<string, number>): Promise<{ user: User; message: string }> {
    const res = await fetch(`${API_BASE}/assessments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to submit assessment');
    return json;
  },

  // Opportunities
  async getOpportunities(query?: string, type?: string): Promise<{ opportunities: Opportunity[] }> {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type && type !== 'All') params.set('type', type);

    const res = await fetch(`${API_BASE}/opportunities?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load opportunities');
    return json;
  },

  async getRecommendations(): Promise<{ recommendations: Opportunity[] }> {
    const res = await fetch(`${API_BASE}/recommendations`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load recommendations');
    return json;
  },

  async createOpportunity(data: {
    title: string;
    company: string;
    type: string;
    location: string;
    mode: string;
    stipend: string;
    skills: string[];
    description: string;
  }): Promise<{ opportunity: Opportunity; message: string }> {
    const res = await fetch(`${API_BASE}/opportunities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to publish opportunity');
    return json;
  },

  async applyOpportunity(opportunityId: string): Promise<{ application: Application; alreadyApplied: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/opportunities/${opportunityId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to apply');
    return json;
  },

  // Applications
  async getApplications(): Promise<{ applications: Application[] }> {
    const res = await fetch(`${API_BASE}/applications`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load applications');
    return json;
  },

  async updateApplicationStatus(appId: string, status: string): Promise<{ application: Application; message: string }> {
    const res = await fetch(`${API_BASE}/applications/${appId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update status');
    return json;
  },

  // Institution analytics
  async getInstitutionAnalytics(): Promise<{
    stats: InstitutionStats;
    skillDemand: SkillDemandItem[];
    recentActivity: Array<{ id: string; text: string; time: string; type: string }>;
  }> {
    const res = await fetch(`${API_BASE}/dashboard/institution`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load analytics');
    return json;
  },

  // Database Live Stats & Audit Trail
  async getDatabaseOverview(): Promise<DatabaseOverview> {
    const res = await fetch(`${API_BASE}/database/overview`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch database overview');
    return json;
  }
};
