// =====================================================
//  CODRIX APK Store — Main JavaScript
//  النسخة النظيفة: تطبيقات حقيقية فقط، بدون رفع
// =====================================================

'use strict';

// ═══════════════════════════════════════════════════════
//  ★ قائمة تطبيقاتك الحقيقية — عدّلها هنا مباشرة ★
// ═══════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════
//  تصنيفات موجودة في قائمة تطبيقاتك (تُحسب تلقائياً)
// ═══════════════════════════════════════════════════════
const ALL_CATEGORIES_LABEL = 'الكل';

// ─── App State ────────────────────────────────────────
const State = {
  apps: [],
  filtered: [],
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'newest',
};

// ─── DOM References ───────────────────────────────────
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

// ─── Init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('codrix_apps');

  State.apps = [...MY_APPS];
  buildCategories();
  filterAndRender();
  bindEvents();
  updateHeroStats();
});

// ─── Build dynamic categories from MY_APPS ────────────
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
  const icons = {
    'الكل': '📱', 'أدوات': '🔧', 'تواصل': '💬',
    'تعليم': '🎓', 'صحة': '💪', 'ترفيه': '🎵',
    'ألعاب': '🎮', 'أعمال': '💼', 'المال والأعمال': '💰',
  };
  return icons[cat] || '📦';
}

