document.documentElement.classList.add('js');

/* ===================== Données ===================== */
const skills = [
  { title: 'Front-end', items: ['HTML', 'CSS', 'JavaScript', 'Angular', 'Bootstrap', 'Flutter'] },
  { title: 'Back-end', items: ['PHP / Symfony', 'Java', 'Python', 'Node.js', 'C / C++'] },
  { title: 'Données & outils', items: ['SQL / PL-SQL', 'NoSQL', 'Power BI', 'Dynamics 365', 'Git'] }
];

const experiences = [
  {
    date: "En cours",
    title: "Alternance chez EDF",
    place: "EDF",
    summary: "Je poursuis ma formation en alternance au sein d'EDF : je partage mon temps entre l'IUT et l'entreprise pour mettre en pratique, au quotidien, ce que j'apprends en cours.",
    details: [
      "Contribution à des projets numériques au sein d'une équipe, dans un grand groupe de l'énergie.",
      "Mise en pratique de mes compétences en développement, en analyse et en gestion de données.",
      "Développement de mon autonomie, de ma rigueur et de ma communication dans un environnement professionnel exigeant."
    ],
    tags: ["Alternance", "Développement", "Travail en équipe"],
    image: "images/fares.jpg"
  },
  {
    date: "2024",
    title: "Stage chez Rio Tinto",
    place: "Rio Tinto",
    summary: "Deux missions principales : améliorer l'utilisation du CRM Dynamics 365 et automatiser le suivi financier des projets grâce à des rapports Power BI.",
    details: [
      "Optimisation du CRM Dynamics 365 pour ses utilisateurs : développement de nouvelles fonctionnalités, correction de bugs et mise à jour des éléments obsolètes.",
      "Création de rapports Power BI destinés aux chefs de projet, afin d'automatiser le suivi financier des projets.",
      "Résultat : des rapports plus précis et plus rapides à produire, et un gain de temps important pour les équipes."
    ],
    tags: ["Power BI", "Dynamics 365", "Business Intelligence"],
    image: "images/portfolio/5e18519a6100003f50f2db6f.png"
  },
  {
    date: "2023",
    title: "Stage chez Mafelec",
    place: "Mafelec, Grenoble",
    summary: "Création d'une solution d'export automatique de rapports business depuis l'ERP IFS, avec des requêtes PL/SQL et des scripts Python.",
    details: [
      "Mafelec est une entreprise d'électronique grenobloise fondée en 1947, reconnue pour ses produits innovants dans le secteur industriel.",
      "Mission : résoudre un problème d'exportation de rapports business causé par un dysfonctionnement logiciel, en permettant l'export directement sur les postes des utilisateurs.",
      "Analyse des rapports existants et identification des données pertinentes dans l'ERP IFS, puis écriture de requêtes PL/SQL pour les extraire de la base de données.",
      "Développement d'un script Python (bibliothèque pandas) exportant les données au format Excel, planifié pour s'exécuter automatiquement chaque jour ou chaque semaine selon les rapports.",
      "Plusieurs rapports ont été exportés avec succès. Ce stage a renforcé ma précision, ma rigueur et ma confiance en moi."
    ],
    tags: ["SQL", "PL/SQL", "Python", "pandas", "ERP IFS"],
    image: "images/portfolio/mafelec_1.jpg"
  },
  {
    date: "2022",
    title: "Job étudiant",
    place: "Décathlon",
    summary: "Premier contact avec le monde professionnel : un mois au sein de l'équipe Décathlon.",
    details: [],
    tags: [],
    image: null
  }
];

const projects = [
  {
    title: "Le Dahu",
    sub: "Application mobile et site web pour une association étudiante",
    image: "images/portfolio/dahu1.jpeg",
    short: "Application mobile et site web avec forum pour une association étudiante de Grenoble.",
    text: [
      "En troisième année, nous avons créé une application mobile et un site web pour une association étudiante de Grenoble, en équipe de huit personnes.",
      "Après une étude des besoins, nous avons identifié les fonctionnalités clés, dont un forum de discussion. L'application mobile privilégie une expérience fluide et des fonctionnalités pratiques pour les membres ; le site web est interactif et informatif.",
      "Ce projet nous a permis d'appliquer nos compétences techniques, de renforcer notre travail en équipe et de gérer un projet créatif de bout en bout."
    ],
    tags: ["Angular", "HTML", "CSS", "PHP Symfony", "JavaScript", "Équipe de 8"]
  },
  {
    title: "InstruMenthol",
    sub: "Application de vente aux enchères d'instrumentales",
    image: "images/portfolio/instru.png",
    short: "Plateforme d'enchères reliant beatmakers et chanteurs amateurs.",
    text: [
      "InstruMenthol est une application de vente aux enchères d'instrumentales, qui relie beatmakers et chanteurs amateurs.",
      "Basée sur un modèle d'enchère au second prix, elle permet de vendre des droits patrimoniaux tout en garantissant sécurité et qualité.",
      "Développée par itérations avec Symfony, MariaDB et Bootstrap, en groupe de six personnes."
    ],
    tags: ["HTML", "CSS", "JavaScript", "PHP Symfony", "MariaDB", "Équipe de 6"]
  },
  {
    title: "R-JUMP 3000",
    sub: "Jeu vidéo 2D",
    image: "images/portfolio/Pygame.png",
    short: "Jeu de plateforme 2D où un robot saute par-dessus des obstacles.",
    text: [
      "R-JUMP 3000 est un jeu 2D développé en Python avec la bibliothèque Pygame, en groupe de quatre personnes.",
      "Le joueur contrôle un robot qui doit franchir divers obstacles grâce à différents types de sauts, au fil des niveaux.",
      "Ce projet allie notre passion pour le jeu vidéo et nos compétences techniques."
    ],
    tags: ["Python", "Pygame", "Équipe de 4"]
  },
  {
    title: "Démineur",
    sub: "Jeu mobile développé avec Flutter",
    image: "images/portfolio/demineur.png",
    short: "Recréation du célèbre jeu de démineur avec Flutter.",
    text: [
      "Nous avons recréé le jeu du démineur en utilisant Flutter.",
      "Ce projet nous a permis de développer nos compétences en conception d'interface utilisateur et en programmation mobile, tout en explorant les fonctionnalités avancées de Flutter."
    ],
    tags: ["Flutter", "Dart"]
  },
  {
    title: "Site web d'entreprise",
    sub: "Premier projet web, en trinôme",
    image: "images/portfolio/hardis.png",
    short: "Mon premier site web, créé en trinôme pour une entreprise du numérique.",
    text: [
      "En 2021, l'IUT Informatique de Grenoble nous a proposé un projet d'entraînement : créer un site web pour une entreprise du numérique, en trinôme.",
      "Ce fut ma première expérience de conception de site internet. Elle m'a permis d'explorer différentes technologies web et appris l'importance du souci du détail et d'un code propre pour travailler efficacement à plusieurs."
    ],
    tags: ["HTML", "CSS", "Équipe de 3"]
  }
];

