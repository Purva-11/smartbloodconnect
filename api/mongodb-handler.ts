import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { MongoClient, type Db, type Document } from 'mongodb';

const scrypt = promisify(scryptCallback);
const DATA_COLLECTIONS = new Set([
  'profiles', 'camps', 'emergencies', 'registrations', 'auditLogs', 'notifications', 'hospitals', 'bloodBanks',
]);
const PROFILE_FIELDS = [
  'name', 'email', 'phone', 'role', 'userType', 'bloodGroup', 'location', 'city', 'age',
  'address', 'idProofName', 'hlaType', 'organizationName', 'consent',
];

interface Session {
  userId: string;
  role: 'individual' | 'organization';
  userType: string;
  expiresAt: number;
}

interface MongoRequestBody {
  action?: string;
  email?: string;
  password?: string;
  profile?: Record<string, unknown>;
  type?: string;
  record?: Record<string, unknown>;
  id?: string;
  updates?: Record<string, unknown>;
}

let clientPromise: Promise<MongoClient> | undefined;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function getDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MongoDB is not configured. Set MONGODB_URI on the server.');
  const connectionUri = new URL(uri);
  if (!connectionUri.pathname || connectionUri.pathname === '/') connectionUri.pathname = '/bloodconnect';
  if (!connectionUri.searchParams.has('authSource')) connectionUri.searchParams.set('authSource', 'admin');
  if (!connectionUri.searchParams.has('retryWrites')) connectionUri.searchParams.set('retryWrites', 'true');
  if (!connectionUri.searchParams.has('w')) connectionUri.searchParams.set('w', 'majority');
  clientPromise ??= new MongoClient(connectionUri.toString()).connect();
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'bloodconnect');
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters.');
  return secret;
}

function signSession(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifySession(token: string): Session | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = createHmac('sha256', getSessionSecret()).update(payload).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function getRequestSession(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return token ? verifySession(token) : null;
}

async function readBody(request: Request): Promise<MongoRequestBody | null> {
  try {
    return await request.json() as MongoRequestBody;
  } catch {
    return null;
  }
}

function publicDocument<T extends Document>(document: T) {
  const { _id: _ignored, passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...safe } = document;
  return safe;
}

function safeRecord(record: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(record).filter(([key]) =>
    key !== '_id' && key !== 'createdBy' && key !== 'userId' && key !== 'createdAt' && !key.startsWith('$') && !key.includes('.')));
}

async function passwordDigest(password: string, salt: string) {
  return Buffer.from(await scrypt(password, salt, 64)).toString('hex');
}

