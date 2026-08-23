/** Converte um preço em texto livre (ex: "R$ 1.200.000,00", "A partir de 850 mil") em número, para ordenação/comparação. */
export function parsePrice(priceStr: string | undefined): number | null {
  if (!priceStr) return null;
  const str = priceStr.toLowerCase().replace('r$', '').trim();
  if (str.includes('mil')) {
    const num = parseFloat(str.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'));
    if (!isNaN(num)) return num * 1000;
  }
  const cleanStr = str.replace(/[^\d,]/g, '');
  if (cleanStr) {
    const num = parseFloat(cleanStr.replace(',', '.'));
    if (!isNaN(num) && num > 0) return num;
  }
  return null;
}
