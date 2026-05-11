// ════════════════════════════════════════════════
//  OFFRES D'EMPLOI — données & rendu dynamique
// ════════════════════════════════════════════════

const STORAGE_KEY = 'rpmcm_offres';

const OFFRES_DEFAUT = [
  {
    id: 'job-1',
    titre: "Agent d'entretien – Immeubles & parties communes",
    type: 'CDI',
    lieu: 'Abidjan (tous quartiers) · Temps plein',
    description: "Nettoyage des paliers, escaliers, halls d'entrée et devantures d'immeubles résidentiels.",
    tags: ['Débutant accepté', 'Formation assurée'],
    actif: true
  },
  {
    id: 'job-2',
    titre: 'Technicien(ne) de surface – Résidentiel & bureaux',
    type: 'CDD',
    lieu: 'Abidjan · Temps partiel ou plein',
    description: 'Ménage, dépoussiérage, lavage de sols et vitres chez des particuliers et en entreprise.',
    tags: ['Expérience souhaitée', 'Véhiculé(e) +'],
    actif: true
  },
  {
    id: 'job-3',
    titre: 'Chef d\'équipe – Coordination terrain',
    type: 'CDI',
    lieu: 'Abidjan · Temps plein',
    description: 'Encadrement d\'une équipe de 3 à 5 agents, planification et contrôle qualité des chantiers.',
    tags: ['2 ans d\'expérience min.', 'Leadership'],
    actif: true
  },
  {
    id: 'job-4',
    titre: 'Candidature spontanée',
    type: 'Ouvert',
    lieu: 'Abidjan · Tout profil',
    description: 'Vous ne trouvez pas de poste correspondant ? Envoyez-nous votre candidature, nous étudions tous les profils motivés.',
    tags: ['Tous niveaux', 'Motivation essentielle'],
    actif: true
  }
];

function getOffres() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(OFFRES_DEFAUT));
    return OFFRES_DEFAUT;
  }
  return JSON.parse(data);
}

const TYPE_COLORS = {
  'CDI':   'bg-warning text-dark',
  'CDD':   'bg-success text-white',
  'Stage': 'bg-info text-dark',
  'Ouvert':'bg-secondary text-white'
};

function renderOffres() {
  const container = document.getElementById('jobs-container');
  if (!container) return;

  const offres = getOffres().filter(o => o.actif);

  if (offres.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-4">
        <p class="text-white-50">Aucune offre disponible pour le moment. Revenez bientôt !</p>
      </div>`;
    return;
  }

  container.innerHTML = offres.map(o => {
    const badgeClass = TYPE_COLORS[o.type] || 'bg-secondary text-white';
    const tags = (o.tags || []).map(t => `<span class="job-tag">${t}</span>`).join('');
    return `
      <div class="col-md-6">
        <div class="job-card">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="fw-bold mb-0">${o.titre}</h6>
            <span class="badge ${badgeClass} ms-2 flex-shrink-0">${o.type}</span>
          </div>
          <p class="small text-muted mb-2">${o.lieu}</p>
          <p class="small mb-3">${o.description}</p>
          <div class="d-flex gap-2 flex-wrap mb-3">${tags}</div>
          <a href="#recru-form" class="btn btn-sm btn-warning fw-semibold">
            <i class="bi bi-send me-1"></i>Postuler
          </a>
        </div>
      </div>`;
  }).join('');

  // Relancer les animations sur les nouvelles cartes
  animateFadeIn(container.querySelectorAll('.job-card'));

  // Remplir le select du formulaire candidature
  const sel = document.getElementById('posteSelect');
  if (sel) {
    sel.innerHTML = '<option value="" disabled selected>Choisir un poste…</option>' +
      offres.map(o => `<option>${o.titre}</option>`).join('');
  }
}

// ── Navbar scroll effect ──────────────────────────────
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Smooth active link highlight ────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.navbar-nav a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ── Scroll-to-top button ─────────────────────────────
const scrollBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Contact form ─────────────────────────────────────
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours…';
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Envoyer ma demande';
    form.reset();
    form.classList.remove('was-validated');
    showToast('Merci ! Votre message a bien été envoyé. Nous vous contactons très bientôt.');
  }, 1800);
});

// ── Formulaire recrutement ───────────────────────────
const recrutForm = document.getElementById('recrutementForm');
if (recrutForm) {
  recrutForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!recrutForm.checkValidity()) { recrutForm.classList.add('was-validated'); return; }
    const btn = document.getElementById('recruBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Envoyer ma candidature';
      recrutForm.reset();
      recrutForm.classList.remove('was-validated');
      showToast('Candidature reçue ! Nous vous contacterons très prochainement.');
    }, 1800);
  });
}

// ── Toast ────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const id = 'toast-' + Date.now();
  const color = type === 'success' ? 'bg-success' : 'bg-danger';
  document.body.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast align-items-center text-white ${color} border-0 position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-lg"
         role="alert" style="z-index:9999;min-width:320px">
      <div class="d-flex">
        <div class="toast-body fw-semibold">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`);
  const el = document.getElementById(id);
  const t = new bootstrap.Toast(el, { delay: 5000 });
  t.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

// ── Fade-in on scroll ────────────────────────────────
function animateFadeIn(els) {
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

animateFadeIn(document.querySelectorAll(
  '.service-card, .testimonial-card, .why-card, .contact-info-card, .contact-form-card, .team-card, .recru-value-card, .recru-form-card'
));

// ── Init ─────────────────────────────────────────────
renderOffres();
