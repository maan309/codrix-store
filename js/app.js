// =====================================================
//  CODRIX APK Store — Main JavaScript
//  Full Arabic RTL Dark Mode APK Store Logic
// =====================================================

'use strict';

// ─── App State ────────────────────────────────────────
const State = {
  apps: [],
  filtered: [],
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'newest',
};

// ─── Default sample apps ──────────────────────────────
const SAMPLE_APPS = [
  {
    id: 'app-1',
    name: 'متصفح الفضاء',
    version: '3.2.1',
    size: '45.8 MB',
    category: 'أدوات',
    desc: 'متصفح ويب سريع وآمن مع دعم كامل للغة العربية وحماية الخصوصية المتقدمة.',
    icon: null,
    iconEmoji: '🌐',
    iconBg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
    downloads: 12843,
    rating: 4.8,
    date: Date.now() - 86400000 * 2,
    fileName: 'space-browser.apk',
    fileUrl: '#',
  },
  {
    id: 'app-2',
    name: 'بريمو للمحادثة',
    version: '2.0.5',
    size: '28.3 MB',
    category: 'تواصل',
    desc: 'تطبيق مراسلة فوري آمن بتشفير كامل من طرف إلى طرف يدعم الفيديو والصوت.',
    icon: null,
    iconEmoji: '💬',
    iconBg: 'linear-gradient(135deg,#065f46,#10b981)',
    downloads: 8920,
    rating: 4.6,
    date: Date.now() - 86400000 * 5,
    fileName: 'primo-chat.apk',
    fileUrl: '#',
  },
  {
    id: 'app-3',
    name: 'أكاديمي - تعلم ذكي',
    version: '1.9.0',
    size: '62.1 MB',
    category: 'تعليم',
    desc: 'منصة تعليمية شاملة لتعلم البرمجة والعلوم والرياضيات بأسلوب تفاعلي مميز.',
    icon: null,
    iconEmoji: '🎓',
    iconBg: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
    downloads: 21500,
    rating: 4.9,
    date: Date.now() - 86400000 * 1,
    fileName: 'academi-learn.apk',
    fileUrl: '#',
  },
  {
    id: 'app-4',
    name: 'فيت تراك',
    version: '4.1.2',
    size: '33.6 MB',
    category: 'صحة',
    desc: 'تطبيق اللياقة البدنية الأكثر شمولاً لتتبع التمارين والنظام الغذائي والنوم.',
    icon: null,
    iconEmoji: '💪',
    iconBg: 'linear-gradient(135deg,#b45309,#f59e0b)',
    downloads: 15230,
    rating: 4.7,
    date: Date.now() - 86400000 * 7,
    fileName: 'fittrack.apk',
    fileUrl: '#',
  },
  {
    id: 'app-5',
    name: 'نووفا بلاير',
    version: '5.0.3',
    size: '18.9 MB',
    category: 'ترفيه',
    desc: 'مشغل وسائط متعدد قوي يدعم جميع صيغ الفيديو والصوت بجودة عالية.',
    icon: null,
    iconEmoji: '🎵',
    iconBg: 'linear-gradient(135deg,#831843,#ec4899)',
    downloads: 9750,
    rating: 4.5,
    date: Date.now() - 86400000 * 3,
    fileName: 'nova-player.apk',
    fileUrl: '#',
  },
  {
    id: 'app-6',
    name: 'سيكيور VPN برو',
    version: '2.8.0',
    size: '12.4 MB',
    category: 'أدوات',
    desc: 'شبكة VPN سريعة وآمنة لحماية خصوصيتك وتجاوز القيود الجغرافية بسهولة.',
    icon: null,
    iconEmoji: '🛡️',
    iconBg: 'linear-gradient(135deg,#164e63,#06b6d4)',
    downloads: 31200,
    rating: 4.4,
    date: Date.now() - 86400000 * 10,
    fileName: 'secure-vpn-pro.apk',
    fileUrl: '#',
  },
];

// ─── Categories ───────────────────────────────────────
const CATEGORIES = ['الكل', 'أدوات', 'تواصل', 'تعليم', 'صحة', 'ترفيه', 'ألعاب', 'أعمال'];

