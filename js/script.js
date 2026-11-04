document.documentElement.classList.add('js');

/* =====================================================================
   TRADUCTIONS (le français est lu directement dans le HTML)
   ===================================================================== */
const EN = {
  skip: 'Skip to content',
  nav_home: 'Home', nav_about: 'About', nav_edf: 'EDF', nav_path: 'Background', nav_projects: 'Projects', nav_contact: 'Contact',
  badge_intl: 'Open to international',
  badge: 'Work-study at EDF · MAALSI Master, CESI',
  hero_p: 'Since August 2025, I have been on a work-study programme at EDF (Bugey nuclear power plant), leading application projects from requirements gathering to deployment. I am completing a Master’s in software architecture and information systems and I am looking for a role as an IT project manager or full-stack developer.',
  btn_cv: 'Download my CV', btn_linkedin: 'My LinkedIn', btn_edf: 'My EDF experience',
  float_a: 'Security & reliability', float_b: 'IT project management', float_c: 'Full-stack developer',
  about_kicker: 'Who am I?', about_title: 'About me',
  about_h3: 'A hybrid profile: technical enough to challenge, project-minded enough to deliver',
  about_p1: 'A student at CESI engineering school (MAALSI Master’s, level 7) after a Bachelor’s in Computer Science, I am building a profile at the crossroads of development, systems and project management: I understand the solutions I manage because I have also built and deployed them.',
  about_p2: 'At EDF, I learned to work with business users, vendors and security teams, with one requirement: what is delivered must be reliable, safe and maintainable.',
  about_p3: 'My goal: to work as an IT project manager or full-stack developer, then move into team management. <strong>I am open to working internationally</strong>: an assignment or a position abroad is entirely possible.',
  about_p4: 'Outside work, <strong>sport</strong> and <strong>travel</strong> keep me balanced and fuel my openness to other cultures. I also enjoy cars, video games and piano.',
  i1_l: 'Education', i1_v: 'MAALSI Master’s, CESI',
  i2_l: 'Current role', i2_v: 'Work-study at EDF (2025–2027)',
  i3_l: 'Goal', i3_v: 'IT project manager / Full-stack',
  i4_l: 'Mobility', i4_v: 'Open to international',
  skills_h: 'Skills', int_h: 'Interests',
  int1: 'Sport', int2: 'Travel', int3: 'Cars', int4: 'Video games', int5: 'Piano',
  edf_kicker: 'Main experience', edf_title: 'Work-study at EDF',
  edf_date: 'Since August 2025 · contract until 2027',
  edf_h3: 'Bugey nuclear power plant',
  edf_intro: 'Within the site’s IT team, I lead application projects that are first deployed on site, with a path to national rollout. I work as a developer, systems administrator and project manager.',
  edf_proj_h: 'Main mission', edf_sec_h: 'Secondary missions', cv_l: 'Résumé', cv_v: 'Download my CV (PDF)',
  chip1: 'Security', chip2: 'Reliability', chip3: 'Compliance',
  path_kicker: 'My background', path_title: 'Experience & education', edu_title: 'Education',
  proj_kicker: 'What I built', proj_title: 'Academic projects',
  contact_kicker: 'Let’s talk', contact_title: 'Contact me',
  loc_l: 'Location', loc_v: 'France · open to international',
  send: 'Send',
  more: 'Learn more',
  lbl_context: 'Context', lbl_role: 'My role', lbl_actions: 'Actions', lbl_results: 'Results',
  ph_name: 'Your name', ph_email: 'Your email', ph_subject: 'Subject', ph_msg: 'Your message'
};

const FR = {};
document.querySelectorAll('[data-i18n]').forEach(n => { FR[n.dataset.i18n] = n.innerHTML; });
FR.more = 'En savoir plus';
FR.lbl_context = 'Contexte'; FR.lbl_role = 'Mon rôle'; FR.lbl_actions = 'Actions'; FR.lbl_results = 'Résultats';
document.querySelectorAll('[data-i18n-ph]').forEach(n => { FR[n.dataset.i18nPh] = n.getAttribute('placeholder'); });

