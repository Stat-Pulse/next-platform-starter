export default async function handler(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'x-middleware-rewrite': request.url,
    },
  });
}
