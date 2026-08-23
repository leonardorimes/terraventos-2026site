/**
 * Sincroniza filtros de UI com a query string da URL sem passar pelo react-router.
 *
 * O AppShell dispara a transição de página (fade exit/enter) toda vez que
 * `useLocation()` muda, inclusive em chamadas de `navigate`/`setSearchParams`
 * com `replace: true`. Se os filtros fossem sincronizados por ali, a página
 * "piscaria" a cada tecla digitada na busca. `history.replaceState` atualiza
 * a URL visível sem passar pelo router, então não dispara essa transição.
 */
export function readSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

export function syncSearchParams(params: Record<string, string | null>): void {
  const current = new URLSearchParams(window.location.search);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === '') {
      current.delete(key);
    } else {
      current.set(key, value);
    }
  });
  const query = current.toString();
  const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', newUrl);
}
