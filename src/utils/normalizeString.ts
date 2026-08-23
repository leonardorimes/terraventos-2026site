/** Remove acentos e normaliza para minúsculas, para comparação/match de texto livre. */
export function normalizeString(str: string | undefined | null): string {
  return str ? str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() : '';
}
