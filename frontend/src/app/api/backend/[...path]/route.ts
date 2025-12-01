import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const LOCAL_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || LOCAL_API_BASE_URL;

const GCP_SA_JSON = process.env.GCP_SA_JSON;
const USE_LOCAL_BACKEND = process.env.USE_LOCAL_BACKEND === 'true';

// Cloud Run の audience はパスを含まない origin が必要
const extractAudience = (urlStr: string) => {
  try {
    const u = new URL(urlStr);
    return u.origin;
  } catch {
    return '';
  }
};

async function handleRequest(request: NextRequest, params: { path: string[] }, method: string) {
  // 1) Clerk 認証チェック（未ログインなら 401）
  const authResult = await auth();
  const { userId } = authResult;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Clerk JWT トークンを取得（バックエンドのユーザー認証用）
  const clerkToken = await authResult.getToken();
  if (!clerkToken) {
    return NextResponse.json({ error: 'Failed to get Clerk token' }, { status: 401 });
  }

  // 2) ターゲットURL組み立て
  const path = params.path.join('/');
  const search = request.nextUrl.searchParams.toString();
  const base = USE_LOCAL_BACKEND ? LOCAL_API_BASE_URL : BACKEND_BASE_URL;
  if (!base) {
    return NextResponse.json(
      { error: 'BACKEND_BASE_URL is not configured' },
      { status: 500 }
    );
  }
  const targetUrl = `${base.replace(/\/$/, '')}/${path}${search ? `?${search}` : ''}`;

  // 3) リクエストボディ
  let data: any = undefined;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const text = await request.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text; // JSON でなければそのまま
      }
    }
  }

  // 4) ローカル or Cloud Run 判定
  if (USE_LOCAL_BACKEND || process.env.NODE_ENV === 'development') {
    // ローカル: Cloud Run ID Token 不要、Clerk JWT は送信
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clerkToken}`,
      'X-Clerk-Token': clerkToken,
    };

    const res = await fetch(targetUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      redirect: 'manual',
    });

    const text = await res.text();
    if (!res.ok) {
      return new NextResponse(text, { status: res.status, statusText: res.statusText });
    }
    return new NextResponse(text, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  }

  // 本番: Cloud Run 認証（ID Token）
  if (!GCP_SA_JSON) {
    return NextResponse.json({ error: 'GCP_SA_JSON is missing' }, { status: 500 });
  }

  let credentials;
  try {
    credentials = JSON.parse(GCP_SA_JSON);
  } catch {
    try {
      const decoded = Buffer.from(GCP_SA_JSON, 'base64').toString('utf-8');
      credentials = JSON.parse(decoded);
    } catch {
      return NextResponse.json({ error: 'Invalid GCP_SA_JSON' }, { status: 500 });
    }
  }

  const audience = extractAudience(BACKEND_BASE_URL);
  if (!audience) {
    return NextResponse.json({ error: 'Invalid BACKEND_BASE_URL' }, { status: 500 });
  }

  const authClient = new GoogleAuth({ credentials });
  const client = await authClient.getIdTokenClient(audience);

  const response = await client.request({
    url: targetUrl,
    method: method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data,
    headers: {
      'Content-Type': 'application/json',
      // Authorization will be overwritten by IdTokenClient with the Cloud Run ID token.
      // We pass the Clerk session token separately so the backend can identify the user.
      'X-Clerk-Token': clerkToken,
    },
    validateStatus: () => true,
    responseType: 'json',
  });

  if (response.status >= 400) {
    return NextResponse.json(
      response.data ?? { detail: response.statusText },
      { status: response.status }
    );
  }

  return NextResponse.json(response.data);
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(req, params, 'GET');
}
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(req, params, 'POST');
}
export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(req, params, 'PUT');
}
export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(req, params, 'PATCH');
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(req, params, 'DELETE');
}
