import { handleMongoData } from './mongodb-handler';

export default async function handler(request: any, response: any) {
  const url = `http://localhost${request.url || '/api/data'}`;
  const body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body ?? {});
  const webRequest = new Request(url, {
    method: request.method,
    headers: {
      'content-type': 'application/json',
      authorization: request.headers.authorization ?? '',
    },
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : body,
  });
  const result = await handleMongoData(webRequest);
  return response.status(result.status).json(await result.json());
}