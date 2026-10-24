/* SUBX — Interactions, accessibility and animations */
(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const header = document.getElementById('site-header');
  const progress = document.getElementById('scroll-progress');
  const menuButton = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.inert = !open;
    document.body.classList.toggle('menu-open', open);
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800 && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

  let scrollScheduled = false;
  function updateScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 18);
    const pageScrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (pageScrollable > 0 ? Math.min(100, y / pageScrollable * 100) : 0) + '%';
    let active = 'home';
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= window.innerHeight * .35) active = section.id;
    });
    navLinks.forEach(link => {
      const selected = link.getAttribute('href') === '#' + active;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollScheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) { window.requestAnimationFrame(updateScroll); scrollScheduled = true; }
  }, {passive:true});
  updateScroll();

  if ('IntersectionObserver' in window && !motionReduced) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      });
    }, {threshold:0.08, rootMargin:'0px 0px 65px 0px'});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  // Subtle desktop-only parallax. Completely disabled on touch devices.
  if (!motionReduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const heroArt = document.getElementById('hero-brand-frame');
    const hero = document.getElementById('home');
    let pointerTick = false;
    hero.addEventListener('pointermove', event => {
      if (pointerTick || window.innerWidth < 900) return;
      pointerTick = true;
      requestAnimationFrame(() => {
        const box = hero.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        heroArt.style.translate = `${Math.round(x * 11)}px ${Math.round(y * 9)}px`;
        pointerTick = false;
      });
    });
    hero.addEventListener('pointerleave', () => { heroArt.style.translate = '0px 0px'; });
  }

  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const name = document.getElementById('contact-name').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    if (!name || !subject || !message) return;
    const body = `الاسم: ${name}\n\nالرسالة:\n${message}\n\n— مرسلة من موقع SUBX`;
    const mailto = `mailto:maa321584@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
