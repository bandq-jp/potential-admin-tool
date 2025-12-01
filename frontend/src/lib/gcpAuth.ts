import { Buffer } from 'node:buffer';
import { GoogleAuth, IdTokenClient } from 'google-auth-library';

let cachedToken: { value: string; exp: number } | null = null;
let cachedClient: IdTokenClient | null = null;

const getAudience = () => {
  const aud = process.env.BACKEND_IAM_AUDIENCE || process.env.BACKEND_BASE_URL;
  if (!aud) throw new Error('BACKEND_IAM_AUDIENCE or BACKEND_BASE_URL is required');
  // Cloud Run expects origin (パスなし)
  return aud.replace(/\/$/, '').replace(/\/api\/v1$/, '');
};

const parseCredentials = () => {
  const raw = process.env.GCP_SA_JSON;
  if (!raw) throw new Error('GCP_SA_JSON is not set');

  try {
    return JSON.parse(raw);
  } catch (_) {
    // base64 で渡されたケースに対応
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }
};

export async function fetchIdToken(): Promise<string> {
  const aud = getAudience();

  // 5分キャッシュ（デフォルトの有効期限1hより短めに）
  const now = Date.now();
  if (cachedToken && cachedToken.exp > now + 60_000) {
    return cachedToken.value;
  }

  if (!cachedClient) {
    const credentials = parseCredentials();
    const auth = new GoogleAuth({ credentials });
    cachedClient = await auth.getIdTokenClient(aud);
  }

  const headers = (await cachedClient.getRequestHeaders(aud)) as unknown as Record<string, string>;
  const tokenHeader = headers['Authorization'] || headers['authorization'];
  if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
    throw new Error('Failed to obtain ID token for Cloud Run');
  }

  const token = tokenHeader.replace(/^Bearer\s+/i, '');
  cachedToken = { value: token, exp: now + 5 * 60_000 };
  return token;
}
