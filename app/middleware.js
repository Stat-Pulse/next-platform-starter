import { NextResponse } from 'next/server';

export function middleware(request) {
  console.error('Middleware: Handling request', {
    url: request.url,
    path: request.nextUrl.pathname,
    time: new Date().toISOString(),
  });
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
