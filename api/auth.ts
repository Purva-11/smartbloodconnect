import { handleMongoAuth } from './mongodb-handler';

export default async function handler(request: any, response: any) {
  const body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body ?? {});
  const webRequest = new Request('http://localhost/api/auth', {
    method: request.method,
    headers: { 'content-type': 'application/json' },
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : body,
  });
  const result = await handleMongoAuth(webRequest);
  return response.status(result.status).json(await result.json());
}