/**
 * Notificações de pedidos novos no admin: vistos (localStorage),
 * selo de contagem, destaque e som de alerta (WebAudio, sem arquivos).
 */

const SEEN_KEY = "pvcs_seen_order_ids";
const MAX_SEEN = 500;

export const ORDERS_SEEN_EVENT = "pvcs_orders_seen";

export function getSeenOrderIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

export function markOrdersSeen(ids: string[]): void {
  if (typeof window === "undefined" || ids.length === 0) return;
  try {
    const seen = getSeenOrderIds();
    for (const id of ids) seen.add(id);
    const trimmed = Array.from(seen).slice(-MAX_SEEN);
    localStorage.setItem(SEEN_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new Event(ORDERS_SEEN_EVENT));
  } catch {
    // ignore
  }
}

/** Bipe duplo de alerta (só funciona após interação do usuário com a página). */
export function playNotificationSound(): void {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [0, 0.22].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.25, now + offset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.22);
    });
    setTimeout(() => void ctx.close().catch(() => {}), 800);
  } catch {
    // navegador bloqueou áudio: ignora
  }
}