/* ===================== Utilitaires ===================== */
const $ = (sel, root = document) => root.querySelector(sel);
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}
const tagsHtml = tags => tags.map(t => `<span class="tag">${t}</span>`).join('');

/* ===================== Compétences ===================== */
const skillsBox = $('#skills');
skills.forEach(s => {
  skillsBox.appendChild(el('div', 'skill',
    `<h4>${s.title}</h4><div class="chips">${s.items.map(i => `<span class="chip">${i}</span>`).join('')}</div>`));
});

/* ===================== Expériences ===================== */
const expBox = $('#experience-list');
experiences.forEach((e, i) => {
  const hasMore = e.details.length > 0;
  const item = el('div', 't-item reveal');
  item.innerHTML = `
    <div class="t-dot"></div>
    <div class="t-card ${hasMore ? 'clickable' : ''}">
      <span class="t-date"><i class="fa fa-calendar"></i> ${e.date}</span>
      <h3>${e.title}</h3>
      <p class="t-place">${e.place}</p>
      <p>${e.summary}</p>
      ${e.tags.length ? `<div class="tags">${tagsHtml(e.tags)}</div>` : ''}
      ${hasMore ? `<button class="t-more" type="button">En savoir plus <i class="fa fa-arrow-right"></i></button>` : ''}
    </div>`;
  if (hasMore) {
    const open = () => openModal({ title: e.title, sub: e.place, image: e.image, text: [e.summary, ...e.details], tags: e.tags, list: true });
    $('.t-card', item).addEventListener('click', open);
  }
  expBox.appendChild(item);
});

/* ===================== Projets ===================== */
const projBox = $('#projects-list');
projects.forEach(p => {
  const card = el('button', 'project reveal');
  card.type = 'button';
  card.innerHTML = `
    <div class="project-img"><img src="${p.image}" alt="${p.title}"></div>
    <div class="project-body">
      <h3>${p.title}</h3>
      <p>${p.short}</p>
      <div class="tags">${tagsHtml(p.tags.slice(0, 3))}</div>
    </div>`;
  card.addEventListener('click', () => openModal({ title: p.title, sub: p.sub, image: p.image, text: p.text, tags: p.tags }));
  projBox.appendChild(card);
});

/* ===================== Modale ===================== */
const modal = $('#modal');
function openModal({ title, sub, image, text, tags, list }) {
  $('#modal-title').textContent = title;
  $('#modal-sub').textContent = sub || '';
  const img = $('#modal-image');
  if (image) { img.src = image; img.alt = title; img.style.display = ''; } else { img.style.display = 'none'; }
  const box = $('#modal-text');
  box.innerHTML = '';
  if (list) {
    box.appendChild(el('p', '', text[0]));
    const ul = el('ul');
    text.slice(1).forEach(t => ul.appendChild(el('li', '', t)));
    box.appendChild(ul);
  } else {
    text.forEach(t => box.appendChild(el('p', '', t)));
  }
  $('#modal-tags').innerHTML = tagsHtml(tags || []);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
$('#modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ===================== Navigation ===================== */
const header = $('#header');
const nav = $('#nav');
const toggler = $('#nav-toggler');
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
onScroll();

/* ===================== Animations d'apparition ===================== */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(r => io.observe(r));
} else {
  revealEls.forEach(r => r.classList.add('visible'));
}

/* ===================== Effet machine à écrire ===================== */
if (window.Typed) {
  new Typed('.typing', {
    strings: ['Développeur Web', 'Développeur Front-end', 'Développeur Back-end', 'Alternant chez EDF'],
    typeSpeed: 70,
    backSpeed: 40,
    backDelay: 1500,
    loop: true
  });
} else {
  $('.typing').textContent = 'Développeur Web';
}

/* ===================== Âge & année ===================== */
(function () {
  const birth = new Date(2003, 3, 1); // avril 2003
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  $('#age').textContent = age;
  $('#year').textContent = now.getFullYear();
})();

/* ===================== Formulaire de contact (ouvre le client mail) ===================== */
$('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const nom = $('#nom').value, email = $('#email').value, objet = $('#objet').value, message = $('#message').value;
  const body = `${message}\n\n— ${nom} (${email})`;
  window.location.href = `mailto:Fares.medjahed2@gmail.com?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(body)}`;
});
