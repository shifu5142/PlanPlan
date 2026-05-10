import type { NextRequest } from 'next/server'

function backendBase(): string {
  const raw = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
  return raw.replace(/\/$/, '')
}

function forwardHeaders(request: NextRequest): HeadersInit {
  const headers: HeadersInit = { Accept: 'application/json' }
  const auth = request.headers.get('authorization')
  if (auth) headers.Authorization = auth
  return headers
}

export async function GET(request: NextRequest) {
  const base = backendBase()
  if (!base) {
    return Response.json({ success: false, message: 'Backend URL not configured' }, { status: 503 })
  }

  const qs = request.nextUrl.searchParams.toString()
  const url = qs ? `${base}/boards?${qs}` : `${base}/boards`

  const upstream = await fetch(url, {
    headers: forwardHeaders(request),
    cache: 'no-store',
  })

  const bodyText = await upstream.text()
  return new Response(bodyText, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
    },
  })
}

export async function POST(request: NextRequest) {
  const base = backendBase()
  if (!base) {
    return Response.json({ success: false, message: 'Backend URL not configured' }, { status: 503 })
  }

  const payload = await request.text()
  const headers: HeadersInit = {
    ...forwardHeaders(request),
    'Content-Type': 'application/json',
  }

  const upstream = await fetch(`${base}/boards`, {
    method: 'POST',
    headers,
    body: payload,
    cache: 'no-store',
  })

  const bodyText = await upstream.text()
  return new Response(bodyText, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
    },
  })
}
