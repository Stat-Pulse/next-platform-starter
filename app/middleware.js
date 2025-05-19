import { NextResponse } from 'next/server';

export function middleware(request) {
  const logData = {
    url: request.url,
    path: request.nextUrl.pathname,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    time: new Date().toISOString(),
  };
  console.error('Middleware: Handling request', logData);
  console.log('Middleware: Debug log', {
    path: request.nextUrl.pathname,
    method: request.method,
    time: new Date().toISOString(),
  });
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
