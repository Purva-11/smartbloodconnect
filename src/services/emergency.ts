import { apiRequest } from './api';
import type { EmergencyRequest } from '../types';

export const EmergencyService = {
  async getAllRequests(): Promise<EmergencyRequest[]> {
    return apiRequest<EmergencyRequest[]>('/api/data?type=emergencies');
  },

  async broadcastSOS(data: EmergencyRequest): Promise<EmergencyRequest> {
    return apiRequest<EmergencyRequest>('/api/data', {
      method: 'POST',
      body: JSON.stringify({ type: 'emergencies', record: data }),
    });
  },

  async updateRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    return apiRequest<EmergencyRequest>('/api/data', {
      method: 'PATCH',
      body: JSON.stringify({ type: 'emergencies', id, updates }),
    });
  },

  async fetchNearbyResources(lat: number, lng: number, radius: number) {
    return [
      { id: 'h1', name: 'City Hospital', lat: lat + 0.01, lng: lng + 0.01, type: 'hospital' },
      { id: 'bb1', name: 'Central Blood Bank', lat: lat - 0.02, lng: lng + 0.015, type: 'blood_bank' },
    ];
  }
};
