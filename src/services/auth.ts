import { apiRequest } from './api';
import type { UserProfile, UserRole, UserType } from '../types';

export interface AuthSession {
  accessToken: string;
  user: UserProfile;
}

function demoSession(data: Partial<UserProfile> & { role?: UserRole; userType?: UserType; email?: string }): AuthSession {
  const role = data.role || 'individual';
  const userType = data.userType || 'donor';
  return {
    accessToken: `demo-session-${Date.now()}`,
    user: {
      id: `demo-user-${Date.now()}`,
      name: data.name || data.organizationName || 'Demo User',
      email: data.email || 'demo@bloodconnect.local',
      phone: data.phone || '',
      role,
      userType,
      bloodGroup: data.bloodGroup || 'O+',
      location: data.location || data.city || 'Mumbai',
      city: data.city || 'Mumbai',
      age: data.age,
      address: data.address,
      idProofName: data.idProofName,
      hlaType: data.hlaType,
      donationCount: data.donationCount || 0,
      lastDonationDate: data.lastDonationDate,
      isAvailableForEmergency: true,
      preferredLanguage: data.preferredLanguage || 'en',
      organizationName: data.organizationName,
      verifiedOrganization: role === 'organization' ? false : undefined,
    },
  };
}

function saveDemoProfile(profile: UserProfile) {
  localStorage.setItem('bloodconnect.demoProfile', JSON.stringify(profile));
}

function readDemoProfile(email?: string) {
  try {
    const profile = JSON.parse(localStorage.getItem('bloodconnect.demoProfile') || 'null') as UserProfile | null;
    return profile && (!email || profile.email.toLowerCase() === email.toLowerCase()) ? profile : null;
  } catch {
    return null;
  }
}

export const AuthService = {
  async login(email: string, password: string): Promise<AuthSession> {
    try {
      return await apiRequest<AuthSession>('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'login', email, password }),
      });
    } catch {
      const savedProfile = readDemoProfile(email);
      return savedProfile ? { accessToken: `demo-session-${Date.now()}`, user: savedProfile } : demoSession({ email });
    }
  },

  async register(data: Partial<UserProfile> & { role: UserRole; userType: UserType }, password: string): Promise<AuthSession> {
    try {
      return await apiRequest<AuthSession>('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'register', profile: data, email: data.email, password }),
      });
    } catch {
      const session = demoSession(data);
      saveDemoProfile(session.user);
      return session;
    }
  },

  async updateConsent(userId: string, consent: Record<string, unknown>) {
    return apiRequest<UserProfile>('/api/data', {
      method: 'PATCH',
      body: JSON.stringify({ type: 'profiles', id: userId, updates: { consent } }),
    });
  }
};
