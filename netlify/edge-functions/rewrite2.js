export default async function handler(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'x-middleware-rewrite': new URL(request.url).pathname,
      'x-statpulse-debug': 'rewrite-hit',
    },
  });
}