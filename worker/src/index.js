// Worker Cloudflare : proxy sécurisé entre le portfolio et les fournisseurs d'IA gratuits.
// Les clés API ne sont jamais envoyées au navigateur.

import { buildSystemPrompt } from './prompt.js';
import { askWithFallback, normalizeStream, textToStream, AllProvidersFailed } from './providers.js';
import { checkRate, anonymize } from './ratelimit.js';
import {
  HttpError, LIMITS, validateMessages, looksLikeInjection, INJECTION_REPLY, normalizeQuestion, sha256Hex
} from './guard.js';

const DEFAULT_ORIGINS = 'https://fares-medjahed.github.io';
const memoryCache = new Map(); // secours si KV n'est pas configuré
const CACHE_TTL = 60 * 60 * 24 * 7; // 7 jours

const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

async function cacheGet(env, key) {
  try { return env.RATE ? await env.RATE.get(key) : memoryCache.get(key) ?? null; } catch { return null; }
}
async function cachePut(env, key, value) {
  try {
    if (env.RATE) await env.RATE.put(key, value, { expirationTtl: CACHE_TTL });
    else { memoryCache.set(key, value); if (memoryCache.size > 200) memoryCache.clear(); }
  } catch { /* quota d'écriture KV : on ignore */ }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(',').map((s) => s.trim()).filter(Boolean);
    const originOk = allowed.includes(origin);
    const cors = originOk ? corsHeaders(origin) : {};

    if (url.pathname === '/health') return json(200, { ok: true });

    if (request.method === 'OPTIONS') return new Response(null, { status: originOk ? 204 : 403, headers: cors });
    if (url.pathname !== '/chat' || request.method !== 'POST') return json(404, { error: 'not_found' }, cors);
    if (!originOk) return json(403, { error: 'forbidden', message: 'Origine non autorisée.' });

    try {
      // 1) Limitation de débit
      const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
      const rate = await checkRate(env, await anonymize(env, ip));
      if (!rate.ok) {
        throw new HttpError(429, 'rate_limited',
          rate.reason === 'minute'
            ? 'Vous envoyez beaucoup de messages. Patientez une minute avant de réessayer.'
            : 'Limite quotidienne atteinte. Revenez demain ou contactez-moi directement.');
      }

      // 2) Validation des entrées
      const raw = await request.text();
      if (raw.length > LIMITS.MAX_BODY_BYTES) throw new HttpError(413, 'too_long', 'Requête trop volumineuse.');
      let body;
      try { body = JSON.parse(raw); } catch { throw new HttpError(400, 'bad_request', 'Requête invalide.'); }
      const messages = validateMessages(body);
      const question = messages[messages.length - 1].content;

      const sseHeaders = {
        ...cors,
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no'
      };

      // 3) Tentatives évidentes de manipulation : réponse fixe, aucun token consommé
      if (looksLikeInjection(question)) {
        return new Response(textToStream(INJECTION_REPLY), { headers: { ...sseHeaders, 'X-Source': 'filter' } });
      }

      // 4) Cache des questions identiques (premier message d'une conversation uniquement)
      const cacheable = messages.length === 1;
      const cacheKey = cacheable ? `c:${await sha256Hex(normalizeQuestion(question))}` : null;
      if (cacheable) {
        const hit = await cacheGet(env, cacheKey);
        if (hit) return new Response(textToStream(hit), { headers: { ...sseHeaders, 'X-Source': 'cache' } });
      }

      // 5) Appel à l'IA avec basculement automatique
      const { response, provider } = await askWithFallback(env, buildSystemPrompt(), messages);
      const stream = normalizeStream(response, (full) => {
        if (cacheable && full.trim().length > 20) ctx.waitUntil(cachePut(env, cacheKey, full));
      });
      return new Response(stream, { headers: { ...sseHeaders, 'X-Source': provider } });
    } catch (err) {
      if (err instanceof HttpError) return json(err.status, { error: err.code, message: err.message }, cors);
      if (err instanceof AllProvidersFailed) {
        // Détails (statuts uniquement, jamais de contenu utilisateur) pour les logs Cloudflare
        console.warn('providers_failed', err.details);
        return json(503, { error: 'unavailable', message: 'Service momentanément indisponible.' }, cors);
      }
      console.error('unexpected_error', err && err.name); // pas de stack ni de contenu envoyés au client
      return json(500, { error: 'server_error', message: 'Erreur interne.' }, cors);
    }
  }
};
