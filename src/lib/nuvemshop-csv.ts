import { AdminProductItem, CSV_HEADER } from "@/data/admin-products-data";
import { parseBrPrice } from "./csv-encoding";

/**
 * Parses CSV text with semicolon delimiter matching Nuvemshop format
 * (31 colunas, índices 0-30):
 * 0 "Identificador URL"; 1 Nome; 2 Categorias; 3-8 variações (nome/valor x3);
 * 9 Preço; 10 "Preço promocional"; 11 "Peso (kg)"; 12 "Altura (cm)";
 * 13 "Largura (cm)"; 14 "Comprimento (cm)"; 15 Estoque; 16 SKU;
 * 17 "Código de barras"; 18 "Exibir na loja"; 19 "Frete gratis"; 20 Descrição;
 * 21 Tags; 22 "Título para SEO"; 23 "Descrição para SEO"; 24 Marca;
 * 25 "Produto Físico"; 26 MPN; 27 Sexo; 28 "Faixa etária"; 29 Custo; 30 Visibilidade
 */
export function parseNuvemshopCsv(csvText: string): AdminProductItem[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const items: AdminProductItem[] = [];

  // Line 0 is header, parse from line 1
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const columns = parseCsvLine(line, ";");
    if (columns.length < 2) continue;

    const urlSlug = cleanField(columns[0]) || `produto-${i}`;
    const name = cleanField(columns[1]);
    if (!name) continue;

    const categories = cleanField(columns[2]) || "Geral";
    const price = parseBrPrice(columns[9]);
    const promotionalPrice = parseBrPrice(columns[10]);
    const weightKg = parseBrPrice(columns[11]);
    const heightCm = parseBrPrice(columns[12]) || 1;
    const widthCm = parseBrPrice(columns[13]) || 1;
    const lengthCm = parseBrPrice(columns[14]) || 1;
    const stockStr = cleanField(columns[15]);
    const sku = cleanField(columns[16]);
    const barcode = cleanField(columns[17]);
    const displayInStoreStr = cleanField(columns[18]).toUpperCase();
    const freeShippingStr = cleanField(columns[19]).toUpperCase();
    const description = cleanField(columns[20]);
    const tags = cleanField(columns[21]);
    const seoTitle = cleanField(columns[22]);
    const seoDescription = cleanField(columns[23]);
    const brand = cleanField(columns[24]) || "Projeto Viva com Saúde";
    const isPhysicalStr = cleanField(columns[25]).toUpperCase();
    const mpn = cleanField(columns[26]);
    const gender = cleanField(columns[27]);
    const ageGroup = cleanField(columns[28]);
    const cost = parseBrPrice(columns[29]);
    const visibilityStr = cleanField(columns[30]);

    let stock: string | number = "Infinito";
    if (stockStr && !isNaN(Number(stockStr))) {
      stock = Number(stockStr);
    } else if (stockStr.toLowerCase() === "infinito" || !stockStr) {
      stock = "Infinito";
    }

    let visibility: "Visível" | "Não listado" | "Oculto" = "Visível";
    if (visibilityStr.toLowerCase().includes("oculto")) {
      visibility = "Oculto";
    } else if (visibilityStr.toLowerCase().includes("não listado")) {
      visibility = "Não listado";
    }

    items.push({
      id: urlSlug,
      urlSlug,
      name,
      categories,
      price,
      promotionalPrice,
      weightKg,
      heightCm,
      widthCm,
      lengthCm,
      stock,
      sku,
      barcode,
      displayInStore: displayInStoreStr !== "NÃO" && displayInStoreStr !== "NAO",
      freeShipping: freeShippingStr === "SIM",
      description,
      tags,
      seoTitle,
      seoDescription,
      brand,
      isPhysical: isPhysicalStr !== "NÃO" && isPhysicalStr !== "NAO",
      mpn,
      gender,
      ageGroup,
      cost,
      visibility,
      imagePositionIndex: i % 6,
    });
  }

  return items;
}

function cleanField(val?: string): string {
  if (!val) return "";
  let s = val.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }
  return s.replace(/""/g, '"').trim();
}

function parseCsvLine(line: string, delimiter: string = ";"): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Generates Nuvemshop-compatible CSV format matching user's spreadsheet export
 */
export function exportToNuvemshopCsv(products: AdminProductItem[]): string {
  const rows: string[] = [CSV_HEADER];

  for (const p of products) {
    const fields = [
      escapeCsv(p.urlSlug),
      escapeCsv(p.name),
      escapeCsv(p.categories),
      "", // Nome da variação 1
      "", // Valor da variação 1
      "", // Nome da variação 2
      "", // Valor da variação 2
      "", // Nome da variação 3
      "", // Valor da variação 3
      p.price.toFixed(2),
      p.promotionalPrice > 0 ? p.promotionalPrice.toFixed(2) : "",
      p.weightKg.toFixed(2),
      p.heightCm.toFixed(2),
      p.widthCm.toFixed(2),
      p.lengthCm.toFixed(2),
      typeof p.stock === "number" ? p.stock.toString() : "",
      escapeCsv(p.sku),
      escapeCsv(p.barcode),
      p.displayInStore ? "SIM" : "NÃO",
      p.freeShipping ? "SIM" : "NÃO",
      escapeCsv(p.description),
      escapeCsv(p.tags),
      escapeCsv(p.seoTitle),
      escapeCsv(p.seoDescription),
      escapeCsv(p.brand),
      p.isPhysical ? "SIM" : "NÃO",
      escapeCsv(p.mpn),
      escapeCsv(p.gender),
      escapeCsv(p.ageGroup),
      p.cost > 0 ? p.cost.toFixed(2) : "",
      escapeCsv(p.visibility),
    ];
    rows.push(fields.join(";"));
  }

  return rows.join("\r\n");
}

function escapeCsv(val?: string | number): string {
  if (val === undefined || val === null) return "";
  const str = String(val);
  if (str.includes(";") || str.includes('"') || str.includes("\n") || str.includes(",")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
