import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { handleEmergencyAlert } from './api/emergency-alert-handler';
import { handleMongoAuth, handleMongoData } from './api/mongodb-handler';

function mongoDevRoute(route: string, handler: (request: Request) => Promise<Response>): Plugin {
  return {
    name: `mongo-dev-${route.replaceAll('/', '-')}`,
    configureServer(server) {
      server.middlewares.use(route, (request, response, next) => {
        if (!['GET', 'POST', 'PATCH'].includes(request.method ?? 'GET')) {
          next();
          return;
        }
        const chunks: Buffer[] = [];
        request.on('data', chunk => chunks.push(Buffer.from(chunk)));
        request.on('end', async () => {
          try {
            const method = request.method ?? 'GET';
            const webRequest = new Request(`http://localhost${route}${request.url ?? ''}`, {
              method,
              headers: {
                'content-type': String(request.headers['content-type'] || 'application/json'),
                authorization: String(request.headers.authorization || ''),
              },
              body: method === 'GET' ? undefined : Buffer.concat(chunks),
            });
            const result = await handler(webRequest);
            response.statusCode = result.status;
            result.headers.forEach((value, key) => response.setHeader(key, value));
            response.end(await result.text());
          } catch {
            response.statusCode = 500;
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify({ error: 'Database service failed.' }));
          }
        });
      });
    },
  };
}

const emergencyAlertDevApi: Plugin = {
  name: 'emergency-alert-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/emergency-alert', (request, response, next) => {
      if (request.method !== 'POST') {
        next();
        return;
      }
      const chunks: Buffer[] = [];
      request.on('data', chunk => chunks.push(Buffer.from(chunk)));
      request.on('end', async () => {
        try {
          const webRequest = new Request('http://localhost/api/emergency-alert', {
            method: 'POST',
            headers: {
              'content-type': String(request.headers['content-type'] || 'application/json'),
              authorization: String(request.headers.authorization || ''),
            },
            body: Buffer.concat(chunks),
          });
          const result = await handleEmergencyAlert(webRequest);
          response.statusCode = result.status;
          response.setHeader('content-type', 'application/json');
          response.end(await result.text());
        } catch {
          response.statusCode = 500;
          response.setHeader('content-type', 'application/json');
          response.end(JSON.stringify({ error: 'Email alert service failed.' }));
        }
      });
    });
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['MONGODB_URI', 'MONGODB_DB', 'SESSION_SECRET'] as const) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [react(), emergencyAlertDevApi, mongoDevRoute('/api/auth', handleMongoAuth), mongoDevRoute('/api/data', handleMongoData)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});
