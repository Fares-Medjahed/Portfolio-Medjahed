# Portfolio de Farès Medjahed

Site statique (HTML / CSS / JavaScript, sans build) hébergé sur **GitHub Pages**, avec un **chatbot IA « double numérique »** qui répond aux questions des recruteurs. Coût : **0 €** (paliers gratuits, sans carte bancaire).

- Site : https://fares-medjahed.github.io/Portfolio-Medjahed/
- Version FR / EN (bouton en haut à droite), CV téléchargeable (`cv/CV-Fares-Medjahed.pdf`).

## Le chatbot : architecture

```
Navigateur (GitHub Pages)                 Cloudflare Worker (gratuit)               IA gratuite
js/chat.js + css/chat.css  --POST /chat-->  worker/src/index.js  --streaming-->  1) Groq
(widget, aucune clé)                        - CORS limité à votre domaine         2) Gemini (secours automatique)
                                            - limite par IP (10/min, 30/jour)     3) OpenRouter (optionnel)
                                            - validation + filtre anti-injection
                                            - cache des questions fréquentes
                                            - clés API en secrets Cloudflare
```

GitHub Pages ne peut pas exécuter de code serveur : le petit Worker garde donc les **clés API secrètes** et applique les protections.

| Fichier | Rôle |
|---|---|
| `js/chat.js`, `css/chat.css` | Widget (bouton flottant, fenêtre, suggestions, streaming, FR/EN, accessibilité) |
| `worker/src/index.js` | Point d'entrée : CORS, limites, cache, appel IA, erreurs propres |
| `worker/src/knowledge.js` | **Base de connaissances** (tout ce que l'assistant peut dire) |
| `worker/src/prompt.js` | Prompt système (règles + base de connaissances) |
| `worker/src/providers.js` | Clients IA avec **basculement automatique** (429, 5xx, timeout) |
| `worker/src/ratelimit.js` | Limitation de débit par IP anonymisée |
| `worker/src/guard.js` | Validation des entrées, filtre anti-injection, limites |
| `worker/test/` | 15 tests automatiques (faux fournisseurs, aucun quota consommé) |
| `worker/scripts/` | Serveur local (`dev-server.mjs`) et tests avec vraie IA (`live-test.mjs`) |

### Réduction des tokens
Base de connaissances directement dans le prompt (pas de RAG) · réponse limitée à 300 tokens · message limité à 500 caractères · 6 derniers messages envoyés · cache des questions identiques (premier message d'une conversation) · filtre serveur qui répond sans appeler l'IA aux tentatives évidentes de manipulation.

Si tous les fournisseurs sont indisponibles ou épuisés, le visiteur voit : « Le chatbot est momentanément indisponible, vous pouvez me contacter via email ou LinkedIn. »

### Confidentialité
Aucune conversation n'est stockée (ni côté navigateur, ni côté serveur). Le Worker ne garde qu'un compteur de messages par visiteur, basé sur un **hachage salé de l'IP** qui expire en 25 h. Les messages sont traités par le fournisseur d'IA (Groq / Gemini) : le widget invite à ne pas saisir de données personnelles. Le Worker ne journalise jamais le contenu des messages.

## Variables d'environnement

| Variable | Où | Rôle |
|---|---|---|
| `GROQ_API_KEY` | **secret** | Clé Groq (fournisseur principal) |
| `GEMINI_API_KEY` | **secret** | Clé Google AI Studio (secours) |
| `OPENROUTER_API_KEY` | secret (optionnel) | Troisième fournisseur |
| `IP_SALT` | secret | Chaîne aléatoire pour anonymiser les IP |
| `ALLOWED_ORIGINS` | `wrangler.toml` | Origines autorisées, ex. `https://fares-medjahed.github.io` (sans chemin ni `/` final) |
| `PROVIDERS` | `wrangler.toml` | Ordre d'essai, ex. `groq,gemini` |
| `GROQ_MODEL`, `GEMINI_MODEL`, `OPENROUTER_MODEL` | `wrangler.toml` | Modèles utilisés |
| `RATE_PER_MIN`, `RATE_PER_DAY` | `wrangler.toml` | Limites par visiteur (10 / 30) |

Modèle de fichier local : `worker/.dev.vars.example` (copiez-le en `worker/.dev.vars`, ignoré par git). **Ne committez jamais de clé.**

## Déploiement pas à pas (GitHub Pages + Cloudflare Workers)

1. **Créer les clés gratuites** (sans carte bancaire) :
   - Groq : https://console.groq.com/keys
   - Gemini : https://aistudio.google.com/apikey
   - Vérifiez dans chaque console les **quotas et noms de modèles actuels** ; adaptez `GROQ_MODEL` / `GEMINI_MODEL` dans `worker/wrangler.toml` si besoin (les noms évoluent).
2. **Créer un compte Cloudflare** gratuit (https://dash.cloudflare.com/sign-up). Installez Node.js 18 ou plus.
3. Dans un terminal :
   ```bash
   cd worker
   npm install
   npx wrangler login
   ```
4. **(Recommandé) Compteur journalier fiable + cache** avec KV gratuit :
   ```bash
   npx wrangler kv namespace create RATE
   ```
   Copiez l'`id` affiché, puis décommentez le bloc `[[kv_namespaces]]` de `wrangler.toml` en y collant l'id. (Sans KV, les limites et le cache restent en mémoire de l'instance : moins fiable.)
5. **Enregistrer les secrets** (la valeur vous est demandée, elle n'est écrite nulle part) :
   ```bash
   npx wrangler secret put GROQ_API_KEY
   npx wrangler secret put GEMINI_API_KEY
   npx wrangler secret put IP_SALT      # n'importe quelle longue chaîne aléatoire
   ```
6. **Déployer** : `npx wrangler deploy`. Notez l'URL affichée, de la forme `https://portfolio-chat.<votre-sous-domaine>.workers.dev`. Vérifiez : `curl https://…workers.dev/health` doit répondre `{"ok":true}`.
7. **Activer le widget sur le site** : dans `index.html`, renseignez l'URL avec `/chat` à la fin :
   ```html
   <script src="js/chat.js" data-api="https://portfolio-chat.<votre-sous-domaine>.workers.dev/chat"></script>
   ```
   Puis `git add -A && git commit -m "Active le chatbot" && git push`. GitHub Pages republie en 1 à 2 minutes ; rechargez avec Ctrl+Maj+R.

> **Deux modes.** Tant que `data-api` est vide, le chatbot fonctionne en **mode local** : le bouton est visible et répond à partir du profil de Farès (règles par mots-clés dans `js/chat.js`, rubrique « Mode local »), sans IA, sans clé et sans aucun envoi de données. Dès que `data-api` pointe vers le Worker, il passe en **mode IA** ; si l'IA est indisponible (quota épuisé, panne), il retombe automatiquement sur le mode local. Pour modifier les réponses du mode local, éditez l'objet `A` et les règles `RULES` dans `js/chat.js`.

## Mettre à jour la base de connaissances
1. Modifiez `worker/src/knowledge.js` (faits exacts et non confidentiels uniquement ; coordonnées dans `CONTACT`).
2. `cd worker && npm test` puis `npm run deploy`.
Si une information n'est pas dans ce fichier, l'assistant répond qu'il ne la connaît pas et renvoie vers votre contact.

## Changer de fournisseur d'IA
- **Ordre / secours** : modifiez `PROVIDERS` dans `worker/wrangler.toml` (ex. `"gemini,groq"`).
- **Ajouter OpenRouter** (modèles `:free`) : `npx wrangler secret put OPENROUTER_API_KEY`, puis `PROVIDERS = "groq,gemini,openrouter"`.
- **Autre fournisseur compatible « OpenAI chat completions »** : ajoutez un bloc dans `PROVIDERS` de `worker/src/providers.js` (url, clé, modèle) et son nom dans la variable `PROVIDERS`.

## Tester en local
```bash
# Tests automatiques (faux fournisseurs)
cd worker && npm test

# Avec de vraies clés : copiez .dev.vars.example en .dev.vars, puis
npm run local                      # worker sur http://localhost:8787
npm run live-test                  # pose 8 questions types et affiche les réponses
# Site : à la racine, `python3 -m http.server 8080`, avec data-api="http://localhost:8787/chat"
```

## Limites connues et pistes d'amélioration
- La limite « par minute » est gardée en mémoire de l'instance Cloudflare : approximative. La limite « par jour » est fiable avec KV (quota d'écriture gratuit : 1 000 par jour).
- Le filtre anti-injection est volontairement simple ; le reste repose sur le prompt système. Un modèle peut occasionnellement se tromper : l'avertissement du widget le dit.
- Quotas gratuits des fournisseurs : ils changent ; surveillez vos consoles.
- Pistes : statistiques anonymes d'usage, résumé « 30 secondes » du profil, boutons d'action (CV, contact) dans les réponses.
