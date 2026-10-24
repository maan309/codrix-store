/* =====================================================
   subX JavaScript Engine - Dynamic App Loader
   ================================================───── */

'use strict';

// قائمة التطبيقات والمشاريع (يمكنك إضافة المزيد مستقبلاً هنا بكل سهولة)
const SUBX_PROJECTS = [
    {
        id: 'amwali-app',
        name: 'أموالي | Amwali',
        version: '1.0.0',
        size: '25 MB',
        category: 'المال والأعمال',
        desc: 'تطبيق ذكي وعصري لإدارة الأموال والمصروفات الشخصية، صُمم ليمنحك سيطرة كاملة على دخلك ونفقاتك وميزانيتك بكل سهولة وأمان، مع واجهة مستخدم أنيقة ومرنة تناسب الجميع.',
        iconEmoji: '💰',
        rating: 5.0,
        fileName: 'app-debug.apk',
        fileUrl: 'uploads/app-debug.apk',
        features: [
            { title: '💵 تتبع المصروفات', desc: 'تسجيل وإدارة الدخل والنفقات اليومية بكل يسر.' },
            { title: '📊 تقارير مالية', desc: 'إحصائيات واضحة ومبسطة لحركة أموالك.' },
            { title: '💱 إدارة العملات', desc: 'التحويل وإدارة أسعار الصرف بدقة تامة.' },
            { title: '🔐 حماية عالية', desc: 'بياناتك المالية محفوظة وآمنة بالكامل على جهازك.' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});

function renderProjects() {
    const container = document.getElementById('dynamicAppsContainer');
    if (!container) return;

    container.innerHTML = SUBX_PROJECTS.map(app => `
        <div class="app-showcase">
            <div class="app-top">
                <div class="app-icon-box">${app.iconEmoji}</div>
                <div class="app-details">
                    <h3>${app.name}</h3>
                    <span class="app-tag">${app.category}</span>
                </div>
            </div>

            <p class="app-description">${app.desc}</p>

            <div style="display: flex; gap: 20px; color: var(--text-muted); font-size: 0.95rem; flex-wrap: wrap;">
                <span><i class="fas fa-code-branch" style="color: var(--primary-color);"></i> الإصدار: ${app.version}</span>
                <span><i class="fas fa-hdd" style="color: var(--primary-color);"></i> الحجم: ${app.size}</span>
                <span><i class="fas fa-star" style="color: #f59e0b;"></i> التقييم: ${app.rating}</span>
            </div>

            <div class="app-features">
                ${app.features.map(f => `
                    <div class="feature-box">
                        <h5>${f.title}</h5>
                        <p>${f.desc}</p>
                    </div>
                `).join('')}
            </div>

            <a href="${app.fileUrl}" class="download-btn" download="${app.fileName}">
                <i class="fas fa-download"></i> تحميل تطبيق ${app.name} APK مباشرة
            </a>
        </div>
    `).join('');
}
