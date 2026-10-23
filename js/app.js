// =====================================================
//  CODRIX APK Store — Main JavaScript (Amwali Edition)
// =====================================================

'use strict';

const MY_APPS = [
  {
    id: 'amwali-app',
    name: 'أموالي | Amwali',
    version: '1.0.0',
    size: '25 MB',
    category: 'المال والأعمال',
    desc: 'تطبيق ذكي وعصري لإدارة الأموال والمصروفات الشخصية، يساعدك على تنظيم دخلك ومتابعة نفقاتك والتحكم بميزانيتك بكل سهولة وأمان.',
    icon: null,
    iconEmoji: '💰',
    iconBg: 'linear-gradient(135deg, #059669, #10b981)',
    downloads: 0,
    rating: 5.0,
    date: Date.now(),
    fileName: 'app-debug.apk',
    fileUrl: 'uploads/app-debug.apk',
  }
];

const ALL_CATEGORIES_LABEL = 'الكل';

const State = {
  apps: [...MY_APPS],
  filtered: [...MY_APPS],
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'newest',
};

const DOM = {
  appsGrid:         () => document.getElementById('appsGrid'),
  searchInput:      () => document.getElementById('searchInput'),
  filtersRow:       () => document.getElementById('filtersRow'),
  appDetailOverlay: () => document.getElementById('appDetailOverlay'),
  appsCountEl:      () => document.getElementById('appsCount'),
  sortSelect:       () => document.getElementById('sortSelect'),
  navbar:           () => document.getElementById('mainNavbar'),
  navToggle:        () => document.getElementById('navToggle'),
  navLinks:         () => document.getElementById('navLinks'),
  scrollTopBtn:     () => document.getElementById('scrollTopBtn'),
  heroAppsCount:    () => document.getElementById('heroAppsCount'),
  toastContainer:   () => document.getElementById('toastContainer'),
};

document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('codrix_apps');
  State.apps = [...MY_APPS];
  buildCategories();
  filterAndRender();
  bindEvents();
  updateHeroStats();
});

function buildCategories() {
  const row = DOM.filtersRow();
  if (!row) return;
  const cats = [ALL_CATEGORIES_LABEL, ...new Set(MY_APPS.map(a => a.category))];
  row.innerHTML = '';
  cats.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (i === 0 ? ' active' : '');
    btn.dataset.cat = i === 0 ? 'all' : cat;
    btn.innerHTML = `${getCatIcon(cat)} ${cat}`;
    btn.addEventListener('click', () => {
      State.activeCategory = btn.dataset.cat;
      row.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterAndRender();
    });
    row.appendChild(btn);
  });
}

function getCatIcon(cat) {
  const icons = { 'الكل': '📱', 'المال والأعمال': '💰', 'أدوات': '🔧' };
  return icons[cat] || '📦';
}

function filterAndRender() {
  let result = [...State.apps];
  if (State.activeCategory !== 'all') {
    result = result.filter(a => a.category === State.activeCategory);
  }
  if (State.searchQuery.trim()) {
    const q = State.searchQuery.trim().toLowerCase();
    result = result.filter(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
  }
  State.filtered = result;
  renderApps(result);
  updateCountBar(result.length);
}

function renderApps(apps) {
  const grid = DOM.appsGrid();
  if (!grid) return;
  if (apps.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">📦</div><div class="empty-title">لا توجد تطبيقات مطابقة</div></div>`;
    return;
  }
  grid.innerHTML = apps.map(app => createAppCard(app)).join('');
  
  grid.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      handleDownload(btn.dataset.id);
    });
  });

  grid.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('click', () => openAppDetail(card.dataset.id));
  });
}

function createAppCard(app) {
  const stars = '<i class="fas fa-star"></i>'.repeat(5);
  return `
    <div class="app-card" data-id="${app.id}">
      <div class="card-banner">
        <div class="card-banner-bg" style="background:${app.iconBg}"></div>
        <div class="card-banner-icon" style="background:${app.iconBg}">
          <span style="font-size:2rem">${app.iconEmoji}</span>
        </div>
        <span class="card-category">${app.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${app.name}</h3>
        <p class="card-desc">${app.desc}</p>
        <div class="card-meta">
          <span class="meta-badge"><i class="fas fa-code-branch"></i> v${app.version}</span>
          <span class="meta-badge"><i class="fas fa-hdd"></i> ${app.size}</span>
        </div>
        <div class="card-rating">${stars} <span class="rating-count">(${app.rating})</span></div>
        <button class="btn-download" data-id="${app.id}"><i class="fas fa-download"></i> تحميل APK</button>
      </div>
    </div>`;
}

function handleDownload(appId) {
  const app = State.apps.find(a => a.id === appId);
  if (!app) return;
  const a = document.createElement('a');
  a.href = app.fileUrl;
  a.download = app.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function openAppDetail(appId) {
  const app = State.apps.find(a => a.id === appId);
  if (!app) return;
  const overlay = DOM.appDetailOverlay();
  if (!overlay) return;
  overlay.querySelector('.app-detail-box').innerHTML = `
    <div class="detail-header">
      <button class="detail-close" onclick="closeAppDetail()"><i class="fas fa-times"></i></button>
      <div class="detail-icon" style="background:${app.iconBg}"><span style="font-size:2.2rem">${app.iconEmoji}</span></div>
      <div class="detail-info">
        <span class="detail-category">${app.category}</span>
        <h2>${app.name}</h2>
      </div>
    </div>
    <div class="detail-body">
      <p class="detail-desc">${app.desc}</p>
      <button class="detail-download-btn" onclick="handleDownload('${app.id}'); closeAppDetail();">
        <i class="fas fa-download"></i> تحميل التطبيق — ${app.size}
      </button>
    </div>`;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAppDetail() {
  const overlay = DOM.appDetailOverlay();
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function bindEvents() {
  const searchInput = DOM.searchInput();
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      State.searchQuery = e.target.value;
      filterAndRender();
    });
  }
  const sortSelect = DOM.sortSelect();
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      State.sortBy = sortSelect.value;
      filterAndRender();
    });
  }
  DOM.appDetailOverlay()?.addEventListener('click', e => {
    if (e.target === DOM.appDetailOverlay()) closeAppDetail();
  });
}

function updateHeroStats() {
  const el = DOM.heroAppsCount();
  if (el) el.textContent = State.apps.length;
}

function updateCountBar(count) {
  const el = DOM.appsCountEl();
  if (el) {
    el.innerHTML = `عرض <strong>${count}</strong> من أصل <strong>${State.apps.length}</strong> تطبيق`;
  }
}

window.closeAppDetail = closeAppDetail;
window.handleDownload = handleDownload;
window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
