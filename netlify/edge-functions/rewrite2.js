// netlify/edge-functions/rewrite.js
export default async function handler(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'x-middleware-rewrite': new URL(request.url).pathname,
    },
  });
}