// ─── DOM References ───────────────────────────────────
const DOM = {
  appsGrid: () => document.getElementById('appsGrid'),
  searchInput: () => document.getElementById('searchInput'),
  filtersRow: () => document.getElementById('filtersRow'),
  uploadModal: () => document.getElementById('uploadModal'),
  appDetailOverlay: () => document.getElementById('appDetailOverlay'),
  appsCountEl: () => document.getElementById('appsCount'),
  sortSelect: () => document.getElementById('sortSelect'),
  uploadForm: () => document.getElementById('uploadForm'),
  apkDropzone: () => document.getElementById('apkDropzone'),
  apkFileInput: () => document.getElementById('apkFileInput'),
  apkFilename: () => document.getElementById('apkFilename'),
  iconPreview: () => document.getElementById('iconPreview'),
  iconFileInput: () => document.getElementById('iconFileInput'),
  navbar: () => document.getElementById('mainNavbar'),
  navToggle: () => document.getElementById('navToggle'),
  navLinks: () => document.getElementById('navLinks'),
  scrollTopBtn: () => document.getElementById('scrollTopBtn'),
  heroAppsCount: () => document.getElementById('heroAppsCount'),
  toastContainer: () => document.getElementById('toastContainer'),
};

// ─── Init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadAppsFromStorage();
  renderCategories();
  filterAndRender();
  bindEvents();
  updateHeroStats();
});

// ─── Storage ──────────────────────────────────────────
function loadAppsFromStorage() {
  try {
    const stored = localStorage.getItem('codrix_apps');
    State.apps = stored ? JSON.parse(stored) : [...SAMPLE_APPS];
  } catch {
    State.apps = [...SAMPLE_APPS];
  }
}

function saveAppsToStorage() {
  try { localStorage.setItem('codrix_apps', JSON.stringify(State.apps)); } catch {}
}

