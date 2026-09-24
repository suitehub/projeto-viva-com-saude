/**
 * Lê um arquivo CSV detectando a codificação: tenta UTF-8 estrito primeiro
 * (padrão quando exportado pelo Google Sheets ou pelo próprio painel) e cai
 * para Windows-1252 (padrão do Excel no Windows) se falhar.
 *
 * Sem isso, planilhas salvas pelo Excel chegam com acentos corrompidos
 * ("Ã©", "�") e a corrupção é gravada no banco.
 */
export async function readCsvText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Remove BOM UTF-8 se presente
  let offset = 0;
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    offset = 3;
  }
  const slice = bytes.slice(offset);

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(slice);
  } catch {
    return new TextDecoder("windows-1252").decode(slice);
  }
}

/**
 * Converte valor monetário BR/US para número:
 * "65.00" -> 65 | "65,00" -> 65 | "1.299,00" -> 1299 | "R$ 65,00" -> 65.
 */
export function parseBrPrice(val?: string): number {
  if (!val) return 0;
  let s = String(val)
    .trim()
    .replace(/[R$\s]/g, "");
  if (!s) return 0;
  const hasDot = s.includes(".");
  const hasComma = s.includes(",");
  if (hasDot && hasComma) {
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (hasComma) {
    s = s.replace(",", ".");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
