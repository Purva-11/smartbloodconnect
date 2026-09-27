import { generateQRToken } from './qr';
import { apiRequest } from './api';
import type { Registration } from '../types';

interface SavedRegistration extends Registration {
  token: string;
}

export const RegistrationService = {
  async registerForCamp(userId: string, campId: string, participantData: Record<string, unknown>) {
    const id = 'BC-TKT-' + Math.floor(10000 + Math.random() * 90000);
    const token = generateQRToken(userId, campId, id);
    const registration: Record<string, unknown> = {
      ...participantData,
      id,
      campId,
      userId,
      token,
      qrCodeToken: token,
      status: 'Registered',
      registrationDate: new Date().toISOString(),
      userName: String(participantData.name || ''),
      userEmail: String(participantData.email || ''),
      userPhone: String(participantData.phone || ''),
      bloodGroup: String(participantData.blood || ''),
      city: String(participantData.city || ''),
    };
    const saved = await apiRequest<SavedRegistration>('/api/data', {
      method: 'POST',
      body: JSON.stringify({ type: 'registrations', record: registration }),
    });
    return { id: saved.id, campId: saved.campId, userId: saved.userId, token: saved.token, status: saved.status, registrationDate: saved.registrationDate };
  },

  async getMyRegistrations() {
    return apiRequest<Registration[]>('/api/data?type=registrations');
  },

  async findRegistrationByCode(code: string) {
    const value = code.trim();
    const query = new URLSearchParams({ type: 'registrations', code: value });
    return apiRequest<SavedRegistration | null>(`/api/data?${query}`);
  },

  async updateAttendance(ticketId: string, status: 'Registered' | 'Confirmed' | 'Present' | 'Cancelled') {
    try {
      await apiRequest<SavedRegistration>('/api/data', {
        method: 'PATCH',
        body: JSON.stringify({ type: 'registrations', id: ticketId, updates: { status } }),
      });
      return true;
    } catch {
      return false;
    }
  }
};
