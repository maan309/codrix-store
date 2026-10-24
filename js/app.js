/* =====================================================
   subX Legendary Engine - Dynamic Project Loader
   ================================================───── */

'use strict';

const LEGENDARY_PROJECTS = [
    {
        id: 'amwali-app',
        name: 'أموالي | Amwali',
        version: '1.0.0',
        size: '25 MB',
        category: 'المال والأعمال والإنتاجية',
        desc: 'تطبيق ذكي وعصري لإدارة الأموال والمصروفات الشخصية، صُمم ليمنحك سيطرة كاملة ومطلقة على دخلك ونفقاتك وميزانيتك بكل سهولة واحترافية، مع واجهة مستخدم مذهلة وآمنة بالكامل.',
        iconEmoji: '💰',
        rating: 5.0,
        downloads: '+1,500',
        fileName: 'app-debug.apk',
        fileUrl: 'uploads/app-debug.apk',
        features: [
            { title: '💵 تتبع دقيق', desc: 'تسجيل وإدارة الدخل والنفقات بكل يسر.' },
            { title: '📊 تقارير وإحصائيات', desc: 'مخططات واضحة لمتابعة التدفقات المالية.' },
            { title: '💱 إدارة العملات', desc: 'تحويل وتحديد أسعار الصرف المرنة.' },
            { title: '🔐 أمان خصوصية تام', desc: 'بياناتك محفوظة محلياً ومشفرة بالكامل.' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    loadProjectsToDom();
});

function loadProjectsToDom() {
    const container = document.getElementById('legendaryAppsGrid');
    if (!container) return;

    container.innerHTML = LEGENDARY_PROJECTS.map(app => `
        <div class="project-master-card">
            <div class="project-visual">
                <div class="project-big-icon">${app.iconEmoji}</div>
                <span class="project-badge">${app.category}</span>
                <div style="margin-top: 15px; color: var(--accent-cyan); font-weight: 700;">الإصدار الرسمي v${app.version}</div>
            </div>

            <div class="project-info">
                <h3>${app.name}</h3>
                <p class="project-desc">${app.desc}</p>

                <div class="project-specs">
                    <span><i class="fas fa-hdd"></i> الحجم: ${app.size}</span>
                    <span><i class="fas fa-star" style="color: #f59e0b;"></i> التقييم: ${app.rating}</span>
                    <span><i class="fas fa-download"></i> عمليات التحميل: ${app.downloads}</span>
                </div>

                <div class="features-mini-grid">
                    ${app.features.map(f => `
                        <div class="mini-box">
                            <h5>${f.title}</h5>
                            <p>${f.desc}</p>
                        </div>
                    `).join('')}
                </div>

                <a href="${app.fileUrl}" class="download-master-btn" download="${app.fileName}">
                    <i class="fas fa-cloud-download-alt"></i> تحميل تطبيق أموالي APK مباشرة
                </a>
            </div>
        </div>
    `).join('');
}
