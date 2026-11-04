// Limitation de débit par IP : N messages par minute (mémoire de l'instance, approximatif)
// et M messages par jour (KV Cloudflare si disponible, sinon mémoire).
// Les IP ne sont jamais stockées en clair : seulement un hachage salé qui expire en 25 h.

import { sha256Hex } from './guard.js';

const minuteHits = new Map(); // ipHash -> [timestamps]
const dayHits = new Map();    // fallback mémoire : ipHash:date -> count

export async function anonymize(env, ip) {
  return (await sha256Hex(`${env.IP_SALT || 'portfolio'}|${ip}`)).slice(0, 24);
}

/** Renvoie { ok: true } ou { ok: false, reason: 'minute' | 'day' }. */
export async function checkRate(env, ipHash, now = Date.now()) {
  const perMin = Number(env.RATE_PER_MIN) || 10;
  const perDay = Number(env.RATE_PER_DAY) || 30;

  // --- par minute (fenêtre glissante, mémoire) ---
  const recent = (minuteHits.get(ipHash) || []).filter((t) => now - t < 60_000);
  if (recent.length >= perMin) {
    minuteHits.set(ipHash, recent);
    return { ok: false, reason: 'minute' };
  }
  recent.push(now);
  minuteHits.set(ipHash, recent);
  if (minuteHits.size > 5000) minuteHits.clear(); // garde-fou mémoire

  // --- par jour ---
  const day = new Date(now).toISOString().slice(0, 10);
  const key = `d:${ipHash}:${day}`;
  try {
    if (env.RATE) {
      const count = Number(await env.RATE.get(key)) || 0;
      if (count >= perDay) return { ok: false, reason: 'day' };
      await env.RATE.put(key, String(count + 1), { expirationTtl: 90_000 });
    } else {
      const count = dayHits.get(key) || 0;
      if (count >= perDay) return { ok: false, reason: 'day' };
      dayHits.set(key, count + 1);
      if (dayHits.size > 5000) dayHits.clear();
    }
  } catch {
    // KV indisponible ou quota d'écriture atteint : on laisse passer (le quota du
    // fournisseur d'IA reste la limite ultime et déclenche le message d'indisponibilité).
  }
  return { ok: true };
}

// Utilitaires de test
export function _resetRateLimit() { minuteHits.clear(); dayHits.clear(); }
