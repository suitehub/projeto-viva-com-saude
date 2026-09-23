import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_DIMENSION_PX = 1280;
const JPEG_QUALITY = 0.82;

/**
 * Comprime uma imagem no navegador antes do upload para o Firebase Storage.
 * Retorna um Blob JPEG pronto para upload. Nunca retorna data URL base64
 * (base64 não deve ir para o Firestore — estoura o limite de 1MB por documento).
 */
export async function compressImageFile(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
  );
  return blob ?? file;
}

/**
 * Faz upload das fotos do produto para o Firebase Storage e retorna as URLs públicas.
 * As URLs (strings curtas) são o que deve ser salvo no Firestore em `images`/`imageUrl`.
 */
export async function uploadProductImages(productId: string, files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const compressed = await compressImageFile(files[i]);
    const safeName = files[i].name.replace(/[^a-zA-Z0-9.\-_]/g, "_") || `foto-${i + 1}.jpg`;
    const objectRef = ref(storage, `products/${productId}/${Date.now()}-${i}-${safeName}`);
    await uploadBytes(objectRef, compressed, { contentType: "image/jpeg" });
    urls.push(await getDownloadURL(objectRef));
  }
  return urls;
}

/** Data URLs (base64) nunca podem ir para o Firestore — identifica para filtrar antes do save. */
export function isDataUrl(value: string): boolean {
  return value.startsWith("data:");
}