// ─── Categories Render ────────────────────────────────
function renderCategories() {
  const row = DOM.filtersRow();
  if (!row) return;
  row.innerHTML = '';
  CATEGORIES.forEach((cat, i) => {
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
    'ألعاب': '🎮', 'أعمال': '💼',
  };
  return icons[cat] || '📦';
}

// ─── Filter & Sort ────────────────────────────────────
function filterAndRender() {
  let result = [...State.apps];

  // Category filter
  if (State.activeCategory !== 'all') {
    result = result.filter(a => a.category === State.activeCategory);
  }

  // Search filter
  if (State.searchQuery.trim()) {
    const q = State.searchQuery.trim().toLowerCase();
    result = result.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.desc.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (State.sortBy) {
    case 'newest':    result.sort((a, b) => b.date - a.date); break;
    case 'oldest':    result.sort((a, b) => a.date - b.date); break;
    case 'popular':   result.sort((a, b) => b.downloads - a.downloads); break;
    case 'rating':    result.sort((a, b) => b.rating - a.rating); break;
    case 'name':      result.sort((a, b) => a.name.localeCompare(b.name, 'ar')); break;
  }

  State.filtered = result;
  renderApps(result);
  updateCountBar(result.length);
}

// ─── Render Apps ──────────────────────────────────────
function renderApps(apps) {
  const grid = DOM.appsGrid();
  if (!grid) return;

  if (apps.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">لا توجد تطبيقات مطابقة</div>
        <div class="empty-desc">حاول تغيير كلمة البحث أو التصنيف المحدد</div>
      </div>`;
    return;
  }

  grid.innerHTML = apps.map(app => createAppCard(app)).join('');

  // Bind card events
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
  const stars = renderStars(app.rating);
  const iconHtml = app.icon
    ? `<img src="${app.icon}" alt="${app.name}">`
    : `<span style="font-size:2rem">${app.iconEmoji || '📦'}</span>`;

  return `
    <div class="app-card" data-id="${app.id}">
      <div class="card-banner">
        <div class="card-banner-bg" style="background:${app.iconBg || 'linear-gradient(135deg,#1e3a8a,#3b82f6)'}"></div>
        <div class="card-banner-icon" style="background:${app.iconBg || 'linear-gradient(135deg,#1e3a8a,#3b82f6)'}">
          ${iconHtml}
        </div>
        <span class="card-category">${app.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${escHtml(app.name)}</h3>
        <p class="card-desc">${escHtml(app.desc)}</p>
        <div class="card-meta">
          <span class="meta-badge"><i class="fas fa-code-branch"></i> v${escHtml(app.version)}</span>
          <span class="meta-badge"><i class="fas fa-hdd"></i> ${escHtml(app.size)}</span>
          <span class="meta-badge"><i class="fas fa-download"></i> ${formatNum(app.downloads)}</span>
        </div>
        <div class="card-rating">
          ${stars}
          <span class="rating-count">(${app.rating})</span>
        </div>
        <button class="btn-download" data-id="${app.id}">
          <i class="fas fa-download"></i>
          تحميل APK
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

// ─── Download Handler ─────────────────────────────────
function handleDownload(appId) {
  const app = State.apps.find(a => a.id === appId);
  if (!app) return;

  const btn = document.querySelector(`.btn-download[data-id="${appId}"]`);
  if (!btn) return;

  // Show downloading state
  btn.classList.add('downloading');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';

  // Simulate download progress then success
  setTimeout(() => {
    btn.classList.remove('downloading');
    btn.classList.add('downloaded');
    btn.innerHTML = '<i class="fas fa-check"></i> تم التحميل!';

    // If real file URL, trigger download
    if (app.fileUrl && app.fileUrl !== '#') {
      const a = document.createElement('a');
      a.href = app.fileUrl;
      a.download = app.fileName || app.name + '.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Update download count
    app.downloads = (app.downloads || 0) + 1;
    saveAppsToStorage();

    showToast(`تم بدء تحميل ${app.name} بنجاح! ✅`, 'success');

    // Reset button after delay
    setTimeout(() => {
      btn.classList.remove('downloaded');
      btn.innerHTML = '<i class="fas fa-download"></i> تحميل APK';
    }, 3000);
  }, 1500);
}

// ─── App Detail ───────────────────────────────────────
function openAppDetail(appId) {
  const app = State.apps.find(a => a.id === appId);
  if (!app) return;

  const overlay = DOM.appDetailOverlay();
  if (!overlay) return;

  const iconHtml = app.icon
    ? `<img src="${app.icon}" alt="${app.name}">`
    : `<span style="font-size:2.2rem">${app.iconEmoji || '📦'}</span>`;

  overlay.querySelector('.app-detail-box').innerHTML = `
    <div class="detail-header">
      <button class="detail-close" onclick="closeAppDetail()"><i class="fas fa-times"></i></button>
      <div class="detail-icon" style="background:${app.iconBg || 'linear-gradient(135deg,#1e3a8a,#3b82f6)'}">
        ${iconHtml}
      </div>
      <div class="detail-info">
        <span class="detail-category">${app.category}</span>
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
          <div class="detail-stat-label">التحميلات</div>
        </div>
      </div>
      <button class="detail-download-btn" onclick="handleDownload('${app.id}'); closeAppDetail();">
        <i class="fas fa-download"></i>
        تحميل التطبيق (${app.size})
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

// ─── Upload Modal ─────────────────────────────────────
function openUploadModal() {
  const modal = DOM.uploadModal();
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeUploadModal() {
  const modal = DOM.uploadModal();
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  resetUploadForm();
}

function resetUploadForm() {
  const form = DOM.uploadForm();
  if (form) form.reset();

  const dz = DOM.apkDropzone();
  if (dz) { dz.classList.remove('has-file'); }

  const fn = DOM.apkFilename();
  if (fn) { fn.style.display = 'none'; fn.textContent = ''; }

  const preview = DOM.iconPreview();
  if (preview) { preview.innerHTML = '<i class="fas fa-image"></i>'; }

  // Reset stored file data
  window._apkFileData = null;
  window._iconDataUrl = null;
}

// ─── Handle Upload Form ───────────────────────────────
function handleUploadSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('appName')?.value?.trim();
  const version = document.getElementById('appVersion')?.value?.trim();
  const size    = document.getElementById('appSize')?.value?.trim();
  const category= document.getElementById('appCategory')?.value;
  const desc    = document.getElementById('appDesc')?.value?.trim();
  const emoji   = document.getElementById('appEmoji')?.value?.trim() || '📦';
  const color1  = document.getElementById('appColor1')?.value || '#1e3a8a';
  const color2  = document.getElementById('appColor2')?.value || '#3b82f6';

  // Validate required
  if (!name || !version || !category) {
    showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
    return;
  }

  const newApp = {
    id: 'app-' + Date.now(),
    name,
    version,
    size: size || 'غير محدد',
    category,
    desc: desc || 'لا يوجد وصف',
    icon: window._iconDataUrl || null,
    iconEmoji: emoji,
    iconBg: `linear-gradient(135deg,${color1},${color2})`,
    downloads: 0,
    rating: 5.0,
    date: Date.now(),
    fileName: name.replace(/\s+/g, '-') + '.apk',
    fileUrl: window._apkFileUrl || '#',
  };

  State.apps.unshift(newApp);
  saveAppsToStorage();
  filterAndRender();
  updateHeroStats();
  closeUploadModal();
  showToast(`تمت إضافة "${name}" بنجاح! 🎉`, 'success');
}

// ─── APK Drop Zone ────────────────────────────────────
function setupDropzone() {
  const dz = DOM.apkDropzone();
  const input = DOM.apkFileInput();
  const fn = DOM.apkFilename();
  if (!dz || !input) return;

  ['dragenter', 'dragover'].forEach(ev => {
    dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(ev => {
    dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('dragover'); });
  });

  dz.addEventListener('drop', e => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleApkFile(file);
  });

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) handleApkFile(file);
  });
}

function handleApkFile(file) {
  const dz = DOM.apkDropzone();
  const fn = DOM.apkFilename();

  if (!file.name.toLowerCase().endsWith('.apk') && !file.name.toLowerCase().endsWith('.xapk')) {
    showToast('يرجى اختيار ملف APK صحيح', 'error');
    return;
  }

  // Auto fill size
  const sizeInput = document.getElementById('appSize');
  if (sizeInput && !sizeInput.value) {
    sizeInput.value = formatBytes(file.size);
  }

  // Auto fill name
  const nameInput = document.getElementById('appName');
  if (nameInput && !nameInput.value) {
    nameInput.value = file.name.replace(/\.apk$/i, '').replace(/[-_]/g, ' ');
  }

  // Create object URL for download
  window._apkFileUrl = URL.createObjectURL(file);

  if (dz) dz.classList.add('has-file');
  if (fn) { fn.textContent = `✅ ${file.name}`; fn.style.display = 'block'; }
}

// ─── Icon Upload ──────────────────────────────────────
function setupIconUpload() {
  const input = DOM.iconFileInput();
  const preview = DOM.iconPreview();
  if (!input || !preview) return;

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      window._iconDataUrl = e.target.result;
      preview.innerHTML = `<img src="${e.target.result}" alt="أيقونة">`;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Event Bindings ───────────────────────────────────
function bindEvents() {
  // Search
  const searchInput = DOM.searchInput();
  if (searchInput) {
    searchInput.addEventListener('input', debounce(e => {
      State.searchQuery = e.target.value;
      filterAndRender();
    }, 300));
  }

  // Sort
  const sortSelect = DOM.sortSelect();
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      State.sortBy = sortSelect.value;
      filterAndRender();
    });
  }

  // Upload form submit
  const form = DOM.uploadForm();
  if (form) form.addEventListener('submit', handleUploadSubmit);

  // Dropzone & icon setup
  setupDropzone();
  setupIconUpload();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = DOM.navbar();
    const scrollTop = DOM.scrollTopBtn();
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTop) scrollTop.classList.toggle('show', window.scrollY > 400);
  });

  // Nav toggle (mobile)
  const toggle = DOM.navToggle();
  const navLinks = DOM.navLinks();
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // Close modals on overlay click
  DOM.uploadModal()?.addEventListener('click', e => {
    if (e.target === DOM.uploadModal()) closeUploadModal();
  });
  DOM.appDetailOverlay()?.addEventListener('click', e => {
    if (e.target === DOM.appDetailOverlay()) closeAppDetail();
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeUploadModal();
      closeAppDetail();
    }
  });
}

// ─── Stats Update ─────────────────────────────────────
function updateHeroStats() {
  const el = DOM.heroAppsCount();
  if (el) el.textContent = State.apps.length;
}

function updateCountBar(count) {
  const el = DOM.appsCountEl();
  if (el) el.innerHTML = `عرض <strong>${count}</strong> من أصل <strong>${State.apps.length}</strong> تطبيق`;
}

// ─── Toast Notifications ──────────────────────────────
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
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'م';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'ك';
  return String(n);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ─── Scroll to top ────────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Smooth section scroll ────────────────────────────
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  DOM.navLinks()?.classList.remove('open');
}

// ─── Expose global functions ──────────────────────────
window.openUploadModal  = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.closeAppDetail   = closeAppDetail;
window.handleDownload   = handleDownload;
window.scrollToTop      = scrollToTop;
window.scrollToSection  = scrollToSection;