let lang = 'fr';
try { const s = localStorage.getItem('lang'); if (s === 'en' || s === 'fr') lang = s; } catch (e) {}
const tr = key => (lang === 'en' ? EN[key] : FR[key]) ?? FR[key] ?? key;
const L = obj => (obj == null ? '' : typeof obj === 'string' ? obj : (obj[lang] ?? obj.fr));

/* =====================================================================
   DONNÉES
   Pour ajouter des chiffres : remplissez les listes "kpis" (elles sont
   masquées tant qu'elles sont vides).
   ===================================================================== */
const skills = [
  { title: { fr: 'Gestion de projet', en: 'Project management' },
    items: [
      { fr: 'Recueil des besoins', en: 'Requirements gathering' },
      { fr: 'Planification & suivi', en: 'Planning & tracking' },
      { fr: 'Coordination des parties prenantes', en: 'Stakeholder coordination' },
      { fr: 'Communication & reporting', en: 'Communication & reporting' },
      { fr: 'Sécurité & conformité', en: 'Security & compliance' },
      { fr: 'Gestion des risques', en: 'Risk management' }
    ] },
  { title: { fr: 'Technique', en: 'Technical' },
    items: ['Angular', 'NestJS', 'TypeORM', 'Node.js', 'PHP / Symfony', 'SQL / PL-SQL', 'Python',
      { fr: 'Administration Linux', en: 'Linux administration' },
      { fr: 'Administration de VM', en: 'VM administration' }, 'Java', 'C / C++'] },
  { title: { fr: 'Outils & gestion de projet', en: 'Tools & project management' },
    items: ['Jira', 'GitLab', 'Git', { fr: 'Merge requests', en: 'Merge requests' }, { fr: 'Revue de code', en: 'Code review' }, 'PM2', 'Power BI', 'Dynamics 365', 'Bootstrap', 'Flutter'] }
];

const pillars = [
  { icon: 'fa-tasks',
    title: { fr: 'Gestion de projet', en: 'Project management' },
    items: [
      { fr: 'Réunions de projet et recueil du besoin auprès des utilisateurs', en: 'Project meetings and gathering user requirements' },
      { fr: 'Planification et suivi de l’avancement', en: 'Planning and progress tracking' },
      { fr: 'Communication avec les équipes et présentation aux responsables', en: 'Communicating with teams and presenting to managers' },
      { fr: 'Prise en compte de la sécurité dès le cadrage', en: 'Building security in from the scoping phase' }
    ], kpis: [] },
  { icon: 'fa-code',
    title: { fr: 'Développement', en: 'Development' },
    items: [
      { fr: 'Applications web full-stack (Angular, NestJS, TypeORM, SQL, PHP)', en: 'Full-stack web applications (Angular, NestJS, TypeORM, SQL, PHP)' },
      { fr: 'Correction de bugs, évolutions et finitions d’interface', en: 'Bug fixing, enhancements and UI polish' },
      { fr: 'Merge requests, lecture et revue de code sous GitLab', en: 'Merge requests, code reading and review on GitLab' }
    ], kpis: [] },
  { icon: 'fa-server',
    title: { fr: 'Administration systèmes', en: 'Systems administration' },
    items: [
      { fr: 'Administration des serveurs et machines virtuelles du site', en: 'Administering the site’s servers and virtual machines' },
      { fr: 'Déploiement et supervision des services (PM2, démons Node.js)', en: 'Deploying and monitoring services (PM2, Node.js daemons)' },
      { fr: 'Gestion des droits d’accès et dépannage', en: 'Access-rights management and troubleshooting' }
    ], kpis: [] }
];

