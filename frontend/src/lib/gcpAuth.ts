import { Buffer } from 'node:buffer';
import { GoogleAuth, IdTokenClient } from 'google-auth-library';

let cachedClient: IdTokenClient | null = null;

const getAudience = () => {
  const audience = process.env.BACKEND_IAM_AUDIENCE || process.env.BACKEND_BASE_URL;
  if (!audience) {
    throw new Error('BACKEND_IAM_AUDIENCE or BACKEND_BASE_URL is required');
  }
  return audience.replace(/\/$/, '');
};

const parseCredentials = () => {
  const raw = process.env.GCP_SA_JSON;
  if (!raw) return undefined;

  try {
    return JSON.parse(raw);
  } catch (_) {
    // Vercelなどでbase64エンコードされたまま渡された場合も考慮
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }
};

export async function fetchIdToken(): Promise<string> {
  const audience = getAudience();

  if (!cachedClient) {
    const credentials = parseCredentials();
    const auth = new GoogleAuth({ credentials });
    cachedClient = await auth.getIdTokenClient(audience);
  }

  const headers = await cachedClient.getRequestHeaders(audience);
  const headerRecord = headers as unknown as Record<string, string>;
  const authorization = headerRecord['Authorization'] || headerRecord['authorization'];
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('Failed to obtain ID token for Cloud Run');
  }
  return authorization.replace('Bearer ', '');
}
