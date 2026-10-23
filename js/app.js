// =====================================================
//  CODRIX APK Store — Main JavaScript
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
  appsGrid:        () => document.getElementById('appsGrid'),
  searchInput:     () => document.getElementById('searchInput'),
  filtersRow:      () => document.getElementById('filtersRow'),
  appDetailOverlay:() => document.getElementById('appDetailOverlay'),
  appsCountEl:     () => document.getElementById('appsCount'),
  sortSelect:      () => document.getElementById('sortSelect'),
  navbar:          () => document.getElementById('mainNavbar'),
  navToggle:       () => document.getElementById('navToggle'),
  navLinks:        () => document.getElementById('navLinks'),
  scrollTopBtn:    () => document.getElementById('scrollTopBtn'),
  heroAppsCount:   () => document.getElementById('heroAppsCount'),
  toastContainer: () => document.getElementById('toastContainer'),
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
  const icons = { 'الكل': '📱', 'المال والأعمال': '💰' };
  return icons[cat] || '📦';
}

function filterAndRender() {
  let result = [...State.apps];
  if (State.activeCategory !== 'all') {
    result = result.filter(a => a.category === State.activeCategory);
  }
  State.filtered = result;
  renderApps(result);
  updateCountBar(result.length);
}

function renderApps(apps) {
  const grid = DOM.appsGrid();
  if (!grid) return;
  if (apps.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-title">لا توجد تطبيقات</div></div>`;
    return;
  }
  grid.innerHTML = apps.map(app => createAppCard(app)).join('');
  grid.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      handleDownload(btn.dataset.id);
    });
  });
}

function createAppCard(app) {
  const stars = '<i class="fas fa-star"></i>'.repeat(5);
  return `
    <div class="app-card" data-id="${app.id}">
      <div class="card-banner" style="background:${app.iconBg}">
        <span style="font-size:2.5rem">${app.iconEmoji}</span>
      </div>
      <div class="card-body">
        <h3>${app.name}</h3>
        <p>${app.desc}</p>
        <button class="btn-download" data-id="${app.id}">تحميل APK</button>
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

function updateHeroStats() {
  const el = DOM.heroAppsCount();
  if (el) el.textContent = State.apps.length;
}

function updateCountBar(count) {
  const el = DOM.appsCountEl();
  if (el) el.innerHTML = `عرض <strong>${count}</strong> تطبيق`;
}

window.handleDownload = handleDownload;