const cases = [
  { title: { fr: 'Application de gestion de formulaires', en: 'Forms management application' },
    tags: ['Angular', 'NestJS', 'TypeORM', 'SQL'],
    context: { fr: 'Application web de gestion de formulaires utilisée sur le site. Coder cette application a été ma mission principale en alternance.', en: 'Web application for managing forms, used on site. Coding this application was my main work-study mission.' },
    role: { fr: 'Développeur de l’application, de la réunion de cadrage à la mise en œuvre, en lien avec les utilisateurs.', en: 'Developer of the application, from the scoping meeting to implementation, working with the users.' },
    actions: [
      { fr: 'Participation aux réunions de projet et recueil du besoin auprès des utilisateurs', en: 'Took part in project meetings and gathered user requirements' },
      { fr: 'Développement des fonctionnalités de l’application (Angular, NestJS, TypeORM, SQL)', en: 'Developed the application’s features (Angular, NestJS, TypeORM, SQL)' },
      { fr: 'Module de signature électronique de documents PDF : PoC, audit, puis définition d’un nouveau workflow', en: 'Electronic signature module for PDF documents: proof of concept, audit, then definition of a new workflow' },
      { fr: 'Finitions de l’interface utilisateur', en: 'Polished the user interface' }
    ],
    results: [
      { fr: 'Preuve de concept de la signature électronique validée', en: 'Electronic signature proof of concept validated' },
      { fr: 'Nouveau workflow de signature défini', en: 'New signature workflow defined' }
    ], kpis: [] }
];

const casesSecondary = [
  { title: { fr: 'Diffusion documentaire', en: 'Document distribution' },
    tags: ['GitLab', 'Excel'],
    context: { fr: 'Application de diffusion de documents déjà existante, dont le dépôt GitLab n’était pas organisé.', en: 'Existing document distribution application whose GitLab repository was not well organised.' },
    role: { fr: 'Développeur.', en: 'Developer.' },
    actions: [
      { fr: 'Ajout d’une fonctionnalité d’export Excel', en: 'Added an Excel export feature' },
      { fr: 'Remise au propre du dépôt GitLab', en: 'Cleaned up and reorganised the GitLab repository' }
    ],
    results: [
      { fr: 'Nouvelle fonctionnalité d’export disponible', en: 'New export feature available' },
      { fr: 'Dépôt GitLab propre et structuré', en: 'Clean, well-structured GitLab repository' }
    ], kpis: [] },
  { title: { fr: 'Évolutions et qualité du code', en: 'Enhancements and code quality' },
    tags: ['GitLab', 'Merge requests'],
    context: { fr: 'Contributions régulières au code des applications du site.', en: 'Regular contributions to the code of the site’s applications.' },
    role: { fr: 'Développeur, au sein de l’équipe.', en: 'Developer, within the team.' },
    actions: [
      { fr: 'Implémentation de nouvelles fonctionnalités', en: 'Implemented new features' },
      { fr: 'Correction de bugs', en: 'Fixed bugs' },
      { fr: 'Merge requests, lecture et revue de code', en: 'Merge requests, code reading and review' }
    ],
    results: [
      { fr: 'Code partagé et relu dans un cadre collaboratif', en: 'Code shared and reviewed in a collaborative workflow' }
    ], kpis: [] },
  { title: { fr: 'Administration des serveurs et VM du site', en: 'Site server and VM administration' },
    tags: ['Linux', 'PM2', 'Node.js'],
    context: { fr: 'Environnement hébergeant l’ensemble des applications du site, dont une application fournie par un prestataire externe.', en: 'Environment hosting all of the site’s applications, including one supplied by an external vendor.' },
    role: { fr: 'Administrateur des serveurs et des machines virtuelles (infrastructure uniquement, pas le code de l’application du prestataire).', en: 'Administrator of the servers and virtual machines (infrastructure only, not the vendor application’s code).' },
    actions: [
      { fr: 'Déploiement des applications et démarrage des services (PM2, démons Node.js)', en: 'Deployed applications and started services (PM2, Node.js daemons)' },
      { fr: 'Gestion des droits d’accès', en: 'Managed access rights' },
      { fr: 'Dépannage des incidents', en: 'Troubleshot incidents' }
    ],
    results: [
      { fr: 'Continuité de service des applications du site', en: 'Service continuity for the site’s applications' }
    ], kpis: [] }
];

