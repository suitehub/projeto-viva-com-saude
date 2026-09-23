const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

const MAX_DIMENSION_PX = 1280;
const JPEG_QUALITY = 0.82;

/**
 * Comprime uma imagem no navegador antes do upload.
 * Retorna um Blob JPEG pronto para envio. Nunca retorna data URL base64
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
 * Faz upload das fotos do produto para o Cloudinary (plano gratuito) e retorna
 * as URLs https. As URLs (strings curtas) são o que vai para o Firestore em
 * `images`/`imageUrl` — nunca base64.
 *
 * Configuração única: VITE_CLOUDINARY_CLOUD_NAME + VITE_CLOUDINARY_UPLOAD_PRESET
 * (preset do tipo Unsigned, pasta `products`).
 */
export async function uploadProductImages(productId: string, files: File[]): Promise<string[]> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "CLOUDINARY_NAO_CONFIGURADO: defina VITE_CLOUDINARY_CLOUD_NAME e " +
        "VITE_CLOUDINARY_UPLOAD_PRESET no .env para enviar fotos.",
    );
  }

  const urls: string[] = [];
  for (const file of files) {
    const compressed = await compressImageFile(file);
    const form = new FormData();
    form.append("file", compressed, file.name || `foto-${Date.now()}.jpg`);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("folder", `products/${productId}`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      throw new Error(`CLOUDINARY_UPLOAD_FAILED: status ${res.status}`);
    }
    const data = (await res.json()) as { secure_url?: string };
    if (!data.secure_url) {
      throw new Error("CLOUDINARY_UPLOAD_FAILED: resposta sem secure_url");
    }
    urls.push(data.secure_url);
  }
  return urls;
}

/** Data URLs (base64) nunca podem ir para o Firestore — identifica para filtrar antes do save. */
export function isDataUrl(value: string): boolean {
  return value.startsWith("data:");
}
