/* Widget de chat : « double numérique » de Farès.
   L'URL du backend (Worker Cloudflare) est donnée par l'attribut data-api de la balise <script>.
   Si elle est vide, le widget n'est pas affiché. Aucune donnée n'est stockée dans le navigateur. */
(function () {
  'use strict';
  var script = document.currentScript;
  var API = script && script.getAttribute('data-api') ? script.getAttribute('data-api').trim() : '';
  // Sans API configurée : mode « local » (réponses calculées dans le navigateur à partir du profil).

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
      teaser: 'Posez-moi une question sur le parcours de Farès',
      subLocal: 'Double numérique · basé sur le profil de Farès',
      privacyLocal: 'Aucune donnée n’est envoyée : les réponses sont calculées dans votre navigateur à partir du profil de Farès.',
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
      teaser: 'Ask me about Farès’s background',
      subLocal: 'Digital twin · based on Farès’s profile',
      privacyLocal: 'No data is sent: answers are computed in your browser from Farès’s profile.',
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
    '<div class="chat-teaser" hidden><button type="button" class="chat-teaser-open"><span class="chat-teaser-text"></span></button><button type="button" class="chat-teaser-x" aria-label="×">&times;</button></div>' +
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
    $('.chat-sub').textContent = API ? t('subtitle') : t('subLocal');
    $('.chat-close').setAttribute('aria-label', t('close'));
    $('.chat-close').title = t('close');
    $('.chat-clear').setAttribute('aria-label', t('clear'));
    $('.chat-clear').title = t('clear');
    $('.chat-form label').textContent = t('placeholder');
    input.placeholder = t('placeholder');
    sendBtn.setAttribute('aria-label', t('send'));
    $('.chat-disclaimer').innerHTML = t('disclaimer');
    $('.chat-privacy').textContent = API ? t('privacy') : t('privacyLocal');
    $('.chat-teaser-text').textContent = t('teaser');
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


  /* ---------- Mode local : réponses issues du profil (sans IA, sans réseau) ---------- */
  var C = { phone: '06 36 44 23 46', email: EMAIL, linkedin: LINKEDIN, github: 'https://github.com/Fares-Medjahed', cv: 'https://fares-medjahed.github.io/Portfolio-Medjahed/cv/CV-Fares-Medjahed.pdf' };
  var contactFr = C.email + ' ou LinkedIn (' + C.linkedin + ')';
  var A = {
    hello: { fr: 'Bonjour ! Je suis l’assistant IA de Farès. Je peux vous parler de son parcours, de ses compétences, de ses projets ou de son alternance chez EDF. Que souhaitez-vous savoir ?',
             en: 'Hello! I’m Farès’s AI assistant. I can tell you about his background, skills, projects or his work-study at EDF. What would you like to know?' },
    ai: { fr: 'Je suis un assistant IA qui représente Farès : je réponds à partir des informations qu’il a renseignées (parcours, CV, expériences, projets). Pour un échange direct, contactez-le : ' + C.email + '.',
          en: 'I’m an AI assistant representing Farès: I answer from the information he has provided (background, CV, experience, projects). For a direct conversation, contact him: ' + C.email + '.' },
    parcours: { fr: 'Je suis Farès Medjahed, alternant chez EDF (centrale nucléaire du Bugey) depuis août 2025 et étudiant en mastère MAALSI à CESI École d’ingénieurs. Avant, j’ai fait un BUT Informatique à l’IUT 2 de Grenoble, après un Bac STI2D. J’ai aussi effectué des stages chez Rio Tinto (2024) et Mafelec (2023). Je travaille depuis mes 18 ans, je vise un poste de chef de projet IT ou de développeur full-stack, et je suis ouvert à l’international.',
                en: 'I’m Farès Medjahed, a work-study student at EDF (Bugey nuclear power plant) since August 2025 and a MAALSI Master’s student at CESI engineering school. Before that I did a Bachelor’s in Computer Science at IUT 2 Grenoble, after a STI2D baccalaureate. I also did internships at Rio Tinto (2024) and Mafelec (2023). I’m aiming for an IT project manager or full-stack developer role, and I’m open to working internationally.' },
    formation: { fr: 'Mon parcours : Bac STI2D (spécialité ITEC, lycée de l’Oiselet à Bourgoin-Jallieu, mention Assez Bien), puis BUT Informatique à l’IUT 2 de Grenoble, puis le mastère « Manager en architecture et applications logicielles des systèmes d’information » (MAALSI) à CESI École d’ingénieurs : niveau 7 (RNCP 35620), en alternance, de 2025 à 2027.',
                 en: 'My education: STI2D baccalaureate (ITEC specialty, Lycée de l’Oiselet, Bourgoin-Jallieu, with honours), then a Bachelor’s in Computer Science at IUT 2 Grenoble, then the MAALSI Master’s (Manager in software architecture and information systems applications) at CESI engineering school: level 7 (RNCP 35620), work-study, 2025 to 2027.' },
    edf: { fr: 'Depuis août 2025, je suis alternant chez EDF, à la centrale nucléaire du Bugey, jusqu’en 2027. Ma mission principale : développer une application web de gestion de formulaires (Angular, NestJS, TypeORM, SQL), des réunions de projet et du recueil du besoin jusqu’à la mise en œuvre, avec notamment un module de signature électronique de PDF. J’ai aussi des missions secondaires : nouvelles fonctionnalités, correction de bugs, merge requests et revue de code, export Excel sur une application de diffusion de documents, et administration des serveurs et machines virtuelles du site. Je reste volontairement général : l’environnement est sensible (sécurité, fiabilité, conformité).',
           en: 'Since August 2025 I’ve been on a work-study programme at EDF, at the Bugey nuclear power plant, until 2027. My main mission: developing a web application for managing forms (Angular, NestJS, TypeORM, SQL), from project meetings and requirements gathering to implementation, including an electronic PDF signature module. I also have secondary missions: new features, bug fixes, merge requests and code review, an Excel export on an existing document-distribution application, and administration of the site’s servers and virtual machines. I keep this deliberately general: the environment is sensitive (security, reliability, compliance).' },
    confidential: { fr: 'Pour des raisons de confidentialité, je ne détaille pas l’environnement interne d’EDF (applications, serveurs, architecture). Je peux seulement décrire mes missions de façon générale : développement d’une application web de gestion de formulaires, merge requests et revue de code, et administration des serveurs et machines virtuelles du site.',
                    en: 'For confidentiality reasons, I don’t go into EDF’s internal environment (applications, servers, architecture). I can only describe my missions in general terms: developing a web application for managing forms, merge requests and code review, and administering the site’s servers and virtual machines.' },
    rio: { fr: 'En 2024, j’ai fait un stage chez Rio Tinto. J’ai optimisé l’utilisation du CRM Dynamics 365 (nouvelles fonctionnalités, correction de bugs, mise à jour d’éléments obsolètes) et créé des rapports Power BI pour les chefs de projet afin d’automatiser le suivi financier des projets. Résultat : des rapports plus précis et plus rapides à produire.',
           en: 'In 2024 I did an internship at Rio Tinto. I optimised the use of the Dynamics 365 CRM (new features, bug fixes, updating obsolete elements) and built Power BI reports for project managers to automate project financial tracking. Result: more accurate reports, faster to produce.' },
    mafelec: { fr: 'En 2023, j’ai fait un stage chez Mafelec, entreprise d’électronique grenobloise fondée en 1947. Un dysfonctionnement logiciel empêchait l’export de rapports business depuis l’ERP IFS : j’ai écrit des requêtes PL/SQL pour extraire les données et un script Python (pandas) qui les exporte en Excel, planifié chaque jour ou chaque semaine. Plusieurs rapports ont été exportés avec succès.',
               en: 'In 2023 I did an internship at Mafelec, an electronics company founded in Grenoble in 1947. A software malfunction prevented business reports from being exported from the IFS ERP: I wrote PL/SQL queries to extract the data and a Python (pandas) script exporting it to Excel, scheduled daily or weekly. Several reports were exported successfully.' },
    stage: { fr: 'J’ai fait deux stages : chez Mafelec en 2023 (export automatique de rapports depuis l’ERP IFS avec PL/SQL et Python) et chez Rio Tinto en 2024 (CRM Dynamics 365 et rapports Power BI). Dites-moi lequel vous intéresse pour plus de détails.',
             en: 'I did two internships: at Mafelec in 2023 (automatic report export from the IFS ERP with PL/SQL and Python) and at Rio Tinto in 2024 (Dynamics 365 CRM and Power BI reports). Tell me which one interests you for more details.' },
    projets: { fr: 'J’ai réalisé plusieurs projets académiques : Le Dahu (application mobile et site web avec forum pour une association étudiante, équipe de 8), InstruMenthol (plateforme d’enchères d’instrumentales avec Symfony, équipe de 6), R-JUMP 3000 (jeu 2D en Python avec Pygame, équipe de 4), un Démineur en Flutter et un premier site web d’entreprise en trinôme. Vous les trouverez dans la section « Projets » du portfolio.',
               en: 'I’ve done several academic projects: Le Dahu (mobile app and website with a forum for a student association, team of 8), InstruMenthol (an instrumental auction platform built with Symfony, team of 6), R-JUMP 3000 (a 2D game in Python with Pygame, team of 4), a Minesweeper in Flutter and a first company website in a trio. You’ll find them in the “Projects” section of the portfolio.' },
    php: { fr: 'PHP fait partie de mes compétences, notamment avec Symfony, que j’ai utilisé sur des projets académiques comme Le Dahu et InstruMenthol. Je travaille aussi avec Angular, NestJS, TypeORM, Python et SQL. Le détail est dans la section « À propos ».',
           en: 'PHP is part of my skills, notably with Symfony, which I used on academic projects such as Le Dahu and InstruMenthol. I also work with Angular, NestJS, TypeORM, Python and SQL. Details are in the “About” section.' },
    competences: { fr: 'Côté technique : Angular, NestJS, TypeORM, Node.js, PHP / Symfony, Python, Java, C / C++, SQL / PL-SQL et NoSQL, HTML / CSS / JavaScript, Bootstrap et Flutter. Côté outils : Jira, Git et GitLab (merge requests, revue de code), Linux, PM2, Power BI et Dynamics 365. J’administre aussi des serveurs Linux et des machines virtuelles.',
                   en: 'Technical: Angular, NestJS, TypeORM, Node.js, PHP / Symfony, Python, Java, C / C++, SQL / PL-SQL and NoSQL, HTML / CSS / JavaScript, Bootstrap and Flutter. Tools: Jira, Git and GitLab (merge requests, code review), Linux, PM2, Power BI and Dynamics 365. I also administer Linux servers and virtual machines.' },
    gestion: { fr: 'Je développe un profil de chef de projet : réunions de projet et recueil du besoin auprès des utilisateurs, planification et suivi, coordination des parties prenantes, communication et reporting, en intégrant la sécurité et la conformité dès le cadrage. Mon mastère MAALSI me forme aussi au management de projets et d’équipes.',
              en: 'I’m building a project-manager profile: project meetings and requirements gathering with users, planning and tracking, stakeholder coordination, communication and reporting, building security and compliance in from the scoping phase. My MAALSI Master’s also trains me in project and team management.' },
    objectifs: { fr: 'Mon objectif est d’exercer comme chef de projet IT ou développeur full-stack, puis d’évoluer vers le management d’équipes. Je suis aussi ouvert à une expérience à l’international.',
                 en: 'My goal is to work as an IT project manager or full-stack developer, then move into team management. I’m also open to an international experience.' },
    international: { fr: 'Oui, je suis ouvert à l’international : une mission ou un poste à l’étranger est tout à fait envisageable. Pour en discuter, contactez-moi : ' + C.email + '.',
                     en: 'Yes, I’m open to working internationally: an assignment or a position abroad is entirely possible. To discuss it, contact me: ' + C.email + '.' },
    dispo: { fr: 'Je suis en alternance chez EDF d’août 2025 jusqu’en 2027, dans le cadre de mon mastère. Pour toute autre question de disponibilité, le mieux est de me contacter directement : ' + contactFr + '.',
             en: 'I’m on a work-study programme at EDF from August 2025 until 2027, as part of my Master’s. For any other availability question, the best is to contact me directly: ' + C.email + ' or LinkedIn (' + C.linkedin + ').' },
    contact: { fr: 'Vous pouvez me contacter par email : ' + C.email + ' ou sur LinkedIn : ' + C.linkedin + '. Mon GitHub : ' + C.github + '. Mon CV est téléchargeable depuis le portfolio.',
               en: 'You can reach me by email: ' + C.email + ' or on LinkedIn: ' + C.linkedin + '. My GitHub: ' + C.github + '. My CV can be downloaded from the portfolio.' },
    cv: { fr: 'Mon CV est téléchargeable ici : ' + C.cv + ' (PDF). Il reprend mon parcours, mes expériences, ma formation et mes compétences.',
          en: 'My CV can be downloaded here: ' + C.cv + ' (PDF). It covers my background, experience, education and skills.' },
    interets: { fr: 'En dehors du travail, j’aime le sport et les voyages, qui nourrissent mon ouverture sur le monde. J’apprécie aussi l’automobile, les jeux vidéo et le piano.',
                en: 'Outside work I enjoy sport and travel, which fuel my openness to the world. I also like cars, video games and the piano.' },
    langues: { fr: 'Je peux répondre en français ou en anglais. Pour le niveau exact de Farès dans chaque langue, le mieux est de le contacter directement : ' + C.email + '.',
               en: 'I can answer in French or English. For Farès’s exact level in each language, the best is to contact him directly: ' + C.email + '.' },
    qualites: { fr: 'Mes principales qualités : la bonne humeur, l’esprit d’équipe et le calme. J’aime travailler avec les autres, garder une ambiance positive et rester posé quand il y a de la pression. J’ajoute l’autonomie, la curiosité et la rigueur, que mes stages et mon alternance m’ont permis de développer.',
                en: 'My main qualities: a positive attitude, team spirit and calm. I enjoy working with others, keeping a good atmosphere and staying composed under pressure. I would add autonomy, curiosity and rigour, which my internships and work-study have helped me develop.' },
    defauts: { fr: 'Mon principal défaut : je suis perfectionniste, je peux passer trop de temps sur un détail. Je m’en méfie en priorisant, en fixant des échéances et en demandant l’avis de l’équipe avant de trop peaufiner.',
               en: 'My main weakness: I’m a perfectionist and can spend too long on a detail. I manage it by prioritising, setting deadlines and asking the team for input before over-polishing.' },
    equipe: { fr: 'Je me sens à l’aise en équipe : bonne humeur, écoute et calme, même sous pression. J’ai travaillé en équipe de 3, 4, 6 et 8 personnes sur mes projets académiques, et en alternance avec des utilisateurs métier et des collègues développeurs (réunions de projet, merge requests, revue de code).',
              en: 'I’m comfortable in a team: positive, attentive and calm, even under pressure. I’ve worked in teams of 3, 4, 6 and 8 on my academic projects, and during my work-study with business users and fellow developers (project meetings, merge requests, code review).' },
    localisation: { fr: 'J’habite à L’Isle-d’Abeau (Isère) et je suis véhiculé, ce qui facilite mes déplacements. Je suis aussi ouvert à l’international.',
                    en: 'I live in L’Isle-d’Abeau (Isère, France) and I have my own vehicle, which makes getting around easy. I’m also open to working internationally.' },
    telephone: { fr: 'Vous pouvez m’appeler au ' + C.phone + ', ou m’écrire par email : ' + C.email + ' ou sur LinkedIn : ' + C.linkedin + '.',
                 en: 'You can call me on ' + C.phone + ', or write to me by email: ' + C.email + ' or on LinkedIn: ' + C.linkedin + '.' },
    expPro: { fr: 'Je travaille depuis mes 18 ans : je mène mes études en parallèle d’expériences professionnelles, avec un job étudiant chez Décathlon (2022), des stages chez Mafelec (2023) et Rio Tinto (2024), puis mon alternance chez EDF depuis août 2025. J’ai donc l’habitude du monde professionnel et des responsabilités.',
              en: 'I’ve been working since I was 18: I study alongside professional experience, with a student job at Decathlon (2022), internships at Mafelec (2023) and Rio Tinto (2024), then my work-study at EDF since August 2025. I’m used to the professional world and to taking responsibility.' },
    recruter: { fr: 'Parce que je combine trois profils : développeur full-stack, administrateur systèmes et gestion de projet, dans un environnement exigeant (nucléaire) où sécurité et fiabilité comptent. Je travaille depuis mes 18 ans, je suis autonome, calme et de bonne humeur en équipe, et je vise un poste de chef de projet IT.',
                en: 'Because I combine three profiles: full-stack developer, systems administrator and project management, in a demanding environment (nuclear) where security and reliability matter. I’ve worked since I was 18, I’m autonomous, calm and positive in a team, and I’m aiming for an IT project manager role.' },
    pourquoiEdf: { fr: 'Mon alternance chez EDF me place dans un environnement exigeant en sécurité, fiabilité et conformité, sur des projets utilisés par de vrais utilisateurs, déployés d’abord sur le site avec une trajectoire d’extension nationale. J’y développe à la fois mes compétences techniques et ma gestion de projet : réunions, recueil du besoin, coordination.',
                    en: 'My work-study at EDF puts me in an environment demanding on security, reliability and compliance, on projects used by real users, deployed first on site with a path to national rollout. I develop both my technical skills and my project management there: meetings, requirements gathering, coordination.' },
    cinqAns: { fr: 'À moyen terme, je me vois chef de projet IT, puis évoluer vers le management d’équipes. Je reste ouvert à une expérience à l’international.',
               en: 'In the medium term I see myself as an IT project manager, then moving into team management. I remain open to an international experience.' },
    refus: { fr: 'Je ne communique pas de salaire ni de données personnelles ici. Pour en discuter, contactez-moi directement : ' + contactFr + '.',
             en: 'I don’t share salary or personal data here. To discuss it, contact me directly: ' + C.email + ' or LinkedIn (' + C.linkedin + ').' },
    horsSujet: { fr: 'Je ne peux répondre qu’aux questions sur mon profil : parcours, compétences, projets, formation, alternance ou objectifs. Que souhaitez-vous savoir ?',
                 en: 'I can only answer questions about my profile: background, skills, projects, education, work-study or goals. What would you like to know?' },
    injection: { fr: 'Je ne peux pas faire cela. Posez-moi plutôt vos questions sur le parcours, les compétences ou les projets de Farès.',
                 en: 'I can’t do that. Feel free to ask about Farès’s background, skills or projects.' },
    inconnu: { fr: 'Je n’ai pas cette information, le mieux est de me contacter directement : ' + contactFr + '.',
               en: 'I don’t have that information, the best is to contact me directly: ' + C.email + ' or LinkedIn (' + C.linkedin + ').' }
  };
  var RULES = [
    ['refus', /salaire|remuneration|pretention|salary|\bpay\b|wage|adresse(?!\s*(e-?mail|mail|email))|home address|\bage\b|how old|quel age/],
    ['telephone', /telephone|\btel\b|numero|phone|appeler|call you|portable|mobile phone/],
    ['injection', /(ignore|oublie|disregard|forget).{0,40}(instruction|consigne|regle|rule|prompt)|prompt systeme|system prompt|tu es maintenant|you are now|jailbreak|mode developpeur|developer mode/],
    ['confidential', /(serveur|server|interne|internal|infrastructure|architecture|code source|source code|nom des? appli).*(edf|bugey|nucle|nuclear|alternance|work-study)|(edf|bugey|nucle|nuclear).*(serveur|server|interne|internal|infrastructure|architecture|code source|source code)/],
    ['ai', /(es[- ]tu|etes[- ]vous|are you).{0,25}(humain|human|robot|\bia\b|\bai\b|bot|vrai|real)|qui t.a (cree|fait)/],
    ['horsSujet', /meteo|weather|recette|cuisine|football|capitale|president|politique|election|bitcoin|blague|joke|ecris.{0,25}(fonction|code|script|programme)|write.{0,25}(function|code|script|program)|tri en python|sorting|traduis|translate|\bmath/],
    ['hello', /^(bonjour|salut|hello|hi|hey|coucou|bonsoir)\b/],
    ['qualites', /qualite|point(s)? fort|\bforces?\b|strength|soft skill|savoir[- ]etre|bonne humeur|caractere|personnalite|personality|best qualities|good at/],
    ['defauts', /defaut|point(s)? faible|faiblesse|weakness|flaw|axe d.amelioration|area (for|to) improve|worst/],
    ['recruter', /pourquoi (te|vous|devrait|faut).{0,20}(recrut|embauch|choisir|prendre)|why (should|would).{0,20}(hire|choose|recruit)|valeur ajoutee|ce qui te distingue|what makes you (different|special)|why you/],
    ['pourquoiEdf', /pourquoi.{0,15}(edf|nucle)|why.{0,10}(edf|nuclear)|motivation.{0,20}edf/],
    ['cinqAns', /dans (5|cinq) ans|where do you see yourself|in (5|five) years|evolution|evoluer|plan de carriere/],
    ['expPro', /18 ans|age de 18|experience pro|annees d.experience|years of experience|premier job|first job|depuis quand (tu )?travaill|how long.{0,15}work/],
    ['localisation', /vehicul|permis|voiture|habite|ou (vis|resid)|ville|localis|where (do you live|are you (based|located))|\blives?\b|reside|commut|trajet|deplac|isle/],
    ['equipe', /equipe|\bteam|collabor|travail en groupe|teamwork|ambiance|collegue|colleague/],
    ['cv', /\bcv\b|curriculum|resume\b.*(pdf|telecharg)|download.*(cv|resume)/],
    ['contact', /contact|e-?mail|linkedin|github|joindre|reach (you|him)|get in touch|coordonnee/],
    ['dispo', /disponib|available|availability|embauch|recrut|start date|date de debut|\bhire\b|libre/],
    ['international', /international|etranger|abroad|mobilit|expat|overseas/],
    ['langues', /anglais|english|langue|language|francais|french|bilingue|bilingual/],
    ['rio', /rio ?tinto|power ?bi|dynamics/],
    ['mafelec', /mafelec|\bifs\b|\berp\b/],
    ['stage', /stage|internship|intern\b/],
    ['edf', /\bedf\b|bugey|nucleaire|nuclear|alternance|work-study|apprentice|formulaire|signature|demandoc|diffusion/],
    ['formation', /formation|etude|diplome|master|mastere|maalsi|cesi|\bbut\b|\biut\b|\bbac\b|sti2d|education|degree|school|univers/],
    ['gestion', /gestion de projet|project management|chef de projet|project manager|\bmanage|agile|scrum|kanban|leadership|parties prenantes|stakeholder/],
    ['projets', /projet|project|dahu|instru|demineur|r-jump|pygame|portfolio|realis/],
    ['php', /\bphp\b|symfony/],
    ['competences', /competence|skill|techno|langage|stack|angular|nestjs|nest\b|typeorm|sql|python|java|linux|jira|\bgit|outil|tool|framework|\bc\+\+|node/],
    ['objectifs', /objectif|\bgoal|ambition|motivation|pourquoi|\bwhy\b|projet pro|carriere|career|futur|\bfuture\b|\bvise\b|looking for|recherch/],
    ['interets', /interet|hobby|hobbies|loisir|sport|voyage|piano|jeux|passion|travel|interests|musique/],
    ['parcours', /parcours|background|profil|presente|de toi|de vous|about you|introduce|qui es|qui etes|who are|about you|about yourself|cursus|experience|racont|tell me/]
  ];
  function strip(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function isEnglish(q) {
    var en = /\b(the|you|your|what|are|do|does|how|tell|about|where|when|which|can|have|skills|projects|experience|available|speak)\b/i.test(q);
    var fr = /\b(quel|quelle|quels|tes|ton|ta|est|vous|que|des|les|une|comment|parle|moi|avez|etes|sont)\b/i.test(strip(q));
    return en && !fr ? true : (fr && !en ? false : lang() === 'en');
  }
  function localAnswer(q) {
    var n = strip(q), l = isEnglish(q) ? 'en' : 'fr', key = 'inconnu';
    for (var i = 0; i < RULES.length; i++) { if (RULES[i][1].test(n)) { key = RULES[i][0]; break; } }
    if (key === 'parcours' && /\bphp\b/.test(n)) key = 'php';
    return A[key][l];
  }
  function localReply(text, bubble, done) {
    var answer = localAnswer(text), i = 0, got = '';
    setTimeout(function () {
      (function step() {
        got = answer.slice(0, i += 6);
        bubble.innerHTML = format(got);
        scrollDown();
        if (i < answer.length) return setTimeout(step, 18);
        bubble.innerHTML = format(answer);
        history.push({ role: 'user', content: text }, { role: 'assistant', content: answer });
        history = history.slice(-MAX_HISTORY);
        done();
      })();
    }, 450);
  }

  /* ---------- Envoi ---------- */
  function finish() {
    busy = false; sendBtn.disabled = false; controller = null;
    if (panel.hidden === false) input.focus();
  }
  function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    if (text.length > MAX_CHARS) { addMsg('bot', t('toolong')); return; }
    busy = true; sendBtn.disabled = true;
    sugg.innerHTML = '';
    addMsg('user', text);
    input.value = ''; autosize();
    var bubble = addMsg('bot', typingDots(), true);
    if (!API) { localReply(text, bubble, finish); return; }   // mode local

    var body = history.slice(-MAX_HISTORY).concat([{ role: 'user', content: text }]);
    var got = '', fallback = false;
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
      if (code === 'unavailable' || code === 'server_error') { fallback = true; return; } // IA indisponible : réponse locale
      var msg = code === 'rate_limited' ? (err.message && /quotidienne|daily/i.test(err.message) ? t('day') : t('rate')) : code === 'too_long' ? t('toolong') : t('unavailable');
      bubble.innerHTML = msg;
      bubble.parentNode.classList.add('is-error');
      scrollDown();
    }).then(function () {
      if (fallback) return localReply(text, bubble, finish);
      finish();
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
    if (teaser) hideTeaser();
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

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-open-chat]');
    if (b) { e.preventDefault(); if (panel.hidden) openPanel(); else input.focus(); }
  });

  /* Bulle d'invitation à côté du bouton (une fois par session) */
  var teaser = $('.chat-teaser');
  function hideTeaser() { teaser.hidden = true; try { sessionStorage.setItem('chatTeaser', '1'); } catch (e) {} }
  var seen = false; try { seen = sessionStorage.getItem('chatTeaser') === '1'; } catch (e) {}
  if (!seen) setTimeout(function () { if (panel.hidden) teaser.hidden = false; }, 3500);
  $('.chat-teaser-open').addEventListener('click', function () { hideTeaser(); openPanel(); });
  $('.chat-teaser-x').addEventListener('click', hideTeaser);

  new MutationObserver(function () { applyLang(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  applyLang();
})();