const experiences = [
  {
    date: { fr: '2024', en: '2024' },
    title: { fr: 'Stage chez Rio Tinto', en: 'Internship at Rio Tinto' },
    place: 'Rio Tinto',
    thumb: 'images/riotinto.jpg',
    summary: { fr: 'Optimisation du CRM Dynamics 365 et automatisation du suivi financier des projets avec Power BI.', en: 'Optimised the Dynamics 365 CRM and automated project financial tracking with Power BI.' },
    images: ['images/riotinto.jpg', 'images/powerbi.jpg'],
    sections: [
      { h: { fr: 'Contexte', en: 'Context' },
        p: { fr: 'Stage au sein de Rio Tinto, groupe minier mondial, auprès des équipes projets.', en: 'Internship at Rio Tinto, a global mining group, working with the project teams.' } },
      { h: { fr: 'Missions', en: 'Missions' },
        ul: [
          { fr: 'Optimiser l’utilisation du CRM Dynamics 365 : nouvelles fonctionnalités, correction de bugs, mise à jour des éléments obsolètes.', en: 'Optimise the use of the Dynamics 365 CRM: new features, bug fixes, updating obsolete elements.' },
          { fr: 'Créer des rapports Power BI pour les chefs de projet afin d’automatiser le suivi financier des projets.', en: 'Build Power BI reports for project managers to automate the financial tracking of projects.' }
        ] },
      { h: { fr: 'Résultats', en: 'Results' },
        ul: [
          { fr: 'Suivi financier des projets automatisé', en: 'Automated project financial tracking' },
          { fr: 'Rapports plus précis et plus rapides à produire', en: 'More accurate reports, faster to produce' }
        ] }
    ],
    tags: ['Power BI', 'Dynamics 365', 'Business Intelligence']
  },
  {
    date: { fr: '2023', en: '2023' },
    title: { fr: 'Stage chez Mafelec', en: 'Internship at Mafelec' },
    place: { fr: 'Mafelec, Grenoble', en: 'Mafelec, Grenoble' },
    thumb: 'images/portfolio/mafelec_1.jpg',
    summary: { fr: 'Solution d’export automatique de rapports business depuis l’ERP IFS : PL/SQL et scripts Python.', en: 'Automatic business-report export solution from the IFS ERP: PL/SQL and Python scripts.' },
    images: ['images/portfolio/mafelec_1.jpg'],
    sections: [
      { h: { fr: 'Contexte', en: 'Context' },
        p: { fr: 'Mafelec est une entreprise d’électronique grenobloise fondée en 1947, active dans le secteur industriel. Un dysfonctionnement logiciel empêchait l’export des rapports business.', en: 'Mafelec is an electronics company founded in Grenoble in 1947, active in the industrial sector. A software malfunction prevented business reports from being exported.' } },
      { h: { fr: 'Mission', en: 'Mission' },
        p: { fr: 'Permettre l’export des rapports directement sur les postes des utilisateurs.', en: 'Enable reports to be exported directly to users’ workstations.' } },
      { h: { fr: 'Actions', en: 'Actions' },
        ul: [
          { fr: 'Analyse des rapports et des données dans l’ERP IFS', en: 'Analysed the reports and data in the IFS ERP' },
          { fr: 'Écriture de requêtes PL/SQL pour extraire les données', en: 'Wrote PL/SQL queries to extract the data' },
          { fr: 'Script Python (pandas) exportant les données en Excel, planifié chaque jour ou chaque semaine', en: 'Python (pandas) script exporting data to Excel, scheduled daily or weekly' }
        ] },
      { h: { fr: 'Résultats', en: 'Results' },
        ul: [
          { fr: 'Plusieurs rapports exportés avec succès', en: 'Several reports exported successfully' },
          { fr: 'Précision, rigueur et confiance en soi renforcées', en: 'Strengthened accuracy, rigour and self-confidence' }
        ] }
    ],
    tags: ['SQL', 'PL/SQL', 'Python', 'pandas', 'ERP IFS']
  },
  {
    date: { fr: '2022', en: '2022' },
    title: { fr: 'Job étudiant', en: 'Student job' },
    place: 'Décathlon',
    summary: { fr: 'Premier contact avec le monde professionnel : un mois au sein de l’équipe Décathlon.', en: 'First contact with the working world: one month with the Decathlon team.' },
    images: [], sections: [], tags: []
  }
];

