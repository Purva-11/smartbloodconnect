import { handleEmergencyAlert } from './emergency-alert-handler';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
  const body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body ?? {});
  const webRequest = new Request('http://localhost/api/emergency-alert', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: request.headers.authorization ?? '',
    },
    body,
  });
  const result = await handleEmergencyAlert(webRequest);
  return response.status(result.status).json(await result.json());
}