import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserProfile, ConsentSettings, Registration } from '../types';
import { defaultIndividualUser, defaultOrganizationUser } from '../data/mockData';
import { AuthSession, AuthService } from '../services/auth';
import { RegistrationService } from '../services/registrations';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  consentSettings: ConsentSettings;
  myRegistrations: Registration[];
  login: (session: AuthSession) => void;
  logout: () => void;
  switchRole: (role: 'individual' | 'organization') => void;
  updateConsent: (updates: Partial<ConsentSettings>) => void;
  addRegistration: (reg: Registration) => void;
  updateRegistrationStatus: (ticketId: string, status: Registration['status']) => void;
}

const defaultConsent: ConsentSettings = {
  emergencyAlerts: true,
  whatsappNotifications: true,
  smsAlerts: false,
  futureDriveParticipation: true,
  shareContactWithOrganizers: true,
  updatedAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('bloodconnect.user') || 'null') as UserProfile | null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(sessionStorage.getItem('bloodconnect.accessToken')));
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>(() => {
    try {
      const savedUser = JSON.parse(sessionStorage.getItem('bloodconnect.user') || 'null') as UserProfile | null;
      return savedUser?.consent ?? defaultConsent;
    } catch {
      return defaultConsent;
    }
  });
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);

  const login = useCallback((session: AuthSession) => {
    const baseProfile = session.user.role === 'individual' ? defaultIndividualUser : defaultOrganizationUser;
    const profile = { ...baseProfile, ...session.user };
    sessionStorage.setItem('bloodconnect.accessToken', session.accessToken);
    sessionStorage.setItem('bloodconnect.user', JSON.stringify(profile));
    setUser(profile);
    setConsentSettings(profile.consent ?? defaultConsent);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('bloodconnect.accessToken');
    sessionStorage.removeItem('bloodconnect.user');
    setUser(null);
    setIsAuthenticated(false);
    setMyRegistrations([]);
  }, []);

  const switchRole = useCallback((role: 'individual' | 'organization') => {
    setUser(role === 'individual' ? defaultIndividualUser : defaultOrganizationUser);
  }, []);

  const updateConsent = useCallback((updates: Partial<ConsentSettings>) => {
    const next = { ...consentSettings, ...updates, updatedAt: new Date().toISOString() };
    setConsentSettings(next);
    if (user) {
      const updatedUser = { ...user, consent: next };
      sessionStorage.setItem('bloodconnect.user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      void AuthService.updateConsent(user.id, next).catch(error => console.error('Could not save consent settings:', error));
    }
  }, [consentSettings, user]);

  const addRegistration = useCallback((reg: Registration) => {
    setMyRegistrations(prev => [reg, ...prev]);
  }, []);

  const updateRegistrationStatus = useCallback((ticketId: string, status: Registration['status']) => {
    setMyRegistrations(prev =>
      prev.map(r => r.id === ticketId ? { ...r, status } : r)
    );
  }, []);

  useEffect(() => {
    if (!user) return;
    void RegistrationService.getMyRegistrations()
      .then(setMyRegistrations)
      .catch(error => console.error('Could not load registrations:', error));
  }, [user?.id]);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, consentSettings, myRegistrations,
      login, logout, switchRole, updateConsent, addRegistration, updateRegistrationStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