const education = [
  { date: { fr: '2025 – 2027', en: '2025 – 2027' },
    title: { fr: 'Mastère Manager en architecture et applications logicielles des systèmes d’information (MAALSI)', en: 'Master’s – Manager in software architecture and information systems applications (MAALSI)' },
    place: 'CESI École d’ingénieurs',
    text: { fr: 'Formation de niveau 7 (RNCP 35620), en alternance sur 2 ans : architecture logicielle, systèmes d’information, management de projets et d’équipes.', en: 'Level 7 programme (RNCP 35620), 2-year work-study: software architecture, information systems, project and team management.' } },
  { date: { fr: '2021 – 2024', en: '2021 – 2024' },
    title: 'BUT Informatique', place: { fr: 'IUT 2 de Grenoble', en: 'IUT 2 Grenoble' },
    text: { fr: 'Développement web et mobile, bases de données, programmation orientée objet, gestion de projet et travail en équipe.', en: 'Web and mobile development, databases, object-oriented programming, project management and teamwork.' } },
  { date: { fr: '2020 – 2021', en: '2020 – 2021' },
    title: { fr: 'Bac STI2D, spécialité ITEC', en: 'STI2D Baccalaureate, ITEC specialty' },
    place: { fr: 'Lycée de l’Oiselet, Bourgoin-Jallieu', en: 'Lycée de l’Oiselet, Bourgoin-Jallieu' },
    text: { fr: 'Baccalauréat technologique obtenu avec mention Assez Bien.', en: 'Technological baccalaureate with honours.' } }
];

