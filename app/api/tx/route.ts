export const runtime = 'nodejs';

import { upstreamFetch } from '@/lib/upstream';

export async function POST(request: Request) {
  const bodyText = await request.text();
  const upstreamRes = await upstreamFetch('/tx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: bodyText,
  });

  const body = await upstreamRes.text();
  const headers = new Headers();
  headers.set('Content-Type', upstreamRes.headers.get('content-type') || 'application/json; charset=utf-8');
  return new Response(body, { status: upstreamRes.status, headers });
}

