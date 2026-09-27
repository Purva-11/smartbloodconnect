import 'dotenv/config';
import express, { type Request as ExpressRequest, type Response as ExpressResponse } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleMongoAuth, handleMongoData } from './api/mongodb-handler';
import { handleEmergencyAlert } from './api/emergency-alert-handler';

const app = express();
const port = Number(process.env.PORT || 3000);
const root = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: '1mb' }));

async function runHandler(
  request: ExpressRequest,
  response: ExpressResponse,
  handler: (request: globalThis.Request) => Promise<globalThis.Response>,
) {
  try {
    const headers = new Headers();
    Object.entries(request.headers).forEach(([key, value]) => {
      if (typeof value === 'string') headers.set(key, value);
      else if (Array.isArray(value)) headers.set(key, value.join(', '));
    });
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
    const webRequest = new globalThis.Request(`http://${request.headers.host || 'localhost'}${request.originalUrl}`, {
      method: request.method,
      headers,
      body: hasBody ? JSON.stringify(request.body ?? {}) : undefined,
    });
    const result = await handler(webRequest);
    response.status(result.status);
    result.headers.forEach((value, key) => response.setHeader(key, value));
    response.send(await result.text());
  } catch (error) {
    console.error('API request failed:', error);
    response.status(500).json({ error: 'Server request failed.' });
  }
}

app.all('/api/auth', (request, response) => void runHandler(request, response, handleMongoAuth));
app.all('/api/data', (request, response) => void runHandler(request, response, handleMongoData));
app.all('/api/emergency-alert', (request, response) => void runHandler(request, response, handleEmergencyAlert));

app.use(express.static(path.join(root, 'dist')));
app.use((request, response, next) => {
  if (request.method === 'GET' && !request.path.startsWith('/api/')) {
    response.sendFile(path.join(root, 'dist', 'index.html'));
    return;
  }
  next();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`BloodConnect server listening on port ${port}`);
});