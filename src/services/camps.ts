import { apiRequest } from './api';
import type { Camp } from '../types';

export const CampService = {
  async getAllCamps(): Promise<Camp[]> {
    return apiRequest<Camp[]>('/api/data?type=camps');
  },
  
  async getCampById(id: string): Promise<Camp | undefined> {
    const camps = await this.getAllCamps();
    return camps.find(camp => camp.id === id);
  },
  
  async createCamp(data: Omit<Camp, 'id'> & { id?: string }): Promise<Camp> {
    return apiRequest<Camp>('/api/data', {
      method: 'POST',
      body: JSON.stringify({ type: 'camps', record: { ...data, id: data.id || `c${Date.now()}` } }),
    });
  }
};
