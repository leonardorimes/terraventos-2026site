export interface AdminNavItem {
  label: string;
  path: string;
}

// Adicionar futuras seções do painel (ex: Propriedades) aqui.
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [{ label: 'Posts', path: '/admin/posts' }];
