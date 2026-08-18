// URLs em /f/* são de uma estrutura antiga do site (posts nunca migrados
// para /blog/:slug) que o Google ainda tem indexadas na memória e continua
// rastreando, retornando "soft 404" (200 + conteúdo de página não encontrada)
// porque o rewrite de SPA no vercel.json serve index.html pra qualquer rota
// desconhecida. Isso faz o Search Console reportar essas páginas como erro.
// Respondendo com um 404 HTTP real aqui, antes do rewrite de SPA, o Google
// para de indicar erro e eventualmente remove essas URLs do índice.
export const config = {
  matcher: ['/f/:path*'],
};

export default function middleware() {
  return new Response('Not Found', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
