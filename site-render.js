/* ============================================================
   Safyan Javed Portfolio — Site Renderer
   Reads SJStore content and paints it into whichever page is
   currently loaded. Safe to include on every page: each render
   function checks for its target elements before doing anything.
   ============================================================ */

(function () {
  function iconMarkup(svgInner) {
    return `<svg viewBox="0 0 48 48" fill="none">${svgInner || "<circle cx='24' cy='24' r='14' stroke='currentColor' stroke-width='1.4'/><path d='M24 17v14M17 24h14' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/>"}</svg>`;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.textContent = value;
  }

  function setHTML(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.innerHTML = value;
  }

  /* ---------------- Site-wide: footer + nav contact links ---------------- */

  function renderSiteWide(content) {
    const site = content.site;

    document.querySelectorAll('[data-bind="footer-email"]').forEach((el) => {
      el.setAttribute('href', 'mailto:' + site.email);
    });
    document.querySelectorAll('[data-bind="social-linkedin"]').forEach((el) => {
      el.setAttribute('href', site.linkedin || '#');
    });
    document.querySelectorAll('[data-bind="social-researchgate"]').forEach((el) => {
      el.setAttribute('href', site.researchgate || '#');
    });
  }

  /* ---------------- Home page ---------------- */

  function renderHome(content) {
    if (!document.getElementById('homePage')) return;
    const home = content.home;

    setText('bindHeroKicker', home.kicker);
    setText('bindHeroName', home.name);
    setText('bindHeroTagline', home.tagline);
    setText('bindHeroIntro', home.intro);

    const portraitImg = document.getElementById('portraitImg');
    if (portraitImg && content.site.profilePhoto) {
      portraitImg.setAttribute('src', content.site.profilePhoto);
    }

    // Highlights
    const highlightsGrid = document.getElementById('highlightsGrid');
    if (highlightsGrid) {
      highlightsGrid.innerHTML = home.highlights.map((h, i) => {
        const isNumeric = /^\d+%?$/.test(h.display);
        const delayClass = i === 0 ? '' : i <= 3 ? ` reveal--delay-${i}` : '';
        if (isNumeric) {
          const suffix = h.display.endsWith('%') ? '%' : '';
          const num = parseInt(h.display, 10);
          return `<div class="highlight reveal${delayClass}">
            <span class="highlight__number" data-count-to="${num}" data-suffix="${suffix}">0${suffix}</span>
            <p class="highlight__label">${h.label}</p>
          </div>`;
        }
        return `<div class="highlight highlight--text reveal${delayClass}">
          <span class="highlight__phrase">${h.display}</span>
          <p class="highlight__label">${h.label}</p>
        </div>`;
      }).join('');
    }

    // Services teaser
    const teaser = document.getElementById('servicesTeaserList');
    if (teaser) {
      teaser.innerHTML = content.services.map((s, i) => {
        const delayClass = (i % 3 === 1) ? ' reveal--delay-1' : (i % 3 === 2) ? ' reveal--delay-2' : '';
        return `
        <a href="services.html" class="service-row reveal${delayClass}">
          <span class="service-row__icon" aria-hidden="true">${iconMarkup(s.iconSvg)}</span>
          <span class="service-row__body">
            <span class="service-row__title">${s.title}</span>
            <span class="service-row__desc">${s.description}</span>
          </span>
          <span class="service-row__arrow" aria-hidden="true"></span>
        </a>
      `;
      }).join('');
    }

    // Featured work (shares the portfolio list)
    const workGrid = document.getElementById('workGrid');
    if (workGrid) {
      workGrid.innerHTML = content.portfolio.map((p, i) => {
        const variant = i % 2 === 0 ? 'a' : 'b';
        const delayClass = (i % 3 === 1) ? ' reveal--delay-1' : (i % 3 === 2) ? ' reveal--delay-2' : '';
        const thumb = p.image
          ? `<img src="${p.image}" alt="${p.title}" class="work-card__img">`
          : iconMarkup(p.iconSvg);
        return `<div class="work-card reveal${delayClass}">
          <div class="work-card__thumb work-card__thumb--${variant}">${thumb}</div>
          <p class="work-card__tag">Sample project</p>
          <h3 class="work-card__title">${p.title}</h3>
        </div>`;
      }).join('');
    }
  }

  /* ---------------- Services page ---------------- */

  function renderServicesPage(content) {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    grid.innerHTML = content.services.map((s, i) => {
      const delayClass = (i % 4 === 1) ? ' reveal--delay-1' : (i % 4 === 2) ? ' reveal--delay-2' : (i % 4 === 3) ? ' reveal--delay-3' : '';
      return `
      <div class="service-card reveal${delayClass}">
        <span class="service-card__icon" aria-hidden="true">${iconMarkup(s.iconSvg)}</span>
        <h3 class="service-card__title">${s.title}</h3>
        <p class="service-card__desc">${s.description}</p>
        ${s.price ? `<p class="service-card__price">${s.price}</p>` : ''}
      </div>
    `;
    }).join('');
  }

  /* ---------------- Portfolio page ---------------- */

  function renderPortfolioPage(content) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    setText('bindPortfolioIntro', content.portfolioPage.intro);

    grid.innerHTML = content.portfolio.map((p, i) => {
      const variant = i % 2 === 0 ? 'a' : 'b';
      const thumb = p.image
        ? `<img src="${p.image}" alt="${p.title}" class="portfolio-card__img">`
        : iconMarkup(p.iconSvg);
      return `<button class="portfolio-card reveal" data-category="${p.category}"
          data-title="${p.title.replace(/"/g, '&quot;')}"
          data-desc="${p.desc.replace(/"/g, '&quot;')}"
          data-tag="${p.tag.replace(/"/g, '&quot;')}"
          data-image="${p.image || ''}">
          <span class="portfolio-card__thumb portfolio-card__thumb--${variant}">${thumb}</span>
          <span class="portfolio-card__body">
            <span class="portfolio-card__tag">${p.tag}</span>
            <span class="portfolio-card__title">${p.title}</span>
            <span class="portfolio-card__desc">${p.desc}</span>
          </span>
        </button>`;
    }).join('');
  }

  /* ---------------- About page ---------------- */

  function renderAboutPage(content) {
    const storyText = document.getElementById('storyText');
    if (!storyText) return;
    const about = content.about;

    storyText.innerHTML = about.storyParagraphs.map((p) => `<p>${p}</p>`).join('');
    setText('bindMission', about.mission);

    const timelineList = document.getElementById('timelineList');
    if (timelineList) {
      timelineList.innerHTML = about.timeline.map((t) => `
        <div class="timeline__item reveal">
          <span class="timeline__dot"></span>
          <div class="timeline__content">
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
          </div>
        </div>
      `).join('');
    }

    const skillsList = document.getElementById('skillsList');
    if (skillsList) {
      skillsList.innerHTML = about.skills.map((s) => `
        <div class="skill reveal">
          <div class="skill__head">
            <span class="skill__name">${s.name}</span>
            <span class="skill__value" data-value="${s.value}">0%</span>
          </div>
          <div class="skill__track"><div class="skill__fill" data-fill="${s.value}"></div></div>
        </div>
      `).join('');
    }

    const awardsList = document.getElementById('awardsList');
    if (awardsList) {
      if (!about.awards || about.awards.length === 0) {
        awardsList.innerHTML = `<p class="awards__empty reveal">Awards and achievements will appear here once added through the Admin Panel.</p>`;
      } else {
        awardsList.innerHTML = about.awards.map((a) => `
          <div class="award-card reveal">
            <h3 class="award-card__title">${a.title}</h3>
            ${a.year ? `<p class="award-card__year">${a.year}</p>` : ''}
            ${a.description ? `<p class="award-card__desc">${a.description}</p>` : ''}
          </div>
        `).join('');
      }
    }
  }

  /* ---------------- Contact page ---------------- */

  function renderContactPage(content) {
    const inviteEl = document.getElementById('bindContactInvite');
    if (!inviteEl) return;
    const site = content.site;

    setText('bindContactInvite', content.contact.inviteLine);

    const emailLink = document.getElementById('bindContactEmailLink');
    if (emailLink) {
      emailLink.setAttribute('href', 'mailto:' + site.email);
      setText('bindContactEmailText', site.email);
    }

    const waLink = document.getElementById('bindContactWhatsappLink');
    if (waLink) {
      const digits = (site.whatsapp || '').replace(/\D/g, '');
      const intl = digits.startsWith('0') ? '92' + digits.slice(1) : digits;
      waLink.setAttribute('href', 'https://wa.me/' + intl);
      setText('bindContactWhatsappText', site.whatsappDisplay || site.whatsapp);
    }

    const projectSelect = document.getElementById('fieldProject');
    if (projectSelect) {
      const options = content.services.map((s) => `<option value="${s.id}">${s.title}</option>`).join('');
      projectSelect.innerHTML = `<option value="" disabled selected>Select a project type</option>${options}<option value="other">Other</option>`;
    }
  }

  async function renderAll() {
    const content = await window.SJStore.getContent();
    await window.SJStore.applyTheme();
    renderSiteWide(content);
    renderHome(content);
    renderServicesPage(content);
    renderPortfolioPage(content);
    renderAboutPage(content);
    renderContactPage(content);
  }

  window.SJRender = { renderAll };
})();
