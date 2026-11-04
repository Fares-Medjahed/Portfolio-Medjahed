/* Widget de chat : « double numérique » de Farès.
   L'URL du backend (Worker Cloudflare) est donnée par l'attribut data-api de la balise <script>.
   Si elle est vide, le widget n'est pas affiché. Aucune donnée n'est stockée dans le navigateur. */
(function () {
  'use strict';
  var script = document.currentScript;
  var API = script && script.getAttribute('data-api') ? script.getAttribute('data-api').trim() : '';
  if (!API) return;

  var MAX_CHARS = 500, MAX_HISTORY = 6;
  var EMAIL = 'Fares.medjahed2@gmail.com';
  var LINKEDIN = 'https://www.linkedin.com/in/fares-m-8a0b7224b/';

  var T = {
    fr: {
      open: 'Ouvrir le chat avec l’assistant IA', close: 'Fermer le chat', clear: 'Effacer la conversation',
      title: 'Assistant IA de Farès', subtitle: 'Double numérique · réponses automatiques',
      hello: 'Bonjour, je suis l’assistant IA de Fares. Posez-moi vos questions sur son parcours, ses compétences et ses projets.',
      suggestions: ['Quel est ton parcours ?', 'Quelles sont tes compétences techniques ?', 'Parle-moi de tes projets', 'Es-tu disponible ?', 'Comment te contacter ?'],
      placeholder: 'Posez votre question…', send: 'Envoyer', typing: 'L’assistant écrit…',
      disclaimer: 'Assistant IA, les réponses peuvent contenir des erreurs. Pour une information fiable, <a href="#contact" data-chat-contact>contactez-moi directement</a>.',
      privacy: 'Aucune conversation n’est conservée. Les messages sont traités par un fournisseur d’IA tiers : n’y saisissez pas de données personnelles.',
      unavailable: 'Le chatbot est momentanément indisponible, vous pouvez me contacter via <a href="mailto:' + EMAIL + '">email</a> ou <a href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn</a>.',
      rate: 'Vous envoyez beaucoup de messages. Patientez un instant avant de réessayer.',
      day: 'Limite quotidienne atteinte. Revenez demain ou contactez-moi via <a href="mailto:' + EMAIL + '">email</a>.',
      toolong: 'Votre message est trop long (500 caractères maximum).',
      you: 'Vous', bot: 'Assistant'
    },
    en: {
      open: 'Open the chat with the AI assistant', close: 'Close chat', clear: 'Clear conversation',
      title: 'Farès’s AI assistant', subtitle: 'Digital twin · automated answers',
      hello: 'Hello, I’m Fares’s AI assistant. Ask me about his background, skills and projects.',
      suggestions: ['What is your background?', 'What are your technical skills?', 'Tell me about your projects', 'Are you available?', 'How can I contact you?'],
      placeholder: 'Ask your question…', send: 'Send', typing: 'The assistant is typing…',
      disclaimer: 'AI assistant, answers may contain errors. For reliable information, <a href="#contact" data-chat-contact>contact me directly</a>.',
      privacy: 'No conversation is stored. Messages are processed by a third-party AI provider: do not enter personal data.',
      unavailable: 'The chatbot is temporarily unavailable, you can reach me via <a href="mailto:' + EMAIL + '">email</a> or <a href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn</a>.',
      rate: 'You are sending many messages. Please wait a moment before trying again.',
      day: 'Daily limit reached. Come back tomorrow or contact me by <a href="mailto:' + EMAIL + '">email</a>.',
      toolong: 'Your message is too long (500 characters maximum).',
      you: 'You', bot: 'Assistant'
    }
  };
  function lang() { return (document.documentElement.lang || 'fr').slice(0, 2) === 'en' ? 'en' : 'fr'; }
  function t(k) { return T[lang()][k]; }

  /* ---------- DOM ---------- */
  var root = document.createElement('div');
  root.className = 'chat-root';
  root.innerHTML =
    '<button class="chat-launcher" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="chat-panel">' +
      '<svg class="ic-chat" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>' +
      '<svg class="ic-x" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    '<section class="chat-panel" id="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden>' +
      '<header class="chat-head">' +
        '<div class="chat-avatar" aria-hidden="true">F</div>' +
        '<div class="chat-head-text"><strong id="chat-title"></strong><span class="chat-sub"></span></div>' +
        '<button class="chat-icon-btn chat-clear" type="button"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg></button>' +
        '<button class="chat-icon-btn chat-close" type="button"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</header>' +
      '<div class="chat-log" role="log" aria-live="polite" aria-relevant="additions text" tabindex="0"></div>' +
      '<div class="chat-suggestions"></div>' +
      '<form class="chat-form" autocomplete="off">' +
        '<label class="chat-sr" for="chat-input"></label>' +
        '<textarea id="chat-input" rows="1" maxlength="' + MAX_CHARS + '"></textarea>' +
        '<button class="chat-send" type="submit"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 20.5v-6.8l9-1.7-9-1.7V3.5L22 12z"/></svg></button>' +
      '</form>' +
      '<footer class="chat-foot"><p class="chat-disclaimer"></p><p class="chat-privacy"></p></footer>' +
    '</section>';
  document.body.appendChild(root);

  var $ = function (s) { return root.querySelector(s); };
  var launcher = $('.chat-launcher'), panel = $('.chat-panel'), log = $('.chat-log'),
      form = $('.chat-form'), input = $('#chat-input'), sendBtn = $('.chat-send'),
      sugg = $('.chat-suggestions');

  var history = [];     // {role, content} : uniquement en mémoire
  var busy = false, controller = null;

  /* ---------- Textes (suivent la langue du site) ---------- */
  function applyLang() {
    launcher.setAttribute('aria-label', t('open'));
    $('#chat-title').textContent = t('title');
    $('.chat-sub').textContent = t('subtitle');
    $('.chat-close').setAttribute('aria-label', t('close'));
    $('.chat-close').title = t('close');
    $('.chat-clear').setAttribute('aria-label', t('clear'));
    $('.chat-clear').title = t('clear');
    $('.chat-form label').textContent = t('placeholder');
    input.placeholder = t('placeholder');
    sendBtn.setAttribute('aria-label', t('send'));
    $('.chat-disclaimer').innerHTML = t('disclaimer');
    $('.chat-privacy').textContent = t('privacy');
    if (!history.length) renderWelcome();
  }

  /* ---------- Rendu ---------- */
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function format(text) {
    var h = esc(text);
    h = h.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    h = h.replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, function (m, e, off, str) {
      return str.slice(Math.max(0, off - 1), off) === '>' || str.slice(Math.max(0, off - 7), off).indexOf('mailto:') > -1 ? m : '<a href="mailto:' + e + '">' + e + '</a>';
    });
    return h.replace(/\n/g, '<br>');
  }
  function addMsg(role, html, raw) {
    var el = document.createElement('div');
    el.className = 'chat-msg ' + (role === 'user' ? 'is-user' : 'is-bot');
    var b = document.createElement('div');
    b.className = 'chat-bubble';
    if (raw) b.innerHTML = html; else b.textContent = html;
    var who = document.createElement('span');
    who.className = 'chat-sr';
    who.textContent = role === 'user' ? t('you') + ' : ' : t('bot') + ' : ';
    el.appendChild(who); el.appendChild(b);
    log.appendChild(el);
    scrollDown();
    return b;
  }
  function scrollDown() { log.scrollTop = log.scrollHeight; }
  function typingDots() { return '<span class="chat-dots" role="status" aria-label="' + esc(t('typing')) + '"><i></i><i></i><i></i></span>'; }

  function renderWelcome() {
    log.innerHTML = '';
    addMsg('bot', t('hello'));
    renderSuggestions();
  }
  function renderSuggestions() {
    sugg.innerHTML = '';
    if (history.length) return;
    t('suggestions').forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chat-chip'; b.textContent = q;
      b.addEventListener('click', function () { send(q); });
      sugg.appendChild(b);
    });
  }

  /* ---------- Envoi ---------- */
  function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    if (text.length > MAX_CHARS) { addMsg('bot', t('toolong')); return; }
    busy = true; sendBtn.disabled = true;
    sugg.innerHTML = '';
    addMsg('user', text);
    input.value = ''; autosize();
    var body = history.slice(-MAX_HISTORY).concat([{ role: 'user', content: text }]);
    var bubble = addMsg('bot', typingDots(), true);
    var got = '';
    controller = new AbortController();

    fetch(API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: body }), signal: controller.signal
    }).then(function (res) {
      if (!res.ok) {
        return res.json().catch(function () { return {}; }).then(function (j) { throw { code: j.error || 'unavailable' }; });
      }
      return readStream(res, function (chunk) {
        got += chunk;
        bubble.innerHTML = format(got);
        scrollDown();
      });
    }).then(function () {
      if (!got.trim()) throw { code: 'unavailable' };
      history.push({ role: 'user', content: text }, { role: 'assistant', content: got });
      history = history.slice(-MAX_HISTORY);
    }).catch(function (err) {
      if (err && err.name === 'AbortError') return;
      var code = (err && err.code) || 'unavailable';
      if (got.trim()) return; // réponse partielle déjà affichée
      var msg = code === 'rate_limited' ? t('rate') : code === 'too_long' ? t('toolong') : t('unavailable');
      if (code === 'rate_limited' && err.message) msg = t('rate');
      bubble.innerHTML = msg;
      bubble.parentNode.classList.add('is-error');
      scrollDown();
    }).then(function () {
      busy = false; sendBtn.disabled = false; controller = null;
      if (panel.hidden === false) input.focus();
    });
  }

  function readStream(res, onText) {
    if (!res.body || !res.body.getReader) {
      return res.text().then(function (txt) { parseSSE(txt, onText); });
    }
    var reader = res.body.getReader(), dec = new TextDecoder(), buf = '';
    function pump() {
      return reader.read().then(function (r) {
        if (r.done) { if (buf) parseSSE(buf, onText); return; }
        buf += dec.decode(r.value, { stream: true });
        var cut = buf.lastIndexOf('\n\n');
        if (cut > -1) { parseSSE(buf.slice(0, cut), onText); buf = buf.slice(cut + 2); }
        return pump();
      });
    }
    return pump();
  }
  function parseSSE(txt, onText) {
    txt.split('\n').forEach(function (line) {
      if (line.indexOf('data:') !== 0) return;
      var d = line.slice(5).trim();
      if (!d || d === '[DONE]') return;
      try { var j = JSON.parse(d); if (j.t) onText(j.t); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Interactions ---------- */
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; }
  function openPanel() {
    panel.hidden = false;
    requestAnimationFrame(function () { root.classList.add('is-open'); });
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', t('close'));
    setTimeout(function () { input.focus(); }, 60);
  }
  function closePanel() {
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', t('open'));
    setTimeout(function () { panel.hidden = true; }, 200);
    launcher.focus();
  }
  launcher.addEventListener('click', function () { panel.hidden ? openPanel() : closePanel(); });
  $('.chat-close').addEventListener('click', closePanel);
  $('.chat-clear').addEventListener('click', function () {
    if (controller) controller.abort();
    history = []; busy = false; sendBtn.disabled = false; renderWelcome(); input.focus();
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); }
  });
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) closePanel(); });
  root.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-chat-contact]')) closePanel();
  });

  new MutationObserver(function () { applyLang(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  applyLang();
})();
