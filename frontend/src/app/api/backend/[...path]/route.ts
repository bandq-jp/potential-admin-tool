import { fetchIdToken } from '@/lib/gcpAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function handler(request: Request, context: any) {
  const path = context?.params?.path?.join('/') ?? '';
  const url = new URL(request.url);
  const target = `${BACKEND_BASE_URL.replace(/\/$/, '')}/${path}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');

  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) {
    let idToken: string;
    try {
      idToken = await fetchIdToken();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(
        JSON.stringify({ message: 'Failed to obtain Cloud Run ID token', detail: message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    headers.set('Authorization', `Bearer ${idToken}`);
  }

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('transfer-encoding');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: Request, context: any) {
  return handler(request, context);
}

export async function POST(request: Request, context: any) {
  return handler(request, context);
}

export async function PUT(request: Request, context: any) {
  return handler(request, context);
}

export async function PATCH(request: Request, context: any) {
  return handler(request, context);
}

export async function DELETE(request: Request, context: any) {
  return handler(request, context);
}

export async function OPTIONS(request: Request, context: any) {
  return handler(request, context);
}

export async function HEAD(request: Request, context: any) {
  return handler(request, context);
}