const projects = [
  { title: { fr: 'Le Dahu', en: 'Le Dahu' },
    team: { fr: 'Équipe de 8', en: 'Team of 8' },
    sub: { fr: 'Application mobile et site web pour une association étudiante', en: 'Mobile app and website for a student association' },
    image: 'images/portfolio/dahu1.jpeg',
    short: { fr: 'Application mobile et site web avec forum pour une association étudiante de Grenoble, en équipe de 8.', en: 'Mobile app and website with a forum for a Grenoble student association, in a team of 8.' },
    text: [
      { fr: 'Application mobile et site web créés pour une association étudiante de Grenoble, en équipe de huit personnes.', en: 'Mobile app and website built for a Grenoble student association, in a team of eight.' },
      { fr: 'Après une étude des besoins, nous avons identifié les fonctionnalités clés, dont un forum de discussion, puis conçu une expérience fluide sur mobile et un site web interactif et informatif.', en: 'After a needs analysis, we identified the key features, including a discussion forum, then designed a smooth mobile experience and an interactive, informative website.' },
      { fr: 'Un projet qui a renforcé notre travail en équipe et notre gestion de projet de bout en bout.', en: 'A project that strengthened our teamwork and end-to-end project management.' }
    ],
    tags: ['Angular', 'HTML', 'CSS', 'PHP Symfony', 'JavaScript'] },
  { title: 'InstruMenthol',
    team: { fr: 'Équipe de 6', en: 'Team of 6' },
    sub: { fr: 'Application de vente aux enchères d’instrumentales', en: 'Instrumental auction application' },
    image: 'images/portfolio/instru.png',
    short: { fr: 'Plateforme d’enchères reliant beatmakers et chanteurs amateurs, en équipe de 6.', en: 'Auction platform connecting beatmakers and amateur singers, in a team of 6.' },
    text: [
      { fr: 'Application de vente aux enchères d’instrumentales, reliant beatmakers et chanteurs amateurs.', en: 'Instrumental auction application connecting beatmakers and amateur singers.' },
      { fr: 'Basée sur un modèle d’enchère au second prix, elle permet de vendre des droits patrimoniaux tout en garantissant sécurité et qualité.', en: 'Based on a second-price auction model, it allows the sale of economic rights while ensuring security and quality.' },
      { fr: 'Développée par itérations avec Symfony, MariaDB et Bootstrap, en groupe de six personnes.', en: 'Developed iteratively with Symfony, MariaDB and Bootstrap, in a group of six.' }
    ],
    tags: ['PHP Symfony', 'MariaDB', 'Bootstrap', 'JavaScript'] },
  { title: 'R-JUMP 3000',
    team: { fr: 'Équipe de 4', en: 'Team of 4' },
    sub: { fr: 'Jeu vidéo 2D', en: '2D video game' },
    image: 'images/portfolio/Pygame.png',
    short: { fr: 'Jeu de plateforme 2D où un robot saute par-dessus des obstacles, en équipe de 4.', en: '2D platform game where a robot jumps over obstacles, in a team of 4.' },
    text: [
      { fr: 'Jeu 2D développé en Python avec Pygame, en groupe de quatre personnes.', en: '2D game developed in Python with Pygame, in a group of four.' },
      { fr: 'Le joueur contrôle un robot qui franchit divers obstacles grâce à différents types de sauts, au fil des niveaux.', en: 'The player controls a robot that clears obstacles with different kinds of jumps across levels.' }
    ],
    tags: ['Python', 'Pygame'] },
  { title: { fr: 'Démineur', en: 'Minesweeper' },
    sub: { fr: 'Jeu mobile développé avec Flutter', en: 'Mobile game built with Flutter' },
    image: 'images/portfolio/demineur.png',
    short: { fr: 'Recréation du démineur avec Flutter.', en: 'Minesweeper recreated with Flutter.' },
    text: [
      { fr: 'Recréation du jeu du démineur avec Flutter, pour développer nos compétences en conception d’interface et en programmation mobile.', en: 'Minesweeper recreated with Flutter to build our UI design and mobile programming skills.' }
    ],
    tags: ['Flutter', 'Dart'] },
  { title: { fr: 'Site web d’entreprise', en: 'Company website' },
    team: { fr: 'Équipe de 3', en: 'Team of 3' },
    sub: { fr: 'Premier projet web, en trinôme', en: 'First web project, in a trio' },
    image: 'images/portfolio/hardis.png',
    short: { fr: 'Mon premier site web, créé en trinôme pour une entreprise du numérique.', en: 'My first website, built in a trio for a digital company.' },
    text: [
      { fr: 'Projet d’entraînement proposé par l’IUT en 2021 : créer un site web pour une entreprise du numérique, en trinôme.', en: 'Training project set by the IUT in 2021: build a website for a digital company, in a trio.' },
      { fr: 'Il m’a appris l’importance du souci du détail et d’un code propre pour travailler efficacement à plusieurs.', en: 'It taught me the importance of attention to detail and clean code for working effectively as a team.' }
    ],
    tags: ['HTML', 'CSS'] }
];

/* =====================================================================
   UTILITAIRES
   ===================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tagsHtml = tags => tags.map(t => `<span class="tag">${esc(L(t))}</span>`).join('');
const listHtml = items => `<ul>${items.map(i => `<li>${esc(L(i))}</li>`).join('')}</ul>`;
const kpiHtml = kpis => (kpis && kpis.length)
  ? `<div class="kpis">${kpis.map(k => `<div class="kpi"><strong>${esc(L(k.value))}</strong><span>${esc(L(k.label))}</span></div>`).join('')}</div>` : '';

/* =====================================================================
   RENDU
   ===================================================================== */
