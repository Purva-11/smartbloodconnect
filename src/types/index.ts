export type UserRole = 'individual' | 'organization';
export type UserType = 'donor' | 'receiver' | 'ngo' | 'blood_bank' | 'hospital' | 'college' | 'corporate';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  userType: UserType;
  bloodGroup: string;
  location: string;
  city: string;
  age?: number;
  address?: string;
  idProofName?: string;
  hlaType?: string;
  donationCount: number;
  lastDonationDate?: string;
  isAvailableForEmergency: boolean;
  preferredLanguage: 'en' | 'hi' | 'mr';
  organizationName?: string;
  verifiedOrganization?: boolean;
  consent?: ConsentSettings;
}

export interface ConsentSettings {
  emergencyAlerts: boolean;
  whatsappNotifications: boolean;
  smsAlerts: boolean;
  futureDriveParticipation: boolean;
  shareContactWithOrganizers: boolean;
  updatedAt: string;
}

export interface Camp {
  id: string;
  name: string;
  organisation: string;
  location: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  target: number;
  registered: number;
  confirmed?: number;
  present?: number;
  bloodGroups: string[];
  distance?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  emergency: boolean;
  description: string;
  contactPhone?: string;
  hlaFilterSupported?: boolean;
}

export interface Registration {
  id: string; // Ticket ID e.g. BC-TKT-89402
  campId: string;
  campName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bloodGroup: string;
  city: string;
  registrationDate: string;
  status: 'Registered' | 'Confirmed' | 'Present' | 'Cancelled';
  preferredTimeSlot: string;
  consentGiven: boolean;
  emergencyAlertOptIn: boolean;
  hlaInfo?: string;
  qrCodeToken: string;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  hospitalName: string;
  hospitalAddress: string;
  bloodGroup: string;
  unitsNeeded: number;
  urgency: 'critical' | 'high' | 'medium';
  contactPerson: string;
  contactPhone: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radiusKm: number;
  reachableDonorsCount: number;
  respondedDonorsCount: number;
  createdAt: string;
  status: 'active' | 'fulfilled' | 'closed';
  description?: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  availableUnits: Record<string, number>;
  coordinates: {
    lat: number;
    lng: number;
  };
  hasEmergencyICU: boolean;
}

export interface BloodBank {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  inventory: Record<string, number>;
  coordinates: {
    lat: number;
    lng: number;
  };
  is24Hours: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  category: 'auth' | 'camp' | 'registration' | 'emergency' | 'consent' | 'organization';
  details: string;
  ipAddress: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'success';
  timestamp: string;
  read: boolean;
  linkSection?: string;
}

export interface TurnoutScenario {
  baseTurnoutPercent: number;
  weatherFactor: number;
  volunteerDensity: number;
  emergencyPriorityMultiplier: number;
  predictedTurnoutCount: number;
  confidenceInterval: [number, number];
}
