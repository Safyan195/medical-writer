// ============================================================
// Safyan Javed Portfolio — shared site behavior
// Scroll reveal, animated counters, testimonial slider, mobile nav
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  if (window.SJRender) await window.SJRender.renderAll();

  setYear();
  initMobileNav();
  initTestimonialSlider();
  initContactForm();
  bindDynamicBehaviors();

  // Live update: if content/theme changes in another tab (e.g. the Admin
  // Panel), re-render this page instantly without a manual refresh.
  window.addEventListener('storage', async (e) => {
    if (!window.SJStore) return;
    if (e.key === window.SJStore.CONTENT_KEY || e.key === window.SJStore.THEME_KEY || e.key === null) {
      if (window.SJRender) await window.SJRender.renderAll();
      bindDynamicBehaviors();
    }
  });
});

function bindDynamicBehaviors() {
  initScrollReveal();
  initCounters();
  initPortfolioFilters();
  initLightbox();
  initTimelineFill();
  initSkillBars();
}

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------- Mobile nav ---------------- */

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ---------------- Scroll reveal ---------------- */

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------------- Animated counters ---------------- */

function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ---------------- Testimonial slider ---------------- */

function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-slider__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i, userTriggered) {
    index = (i + slides.length) % slides.length;
    render();
    if (userTriggered) restartAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    timer = setInterval(next, 6000);
  }
  function restartAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1, true));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1, true));

  render();
  if (slides.length > 1) startAutoplay();
}

/* ---------------- Portfolio filter tabs ---------------- */

function initPortfolioFilters() {
  const tabsWrap = document.getElementById('filterTabs');
  const indicator = document.getElementById('filterIndicator');
  const grid = document.getElementById('portfolioGrid');
  if (!tabsWrap || !grid) return;

  const tabs = Array.from(tabsWrap.querySelectorAll('.filter-tab'));
  const cards = Array.from(grid.querySelectorAll('.portfolio-card'));

  function moveIndicator(tab) {
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.transform = `translateX(${tab.offsetLeft - 6}px)`;
  }

  function applyFilter(filter) {
    let visibleIndex = 0;
    cards.forEach((card) => {
      const matches = filter === 'all' || card.getAttribute('data-category') === filter;
      if (matches) {
        card.classList.remove('is-filtered-out');
        card.classList.remove('reveal', 'is-visible');
        card.style.transitionDelay = `${visibleIndex * 60}ms`;
        // force a reflow-based re-entry animation
        requestAnimationFrame(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            card.style.transition = `opacity var(--dur-med) var(--ease), transform var(--dur-med) var(--ease)`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
        visibleIndex += 1;
      } else {
        card.style.transitionDelay = '0ms';
        card.classList.add('is-filtered-out');
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      moveIndicator(tab);
      applyFilter(tab.getAttribute('data-filter'));
    });
  });

  const activeTab = tabsWrap.querySelector('.filter-tab.is-active') || tabs[0];
  if (activeTab) {
    // wait one frame so layout/fonts settle before measuring
    requestAnimationFrame(() => moveIndicator(activeTab));
    window.addEventListener('resize', () => moveIndicator(activeTab));
  }
}

/* ---------------- Lightbox ---------------- */

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const grid = document.getElementById('portfolioGrid');
  if (!lightbox || !grid) return;

  const closeBtn = document.getElementById('lightboxClose');
  const backdrop = document.getElementById('lightboxBackdrop');
  const imageEl = document.getElementById('lightboxImage');
  const tagEl = document.getElementById('lightboxTag');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');

  function open(card) {
    const thumb = card.querySelector('.portfolio-card__thumb');
    const image = card.getAttribute('data-image');
    if (image) {
      imageEl.innerHTML = `<img src="${image}" alt="" class="lightbox__img">`;
    } else {
      imageEl.innerHTML = thumb ? thumb.innerHTML : '';
    }
    tagEl.textContent = card.getAttribute('data-tag') || '';
    titleEl.textContent = card.getAttribute('data-title') || '';
    descEl.textContent = card.getAttribute('data-desc') || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  grid.querySelectorAll('.portfolio-card').forEach((card) => {
    card.addEventListener('click', () => open(card));
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}

/* ---------------- Timeline fill (About page) ---------------- */

function initTimelineFill() {
  const timeline = document.getElementById('timeline');
  const fill = document.getElementById('timelineFill');
  if (!timeline || !fill) return;

  function update() {
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    // progress: 0 when top of timeline is at bottom of viewport,
    // 1 when bottom of timeline has reached ~40% up the viewport
    const start = viewportH * 0.9;
    const end = viewportH * 0.4;
    const total = rect.height + (start - end);
    const traveled = start - rect.top;
    const progress = Math.min(Math.max(traveled / total, 0), 1);
    fill.style.height = `${progress * 100}%`;
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* ---------------- Skill bars (About page) ---------------- */

function initSkillBars() {
  const skills = document.querySelectorAll('.skill');
  if (!skills.length) return;

  const animate = (skillEl) => {
    const fill = skillEl.querySelector('.skill__fill');
    const valueEl = skillEl.querySelector('.skill__value');
    const target = parseInt(fill.getAttribute('data-fill'), 10);
    const duration = 1100;
    const start = performance.now();

    fill.style.width = target + '%';

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (valueEl) valueEl.textContent = Math.round(target * eased) + '%';
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    skills.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  skills.forEach((el) => observer.observe(el));
}

/* ---------------- Contact form ---------------- */

function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Honeypot: real visitors never fill this in. Bots often do.
    const honeypot = form.querySelector('[name="botcheck"]');
    if (honeypot && honeypot.value) return;

    const accessKey = window.SJStore ? (await window.SJStore.getContent()).site.web3formsKey : '';
    const submitBtn = form.querySelector('.contact-form__submit');
    const name = form.querySelector('#fieldName').value.trim();

    if (!accessKey) {
      // No delivery service connected yet — set the access key in
      // Admin Panel > Contact Info to start actually receiving messages.
      status.textContent = `Thanks${name ? ', ' + name : ''} — this form isn't connected to a delivery service yet. Add a Web3Forms access key in the Admin Panel to start receiving messages.`;
      return;
    }

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';

    try {
      const formData = new FormData(form);
      formData.append('access_key', accessKey);
      formData.append('subject', `New portfolio inquiry from ${name || 'website visitor'}`);
      formData.append('from_name', 'Safyan Javed Portfolio');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        status.textContent = `Thanks${name ? ', ' + name : ''} — your message has been sent. I'll get back to you soon.`;
        form.reset();
      } else {
        status.textContent = 'Something went wrong sending that. Please try again or email directly.';
      }
    } catch (err) {
      status.textContent = 'Could not send right now — please check your connection and try again, or email directly.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}