function render() {
  // Compétences
  const skillsBox = $('#skills'); skillsBox.innerHTML = '';
  skills.forEach(s => skillsBox.appendChild(el('div', 'skill',
    `<h4>${esc(L(s.title))}</h4><div class="chips">${s.items.map(i => `<span class="chip">${esc(L(i))}</span>`).join('')}</div>`)));

  // EDF : piliers
  const pil = $('#pillars'); pil.innerHTML = '';
  pillars.forEach(p => pil.appendChild(el('div', 'pillar reveal visible',
    `<div class="pillar-icon"><i class="fa ${p.icon}"></i></div><h4>${esc(L(p.title))}</h4>${listHtml(p.items)}${kpiHtml(p.kpis)}`)));

  // EDF : réalisations (Contexte / Rôle / Actions / Résultats)
  const caseHtml = c => `<div class="case-head"><h4>${esc(L(c.title))}</h4><div class="tags">${tagsHtml(c.tags)}</div></div>
     <div class="case-grid">
       <div><h5>${esc(tr('lbl_context'))}</h5><p>${esc(L(c.context))}</p></div>
       <div><h5>${esc(tr('lbl_role'))}</h5><p>${esc(L(c.role))}</p></div>
       <div><h5>${esc(tr('lbl_actions'))}</h5>${listHtml(c.actions)}</div>
       <div><h5>${esc(tr('lbl_results'))}</h5>${listHtml(c.results)}${kpiHtml(c.kpis)}</div>
     </div>`;
  const cs = $('#cases'); cs.innerHTML = '';
  cases.forEach(c => cs.appendChild(el('article', 'case featured reveal visible', caseHtml(c))));
  const cs2 = $('#cases-secondary'); cs2.innerHTML = '';
  casesSecondary.forEach(c => cs2.appendChild(el('article', 'case reveal visible', caseHtml(c))));

  // Parcours
  const exp = $('#experience-list'); exp.innerHTML = '';
  experiences.forEach(e => {
    const hasMore = e.sections.length > 0;
    const item = el('div', 't-item reveal visible');
    item.innerHTML = `
      <div class="t-dot"></div>
      <div class="t-card ${hasMore ? 'clickable' : ''}">
        ${e.thumb ? `<div class="t-thumb"><img src="${e.thumb}" alt="${esc(L(e.place))}"></div>` : ''}
        <div class="t-content">
          <span class="t-date"><i class="fa fa-calendar"></i> ${esc(L(e.date))}</span>
          <h3>${esc(L(e.title))}</h3>
          <p class="t-place">${esc(L(e.place))}</p>
          <p>${esc(L(e.summary))}</p>
          ${e.tags.length ? `<div class="tags">${tagsHtml(e.tags)}</div>` : ''}
          ${hasMore ? `<button class="t-more" type="button">${esc(tr('more'))} <i class="fa fa-arrow-right"></i></button>` : ''}
        </div>
      </div>`;
    if (hasMore) $('.t-card', item).addEventListener('click', () =>
      openModal({ title: L(e.title), sub: L(e.place), images: e.images, sections: e.sections, tags: e.tags }));
    exp.appendChild(item);
  });

  // Formation
  const edu = $('#education-list'); edu.innerHTML = '';
  education.forEach(e => edu.appendChild(el('div', 't-item reveal visible',
    `<div class="t-dot"></div><div class="t-card"><div class="t-content">
      <span class="t-date"><i class="fa fa-calendar"></i> ${esc(L(e.date))}</span>
      <h3>${esc(L(e.title))}</h3><p class="t-place">${esc(L(e.place))}</p><p>${esc(L(e.text))}</p></div></div>`)));

  // Projets académiques
  const pr = $('#projects-list'); pr.innerHTML = '';
  projects.forEach(p => {
    const card = el('button', 'project reveal visible');
    card.type = 'button';
    card.innerHTML = `
      <div class="project-img"><img src="${p.image}" alt="${esc(L(p.title))}"></div>
      <div class="project-body">
        <h3>${esc(L(p.title))}</h3><p>${esc(L(p.short))}</p>
        <div class="tags">${tagsHtml(p.tags.slice(0, 3))}</div>
      </div>`;
    card.addEventListener('click', () => openModal({ title: L(p.title), sub: L(p.sub), images: [p.image], meta: p.team ? [p.team] : [], sections: [{ h: { fr: 'Le projet', en: 'The project' }, ul: null, p: p.text }], tags: p.tags }));
    pr.appendChild(card);
  });
}