export async function handleMongoAuth(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  const body = await readBody(request);
  if (!body || !body.email || !body.password) return json({ error: 'Email and password are required.' }, 400);
  const email = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.password.length < 8) {
    return json({ error: 'Enter a valid email and a password of at least 8 characters.' }, 400);
  }

  try {
    getSessionSecret();
    const users = (await getDatabase()).collection('users');
    await users.createIndex({ email: 1 }, { unique: true });
    let profile: Document | null;

    if (body.action === 'register') {
      const submittedProfile = body.profile ?? {};
      if (submittedProfile.role !== 'individual' && submittedProfile.role !== 'organization') {
        return json({ error: 'Select an account type.' }, 400);
      }
      if (typeof submittedProfile.name !== 'string' || !submittedProfile.name.trim()) {
        return json({ error: 'Name is required.' }, 400);
      }
      const profileFields = Object.fromEntries(PROFILE_FIELDS
        .filter(field => field !== 'email')
        .filter(field => submittedProfile[field] !== undefined)
        .map(field => [field, submittedProfile[field]]));
      const salt = randomBytes(16).toString('hex');
      const passwordHash = await passwordDigest(body.password, salt);
      profile = {
        ...profileFields,
        email,
        id: randomBytes(16).toString('hex'),
        passwordSalt: salt,
        passwordHash,
        isAvailableForEmergency: true,
        consent: {
          emergencyAlerts: true,
          whatsappNotifications: true,
          smsAlerts: false,
          futureDriveParticipation: true,
          shareContactWithOrganizers: true,
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };
      try {
        await users.insertOne(profile);
      } catch (error) {
        if ((error as { code?: number }).code === 11000) return json({ error: 'An account with this email already exists.' }, 409);
        throw error;
      }
    } else if (body.action === 'login') {
      profile = await users.findOne({ email });
      if (!profile || typeof profile.passwordSalt !== 'string' || typeof profile.passwordHash !== 'string') {
        return json({ error: 'Invalid email or password.' }, 401);
      }
      const submittedHash = Buffer.from(await passwordDigest(body.password, profile.passwordSalt), 'hex');
      const storedHash = Buffer.from(profile.passwordHash, 'hex');
      if (submittedHash.length !== storedHash.length || !timingSafeEqual(submittedHash, storedHash)) {
        return json({ error: 'Invalid email or password.' }, 401);
      }
    } else {
      return json({ error: 'Unknown authentication action.' }, 400);
    }

    const session: Session = {
      userId: String(profile.id),
      role: profile.role as Session['role'],
      userType: String(profile.userType ?? 'donor'),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    return json({ accessToken: signSession(session), user: publicDocument(profile) });
  } catch (error) {
    console.error('MongoDB authentication request failed:', error);
    if (error instanceof Error && (
      error.message.startsWith('SESSION_SECRET') ||
      error.message.startsWith('MongoDB is not configured')
    )) {
      return json({ error: error.message }, 503);
    }
    if ((error as { code?: number }).code === 8000 || (error instanceof Error && error.message.includes('bad auth'))) {
      return json({ error: 'MongoDB rejected the database credentials. Verify the Atlas database username and password; URL-encode special characters in the password.' }, 503);
    }
    return json({ error: 'Authentication service is unavailable. Check server configuration.' }, 503);
  }
}

function canCreate(type: string, session: Session) {
  if (type === 'registrations') return true;
  if (type === 'camps') return session.role === 'organization';
  if (type === 'emergencies') return session.role === 'organization' || session.userType === 'receiver';
  return false;
}

export async function handleMongoData(request: Request): Promise<Response> {
  let session: Session | null;
  try {
    session = getRequestSession(request);
  } catch {
    return json({ error: 'Session service is not configured correctly.' }, 503);
  }
  if (!session) return json({ error: 'Sign in to access saved data.' }, 401);

  const url = new URL(request.url);
  const body = request.method === 'GET' ? null : await readBody(request);
  const type = (body?.type ?? url.searchParams.get('type')) || '';
  if (!DATA_COLLECTIONS.has(type)) return json({ error: 'Unknown data type.' }, 400);
  if (!['GET', 'POST', 'PATCH'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);

  try {
    const collection = (await getDatabase()).collection(type === 'profiles' ? 'users' : type);
    if (request.method === 'GET') {
      const filter: Document = {};
      if (type === 'profiles') filter.id = session.userId;
      if (type === 'registrations' && session.role !== 'organization') filter.userId = session.userId;
      if (type === 'auditLogs' && session.role !== 'organization') return json({ error: 'Not authorized.' }, 403);
      if (type === 'registrations' && url.searchParams.has('code')) {
        const code = url.searchParams.get('code');
        filter.$or = [{ id: code }, { token: code }];
        const registration = await collection.findOne(filter);
        return json(registration ? publicDocument(registration) : null);
      }
      const records = await collection.find(filter).sort({ createdAt: -1 }).limit(1000).toArray();
      return json(records.map(publicDocument));
    }

    if (!body || typeof body !== 'object') return json({ error: 'Invalid request body.' }, 400);
    if (request.method === 'POST') {
      if (!body.record || !canCreate(type, session)) return json({ error: 'Not authorized to create this record.' }, 403);
      const record = safeRecord(body.record);
      if (typeof record.id !== 'string' || !record.id) record.id = randomBytes(12).toString('hex');
      record.createdBy = session.userId;
      if (type === 'registrations') record.userId = session.userId;
      record.createdAt ??= new Date().toISOString();
      await collection.insertOne(record);
      return json(publicDocument(record), 201);
    }

    if (!body.id || !body.updates) return json({ error: 'Record id and updates are required.' }, 400);
    const updates = safeRecord(body.updates);
    delete updates.id;
    delete updates.createdAt;
    const filter: Document = { id: body.id };
    if (type === 'profiles') {
      filter.id = session.userId;
    } else if (type === 'registrations') {
      if (session.role !== 'organization') return json({ error: 'Not authorized.' }, 403);
    } else if (type === 'camps' || type === 'emergencies') {
      filter.createdBy = session.userId;
    } else {
      return json({ error: 'This data type cannot be updated.' }, 403);
    }
    const result = await collection.findOneAndUpdate(filter, { $set: updates }, { returnDocument: 'after' });
    if (!result) return json({ error: 'Record not found or not authorized.' }, 404);
    return json(publicDocument(result));
  } catch (error) {
    console.error('MongoDB data request failed:', error);
    return json({ error: 'Database request failed. Check server configuration.' }, 503);
  }
}