// ─── Filter & Sort ────────────────────────────────────
function filterAndRender() {
  let result = [...State.apps];

  if (State.activeCategory !== 'all') {
    result = result.filter(a => a.category === State.activeCategory);
  }

  if (State.searchQuery.trim()) {
    const q = State.searchQuery.trim().toLowerCase();
    result = result.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  switch (State.sortBy) {
    case 'newest':  result.sort((a, b) => b.date - a.date); break;
    case 'oldest':  result.sort((a, b) => a.date - b.date); break;
    case 'popular': result.sort((a, b) => b.downloads - a.downloads); break;
    case 'rating':  result.sort((a, b) => b.rating - a.rating); break;
    case 'name':    result.sort((a, b) => a.name.localeCompare(b.name, 'ar')); break;
  }

  State.filtered = result;
  renderApps(result);
  updateCountBar(result.length);
}

// ─── Render Apps ──────────────────────────────────────
function renderApps(apps) {
  const grid = DOM.appsGrid();
  if (!grid) return;

  if (State.apps.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <div class="empty-title">لا توجد تطبيقات بعد</div>
      </div>`;
    return;
  }

  if (apps.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">لا توجد تطبيقات مطابقة</div>
      </div>`;
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

// ─── Build App Card HTML ──────────────────────────────
function createAppCard(app) {
  const stars   = renderStars(app.rating);
  const iconHtml = app.icon
    ? `<img src="${app.icon}" alt="${escHtml(app.name)}">`
    : `<span style="font-size:2rem">${app.iconEmoji || '📦'}</span>`;
  const bgGrad   = app.iconBg || 'linear-gradient(135deg,#1e3a8a,#3b82f6)';
  const hasFile  = app.fileUrl && app.fileUrl !== '#';

  return `
    <div class="app-card" data-id="${app.id}">
      <div class="card-banner">
        <div class="card-banner-bg" style="background:${bgGrad}"></div>
        <div class="card-banner-icon" style="background:${bgGrad}">
          ${iconHtml}
        </div>
        <span class="card-category">${escHtml(app.category)}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${escHtml(app.name)}</h3>
        <p class="card-desc">${escHtml(app.desc)}</p>
        <div class="card-meta">
          <span class="meta-badge"><i class="fas fa-code-branch"></i> v${escHtml(app.version)}</span>
          <span class="meta-badge"><i class="fas fa-hdd"></i> ${escHtml(app.size)}</span>
          ${app.downloads > 0 ? `<span class="meta-badge"><i class="fas fa-download"></i> ${formatNum(app.downloads)}</span>` : ''}
        </div>
        <div class="card-rating">
          ${stars}
          <span class="rating-count">(${app.rating})</span>
        </div>
        <button class="btn-download ${!hasFile ? 'btn-download--unavailable' : ''}"
                data-id="${app.id}">
          <i class="fas ${hasFile ? 'fa-download' : 'fa-clock'}"></i>
          ${hasFile ? 'تحميل APK' : 'قريباً'}
        </button>
      </div>
    </div>`;
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<i class="fas fa-star star${i > rating ? ' empty' : ''}"></i>`;
  }
  return html;
}

// ─── Direct Download Handler ──────────────────────────
function handleDownload(appId) {
  const app = State.apps.find(a => a.id === appId);
  if (!app) return;

  if (!app.fileUrl || app.fileUrl === '#') {
    showToast('رابط التحميل غير متوفر حالياً', 'error');
    return;
  }

  const btn = document.querySelector(`.btn-download[data-id="${appId}"]`);
  if (btn) {
    btn.classList.add('downloading');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
  }

  const a = document.createElement('a');
  a.href     = app.fileUrl;
  a.download = app.fileName || app.name.replace(/\s+/g, '-') + '.apk';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  app.downloads = (app.downloads || 0) + 1;
  showToast(`بدأ تحميل "${app.name}" — ${app.size} ✅`, 'success');

  setTimeout(() => {
    if (btn) {
      btn.classList.remove('downloading');
      btn.classList.add('downloaded');
      btn.innerHTML = '<i class="fas fa-check"></i> تم بدء التحميل!';
      setTimeout(() => {
        btn.classList.remove('downloaded');
        btn.innerHTML = '<i class="fas fa-download"></i> تحميل APK';
      }, 3000);
    }
  }, 800);
}

// ─── App Detail Overlay ───────────────────────────────
function openAppDetail(appId) {
  const app = State.apps.find(a => a.id === appId);
  if (!app) return;

  const overlay = DOM.appDetailOverlay();
  if (!overlay) return;

  const iconHtml = app.icon
    ? `<img src="${app.icon}" alt="${escHtml(app.name)}">`
    : `<span style="font-size:2.2rem">${app.iconEmoji || '📦'}</span>`;
  const bgGrad  = app.iconBg || 'linear-gradient(135deg,#1e3a8a,#3b82f6)';
  const hasFile = app.fileUrl && app.fileUrl !== '#';

  overlay.querySelector('.app-detail-box').innerHTML = `
    <div class="detail-header">
      <button class="detail-close" onclick="closeAppDetail()"><i class="fas fa-times"></i></button>
      <div class="detail-icon" style="background:${bgGrad}">${iconHtml}</div>
      <div class="detail-info">
        <span class="detail-category">${escHtml(app.category)}</span>
        <h2>${escHtml(app.name)}</h2>
        <div class="detail-rating-row">
          ${renderStars(app.rating)}
          <span class="rating-count" style="margin-right:4px">(${app.rating})</span>
        </div>
      </div>
    </div>
    <div class="detail-body">
      <p class="detail-desc">${escHtml(app.desc)}</p>
      <div class="detail-stats">
        <div class="detail-stat">
          <span class="detail-stat-value">v${escHtml(app.version)}</span>
          <div class="detail-stat-label">الإصدار</div>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-value">${escHtml(app.size)}</span>
          <div class="detail-stat-label">حجم الملف</div>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-value">${formatNum(app.downloads)}</span>
          <div class="detail-stat-label">مرات التحميل</div>
        </div>
      </div>
      <button class="detail-download-btn ${!hasFile ? 'btn-download--unavailable' : ''}"
              onclick="${hasFile ? `handleDownload('${app.id}'); closeAppDetail();` : ''}">
        <i class="fas ${hasFile ? 'fa-download' : 'fa-clock'}"></i>
        ${hasFile ? `تحميل التطبيق — ${escHtml(app.size)}` : 'سيتوفر قريباً'}
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

// ─── Event Bindings ───────────────────────────────────
function bindEvents() {
  const searchInput = DOM.searchInput();
  if (searchInput) {
    searchInput.addEventListener('input', debounce(e => {
      State.searchQuery = e.target.value;
      filterAndRender();
    }, 300));
  }

  const sortSelect = DOM.sortSelect();
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      State.sortBy = sortSelect.value;
      filterAndRender();
    });
  }

  window.addEventListener('scroll', () => {
    const navbar   = DOM.navbar();
    const scrollTop = DOM.scrollTopBtn();
    if (navbar)    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTop) scrollTop.classList.toggle('show', window.scrollY > 400);
  });

  const toggle   = DOM.navToggle();
  const navLinks = DOM.navLinks();
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  DOM.appDetailOverlay()?.addEventListener('click', e => {
    if (e.target === DOM.appDetailOverlay()) closeAppDetail();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAppDetail();
  });
}

// ─── Stats ────────────────────────────────────────────
function updateHeroStats() {
  const el = DOM.heroAppsCount();
  if (el) el.textContent = State.apps.length;
}

function updateCountBar(count) {
  const el = DOM.appsCountEl();
  if (el) {
    el.innerHTML = State.apps.length === 0
      ? 'لا توجد تطبيقات مضافة بعد'
      : `عرض <strong>${count}</strong> من أصل <strong>${State.apps.length}</strong> تطبيق`;
  }
}

// ─── Toast ────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = DOM.toastContainer();
  if (!container) return;

  const icons = { success: 'fa-check', error: 'fa-times', info: 'fa-info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type] || 'fa-info'}"></i></div>
    <span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slide-in-toast 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── Utilities ────────────────────────────────────────
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'م';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'ك';
  return String(n);
}

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ─── Global helpers ───────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  DOM.navLinks()?.classList.remove('open');
}

window.closeAppDetail  = closeAppDetail;
window.handleDownload  = handleDownload;
window.scrollToTop     = scrollToTop;
window.scrollToSection = scrollToSection;