/* =====================================================================
   LANGUE
   ===================================================================== */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(n => { n.innerHTML = tr(n.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(n => { n.setAttribute('placeholder', tr(n.dataset.i18nPh)); });
  $('#lang-btn').textContent = lang === 'fr' ? 'EN' : 'FR';
  document.title = lang === 'fr'
    ? 'Farès Medjahed – Développeur full-stack | Alternant EDF'
    : 'Farès Medjahed – Full-stack Developer | EDF work-study';
  render();
  setTyped();
}
$('#lang-btn').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  try { localStorage.setItem('lang', lang); } catch (e) {}
  applyLang();
});

/* =====================================================================
   MODALE
   ===================================================================== */
const modal = $('#modal');
function sectionHtml(sec) {
  const body = sec.ul ? listHtml(sec.ul)
    : Array.isArray(sec.p) ? sec.p.map(x => `<p>${esc(L(x))}</p>`).join('')
    : `<p>${esc(L(sec.p))}</p>`;
  return `<div class="m-sec"><h4>${esc(L(sec.h))}</h4>${body}</div>`;
}
function openModal({ title, sub, images, meta, sections, tags }) {
  $('#modal-title').textContent = title;
  $('#modal-sub').textContent = sub || '';
  const gal = $('#modal-gallery');
  gal.innerHTML = (images || []).map(src => `<img src="${src}" alt="${esc(title)}">`).join('');
  gal.className = 'modal-gallery g' + (images || []).length;
  $('#modal-meta').innerHTML = (meta || []).map(m => `<span class="meta"><i class="fa fa-users"></i> ${esc(L(m))}</span>`).join('');
  $('#modal-text').innerHTML = (sections || []).map(sectionHtml).join('');
  $('#modal-tags').innerHTML = tagsHtml(tags || []);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('.modal-box').scrollTop = 0;
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
$('#modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* =====================================================================
   NAVIGATION
   ===================================================================== */
const header = $('#header'), nav = $('#nav'), toggler = $('#nav-toggler');
toggler.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggler.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggler.setAttribute('aria-expanded', 'false');
}));
const links = [...nav.querySelectorAll('a')];
const sections = links.map(a => $(a.getAttribute('href')));
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  const pos = window.scrollY + 140;
  let current = 0;
  sections.forEach((s, i) => { if (s.offsetTop <= pos) current = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === current));
}
window.addEventListener('scroll', onScroll, { passive: true });

/* =====================================================================
   ANIMATIONS D'APPARITION
   ===================================================================== */
const revealEls = document.querySelectorAll('.reveal:not(.visible)');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(r => io.observe(r));
} else {
  revealEls.forEach(r => r.classList.add('visible'));
}

/* =====================================================================
   MACHINE À ÉCRIRE
   ===================================================================== */
let typedInstance = null;
function setTyped() {
  const strings = lang === 'fr'
    ? ['Développeur full-stack', 'Développeur web', 'Administrateur systèmes', 'Alternant chez EDF']
    : ['Full-stack developer', 'Web developer', 'Systems administrator', 'Work-study at EDF'];
  if (typedInstance) typedInstance.destroy();
  if (window.Typed) {
    typedInstance = new Typed('.typing', { strings, typeSpeed: 60, backSpeed: 35, backDelay: 1600, loop: true });
  } else {
    $('.typing').textContent = strings[0];
  }
}

/* =====================================================================
   FORMULAIRE & DIVERS
   ===================================================================== */
$('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const nom = $('#nom').value, email = $('#email').value, objet = $('#objet').value, message = $('#message').value;
  const body = `${message}\n\n— ${nom} (${email})`;
  window.location.href = `mailto:Fares.medjahed2@gmail.com?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(body)}`;
});
$('#year').textContent = new Date().getFullYear();

applyLang();
onScroll();
