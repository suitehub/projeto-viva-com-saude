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
