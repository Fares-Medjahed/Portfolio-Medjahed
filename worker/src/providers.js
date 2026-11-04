// Fournisseurs d'IA gratuits, tous compatibles avec le format « OpenAI chat completions ».
// L'ordre d'essai vient de la variable PROVIDERS (ex. "groq,gemini"). Si le premier
// échoue (429, 5xx, timeout, erreur réseau), on bascule automatiquement sur le suivant.

import { LIMITS } from './guard.js';

const PROVIDERS = {
  groq: {
    url: (e) => e.GROQ_URL || 'https://api.groq.com/openai/v1/chat/completions',
    key: (e) => e.GROQ_API_KEY,
    model: (e) => e.GROQ_MODEL || 'llama-3.3-70b-versatile'
  },
  gemini: {
    url: (e) => e.GEMINI_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    key: (e) => e.GEMINI_API_KEY,
    model: (e) => e.GEMINI_MODEL || 'gemini-2.5-flash'
  },
  openrouter: {
    url: (e) => e.OPENROUTER_URL || 'https://openrouter.ai/api/v1/chat/completions',
    key: (e) => e.OPENROUTER_API_KEY,
    model: (e) => e.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'
  }
};

export class AllProvidersFailed extends Error {}

function providerOrder(env) {
  return (env.PROVIDERS || 'groq,gemini')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((name) => PROVIDERS[name] && PROVIDERS[name].key(env));
}

/**
 * Demande une réponse en streaming. Renvoie { response, provider } avec la Response
 * du premier fournisseur qui répond correctement, sinon lève AllProvidersFailed.
 */
export async function askWithFallback(env, systemPrompt, messages) {
  const timeoutMs = Number(env.PROVIDER_TIMEOUT_MS) || 12000;
  const order = providerOrder(env);
  const errors = [];

  for (const name of order) {
    const p = PROVIDERS[name];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(p.url(env), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key(env)}` },
        body: JSON.stringify({
          model: p.model(env),
          stream: true,
          max_tokens: LIMITS.MAX_TOKENS,
          temperature: 0.3,
          messages: [{ role: 'system', content: systemPrompt }, ...messages]
        }),
        signal: controller.signal
      });
      clearTimeout(timer); // les en-têtes sont arrivés : le flux peut durer
      if (response.ok && response.body) return { response, provider: name };
      errors.push(`${name}:${response.status}`); // 429, 5xx, 401... → fournisseur suivant
      try { await response.body?.cancel(); } catch { /* ignore */ }
    } catch (err) {
      clearTimeout(timer);
      errors.push(`${name}:${err.name === 'AbortError' ? 'timeout' : 'network'}`);
    }
  }
  const e = new AllProvidersFailed(errors.join(',') || 'no provider configured');
  e.details = errors;
  throw e;
}

/**
 * Convertit le flux SSE du fournisseur en flux simple `data: {"t":"texte"}`
 * et appelle onDone(texteComplet) à la fin (pour alimenter le cache).
 */
export function normalizeStream(upstream, onDone) {
  const reader = upstream.body.getReader();
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = '';
  let full = '';
  const send = (c, obj) => c.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));

  return new ReadableStream({
    async pull(controller) {
      try {
        // On boucle jusqu'à produire du texte ou atteindre la fin : une lecture qui ne
        // contient aucune ligne exploitable ne doit pas bloquer le flux.
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(enc.encode('data: [DONE]\n\n'));
            controller.close();
            if (onDone) onDone(full);
            return;
          }
          buf += dec.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop();
          let produced = false;
          for (const line of lines) {
            const l = line.trim();
            if (!l.startsWith('data:')) continue;
            const d = l.slice(5).trim();
            if (!d || d === '[DONE]') continue;
            try {
              const t = JSON.parse(d).choices?.[0]?.delta?.content;
              if (t) { full += t; send(controller, { t }); produced = true; }
            } catch { /* ligne partielle ignorée */ }
          }
          if (produced) return;
        }
      } catch {
        send(controller, { error: 'stream_error' });
        controller.close();
      }
    },
    cancel() { return reader.cancel(); }
  });
}

/** Réponse déjà connue (cache ou filtre) au même format de flux. */
export function textToStream(text) {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      c.enqueue(enc.encode(`data: ${JSON.stringify({ t: text })}\n\n`));
      c.enqueue(enc.encode('data: [DONE]\n\n'));
      c.close();
    }
  });
}
