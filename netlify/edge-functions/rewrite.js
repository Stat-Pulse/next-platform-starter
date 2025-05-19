// netlify/edge-functions/rewrite.js
import { NextResponse } from 'next/server'

export default async function middleware(request) {
  return NextResponse.rewrite(request.nextUrl)
}
