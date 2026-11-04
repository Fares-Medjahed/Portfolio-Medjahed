// Validation des entrées et filtre anti-injection évident (économise des tokens).

export const LIMITS = {
  MAX_MESSAGE_CHARS: 500,   // longueur max d'un message utilisateur
  MAX_HISTORY: 6,           // nombre de messages envoyés à l'IA
  MAX_BODY_BYTES: 8000,     // taille max de la requête
  MAX_TOKENS: 300           // longueur max de la réponse
};

export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** Valide le corps de la requête et renvoie les messages nettoyés. */
export function validateMessages(body) {
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    throw new HttpError(400, 'bad_request', 'Requête invalide.');
  }
  const cleaned = [];
  for (const m of body.messages.slice(-LIMITS.MAX_HISTORY)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
      throw new HttpError(400, 'bad_request', 'Requête invalide.');
    }
    const content = m.content.trim();
    if (!content) throw new HttpError(400, 'bad_request', 'Message vide.');
    if (m.role === 'user' && content.length > LIMITS.MAX_MESSAGE_CHARS) {
      throw new HttpError(400, 'too_long', `Message trop long (${LIMITS.MAX_MESSAGE_CHARS} caractères maximum).`);
    }
    // Les anciennes réponses de l'assistant sont tronquées par sécurité.
    cleaned.push({ role: m.role, content: m.role === 'assistant' ? content.slice(0, 1500) : content });
  }
  if (cleaned[cleaned.length - 1].role !== 'user') {
    throw new HttpError(400, 'bad_request', 'Le dernier message doit venir de l’utilisateur.');
  }
  // L'historique doit commencer par un message utilisateur.
  while (cleaned.length && cleaned[0].role !== 'user') cleaned.shift();
  return cleaned;
}

const INJECTION_PATTERNS = [
  /(ignore|oublie|disregard|forget|override)\b.{0,40}\b(instruction|consigne|règle|regle|rule|prompt|directive)/i,
  /(affiche|montre|révèle|revele|donne|répète|repete|reveal|show|print|repeat|display|output|leak)\b.{0,40}\b(prompt système|prompt systeme|system prompt|system message|tes instructions|your instructions|initial prompt|prompt initial)/i,
  /\b(system prompt|prompt système|prompt systeme)\b/i,
  /(tu es maintenant|you are now|from now on you|à partir de maintenant tu|act as|joue le rôle|pretend (to be|you))/i,
  /\b(jailbreak|DAN mode|developer mode|mode développeur)\b/i
];

export function looksLikeInjection(text) {
  return INJECTION_PATTERNS.some((re) => re.test(text));
}

export const INJECTION_REPLY =
  'Je ne peux pas faire cela. Je suis l’assistant IA de Farès : posez-moi plutôt vos questions sur son parcours, ses compétences ou ses projets.\n' +
  'I can’t do that. I’m Farès’s AI assistant: feel free to ask about his background, skills or projects.';

/** Clé de cache normalisée (questions identiques ou presque). */
export function normalizeQuestion(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
