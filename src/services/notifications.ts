export interface EmergencyEmailRequest {
  bloodGroup: string;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  unitsNeeded: number;
  urgency: string;
  contactPhone: string;
  radiusKm: number;
  coordinates: { lat: number; lng: number };
}

interface EmergencyEmailResponse {
  sent: number;
  failed?: number;
  message: string;
}

export async function sendEmergencyDonorEmails(request: EmergencyEmailRequest): Promise<EmergencyEmailResponse> {
  const accessToken = sessionStorage.getItem('bloodconnect.accessToken');
  if (!accessToken) throw new Error('Email alerts need a connected Supabase sign-in session.');

  const response = await fetch('/api/emergency-alert', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });
  const result = await response.json() as EmergencyEmailResponse & { error?: string };
  if (!response.ok) throw new Error(result.error || 'The donor email alert could not be sent.');
  return result;
}