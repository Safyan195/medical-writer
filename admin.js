/* ============================================================
   Safyan Javed Portfolio — Admin Panel logic
   ============================================================ */

(function () {
  let content = null;
  let activeThemeName = 'charcoal-orange';

  document.addEventListener('DOMContentLoaded', async () => {
    await showDashboard();
    initSidebarNav();
  });

  async function showDashboard() {
    content = await window.SJStore.getContent();
    activeThemeName = await window.SJStore.getThemeName();
    window.SJStore.applyThemeByName(activeThemeName);
    renderAllPanels();
  }

  function renderAllPanels() {
    renderDashboard();
    renderHomePanel();
    renderServicesPanel();
    renderPortfolioPanel();
    renderAwardsPanel();
    renderAboutPanel();
    renderContactPanel();
    renderImagesPanel();
    renderThemePanel();
    initBackupControls();
  }

  /* ---------------- Sidebar navigation ---------------- */

  function initSidebarNav() {
    const items = document.querySelectorAll('.admin-nav__item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        items.forEach((i) => i.classList.remove('is-active'));
        item.classList.add('is-active');
        const target = item.getAttribute('data-panel');
        document.querySelectorAll('.admin-panel').forEach((panel) => {
          panel.classList.toggle('is-active', panel.getAttribute('data-panel') === target);
        });
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      });
    });
  }

  /* ---------------- Toast ---------------- */

  let toastTimer = null;
  function toast(message) {
    const el = document.getElementById('adminToast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
  }

  function persist(message) {
    window.SJStore.setContent(content);
    toast(message || 'Saved \u2014 live everywhere.');
  }

  /* ---------------- Dashboard ---------------- */

  function renderDashboard() {
    const el = document.getElementById('dashboardStats');
    el.innerHTML = `
      <div class="admin-stat"><span class="admin-stat__number">${content.services.length}</span><p class="admin-stat__label">Services listed</p></div>
      <div class="admin-stat"><span class="admin-stat__number">${content.portfolio.length}</span><p class="admin-stat__label">Portfolio projects</p></div>
      <div class="admin-stat"><span class="admin-stat__number">${content.about.awards.length}</span><p class="admin-stat__label">Awards added</p></div>
      <div class="admin-stat"><span class="admin-stat__number">${window.SJStore.THEMES[activeThemeName].label}</span><p class="admin-stat__label">Active theme</p></div>
    `;
  }

  /* ---------------- Home Page panel ---------------- */

  function renderHomePanel() {
    document.getElementById('homeKicker').value = content.home.kicker;
    document.getElementById('homeName').value = content.home.name;
    document.getElementById('homeTagline').value = content.home.tagline;
    document.getElementById('homeIntro').value = content.home.intro;

    const list = document.getElementById('highlightsList');
    list.innerHTML = '';
    content.home.highlights.forEach((h, i) => {
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <input type="text" data-field="display" placeholder="Value (e.g. 4, 100%, Pharm-D)" value="${escapeAttr(h.display)}" style="max-width:180px">
        <input type="text" data-field="label" placeholder="Label" value="${escapeAttr(h.label)}">
      `;
      row.querySelector('[data-field="display"]').addEventListener('input', (e) => { content.home.highlights[i].display = e.target.value; });
      row.querySelector('[data-field="label"]').addEventListener('input', (e) => { content.home.highlights[i].label = e.target.value; });
      list.appendChild(row);
    });

    document.getElementById('saveHomeBtn').onclick = () => {
      content.home.kicker = document.getElementById('homeKicker').value;
      content.home.name = document.getElementById('homeName').value;
      content.home.tagline = document.getElementById('homeTagline').value;
      content.home.intro = document.getElementById('homeIntro').value;
      persist('Home page saved.');
      renderDashboard();
    };
  }

  /* ---------------- Services panel ---------------- */

  function renderServicesPanel() {
    const list = document.getElementById('servicesList');
    list.innerHTML = '';
    content.services.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'admin-card';
      card.innerHTML = `
        <div class="form-field"><label>Title</label><input type="text" data-field="title" value="${escapeAttr(s.title)}"></div>
        <div class="form-field"><label>Description</label><textarea data-field="description" rows="2">${escapeHTML(s.description)}</textarea></div>
        <div class="form-field"><label>Price (optional \u2014 leave blank to hide)</label><input type="text" data-field="price" value="${escapeAttr(s.price || '')}" placeholder="e.g. Starting at $50"></div>
        <div class="admin-card__footer">
          <span></span>
          <button type="button" class="admin-card__delete">Remove Service</button>
        </div>
      `;
      card.querySelector('[data-field="title"]').addEventListener('input', (e) => { content.services[i].title = e.target.value; });
      card.querySelector('[data-field="description"]').addEventListener('input', (e) => { content.services[i].description = e.target.value; });
      card.querySelector('[data-field="price"]').addEventListener('input', (e) => { content.services[i].price = e.target.value; });
      card.querySelector('.admin-card__delete').addEventListener('click', () => {
        content.services.splice(i, 1);
        renderServicesPanel();
      });
      list.appendChild(card);
    });

    document.getElementById('addServiceBtn').onclick = () => {
      content.services.push({
        id: 's' + Date.now(),
        title: 'New Service',
        description: '',
        price: '',
        iconSvg: "<circle cx='24' cy='24' r='14' stroke='currentColor' stroke-width='1.4'/><path d='M24 17v14M17 24h14' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/>"
      });
      renderServicesPanel();
    };

    document.getElementById('saveServicesBtn').onclick = () => {
      persist('Services saved.');
      renderDashboard();
    };
  }

  /* ---------------- Portfolio panel ---------------- */

  function renderPortfolioPanel() {
    const list = document.getElementById('portfolioList');
    list.innerHTML = '';
    const categories = [
      { value: 'scientific', label: 'Scientific Writing' },
      { value: 'literature', label: 'Literature Reviews' },
      { value: 'journalism', label: 'Healthcare Journalism' },
      { value: 'cme', label: 'CME Content' }
    ];

    content.portfolio.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'admin-card';
      const thumbInner = p.image
        ? `<img src="${p.image}" alt="">`
        : `<svg viewBox="0 0 48 48" fill="none">${p.iconSvg}</svg>`;

      card.innerHTML = `
        <div class="admin-card__row">
          <div class="admin-card__thumb">${thumbInner}</div>
          <div class="form-field"><label>Title</label><input type="text" data-field="title" value="${escapeAttr(p.title)}"></div>
        </div>
        <div class="form-field"><label>Description</label><textarea data-field="desc" rows="2">${escapeHTML(p.desc)}</textarea></div>
        <div class="admin-card__row">
          <div class="form-field">
            <label>Category</label>
            <select data-field="category">
              ${categories.map((c) => `<option value="${c.value}" ${c.value === p.category ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-field"><label>Tag shown on card</label><input type="text" data-field="tag" value="${escapeAttr(p.tag)}"></div>
        </div>
        <div class="admin-card__footer">
          <input type="file" accept="image/*" data-field="image">
          <button type="button" class="admin-card__delete">Remove Project</button>
        </div>
      `;

      card.querySelector('[data-field="title"]').addEventListener('input', (e) => { content.portfolio[i].title = e.target.value; });
      card.querySelector('[data-field="desc"]').addEventListener('input', (e) => { content.portfolio[i].desc = e.target.value; });
      card.querySelector('[data-field="category"]').addEventListener('change', (e) => { content.portfolio[i].category = e.target.value; });
      card.querySelector('[data-field="tag"]').addEventListener('input', (e) => { content.portfolio[i].tag = e.target.value; });
      card.querySelector('[data-field="image"]').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await window.SJStore.fileToResizedDataURL(file, 900, 0.82);
        content.portfolio[i].image = dataUrl;
        renderPortfolioPanel();
      });
      card.querySelector('.admin-card__delete').addEventListener('click', () => {
        content.portfolio.splice(i, 1);
        renderPortfolioPanel();
      });
      list.appendChild(card);
    });

    document.getElementById('addProjectBtn').onclick = () => {
      content.portfolio.push({
        id: 'p' + Date.now(),
        category: 'scientific',
        tag: 'Scientific Writing',
        title: 'New Project',
        desc: '',
        image: '',
        iconSvg: "<circle cx='24' cy='24' r='14' stroke='currentColor' stroke-width='1.4'/><path d='M24 17v14M17 24h14' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/>"
      });
      renderPortfolioPanel();
    };

    document.getElementById('savePortfolioBtn').onclick = () => {
      persist('Portfolio saved \u2014 Home page and Portfolio page both updated.');
      renderDashboard();
    };
  }

  /* ---------------- Awards panel ---------------- */

  function renderAwardsPanel() {
    const list = document.getElementById('awardsAdminList');
    list.innerHTML = '';
    content.about.awards.forEach((a, i) => {
      const card = document.createElement('div');
      card.className = 'admin-card';
      card.innerHTML = `
        <div class="admin-card__row">
          <div class="form-field"><label>Title</label><input type="text" data-field="title" value="${escapeAttr(a.title)}"></div>
          <div class="form-field" style="max-width:120px"><label>Year</label><input type="text" data-field="year" value="${escapeAttr(a.year || '')}"></div>
        </div>
        <div class="form-field"><label>Description (optional)</label><textarea data-field="description" rows="2">${escapeHTML(a.description || '')}</textarea></div>
        <div class="admin-card__footer">
          <span></span>
          <button type="button" class="admin-card__delete">Remove</button>
        </div>
      `;
      card.querySelector('[data-field="title"]').addEventListener('input', (e) => { content.about.awards[i].title = e.target.value; });
      card.querySelector('[data-field="year"]').addEventListener('input', (e) => { content.about.awards[i].year = e.target.value; });
      card.querySelector('[data-field="description"]').addEventListener('input', (e) => { content.about.awards[i].description = e.target.value; });
      card.querySelector('.admin-card__delete').addEventListener('click', () => {
        content.about.awards.splice(i, 1);
        renderAwardsPanel();
      });
      list.appendChild(card);
    });

    document.getElementById('addAwardBtn').onclick = () => {
      content.about.awards.push({ title: 'New Award', year: '', description: '' });
      renderAwardsPanel();
    };

    document.getElementById('saveAwardsBtn').onclick = () => {
      persist('Awards saved.');
      renderDashboard();
    };
  }

  /* ---------------- About panel ---------------- */

  function renderAboutPanel() {
    const storyList = document.getElementById('storyList');
    storyList.innerHTML = '';
    content.about.storyParagraphs.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <textarea rows="2" data-field="p">${escapeHTML(p)}</textarea>
        <button type="button" class="admin-row__remove" aria-label="Remove paragraph">&times;</button>
      `;
      row.querySelector('textarea').addEventListener('input', (e) => { content.about.storyParagraphs[i] = e.target.value; });
      row.querySelector('.admin-row__remove').addEventListener('click', () => {
        content.about.storyParagraphs.splice(i, 1);
        renderAboutPanel();
      });
      storyList.appendChild(row);
    });

    document.getElementById('aboutMission').value = content.about.mission;

    const timelineList = document.getElementById('timelineAdminList');
    timelineList.innerHTML = '';
    content.about.timeline.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <input type="text" data-field="title" placeholder="Milestone title" value="${escapeAttr(t.title)}">
        <input type="text" data-field="desc" placeholder="Short description" value="${escapeAttr(t.desc)}">
        <button type="button" class="admin-row__remove" aria-label="Remove milestone">&times;</button>
      `;
      row.querySelector('[data-field="title"]').addEventListener('input', (e) => { content.about.timeline[i].title = e.target.value; });
      row.querySelector('[data-field="desc"]').addEventListener('input', (e) => { content.about.timeline[i].desc = e.target.value; });
      row.querySelector('.admin-row__remove').addEventListener('click', () => {
        content.about.timeline.splice(i, 1);
        renderAboutPanel();
      });
      timelineList.appendChild(row);
    });

    const skillsList = document.getElementById('skillsAdminList');
    skillsList.innerHTML = '';
    content.about.skills.forEach((s, i) => {
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <input type="text" data-field="name" placeholder="Skill name" value="${escapeAttr(s.name)}">
        <input type="number" data-field="value" min="0" max="100" value="${s.value}" style="max-width:90px">
        <button type="button" class="admin-row__remove" aria-label="Remove skill">&times;</button>
      `;
      row.querySelector('[data-field="name"]').addEventListener('input', (e) => { content.about.skills[i].name = e.target.value; });
      row.querySelector('[data-field="value"]').addEventListener('input', (e) => { content.about.skills[i].value = Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)); });
      row.querySelector('.admin-row__remove').addEventListener('click', () => {
        content.about.skills.splice(i, 1);
        renderAboutPanel();
      });
      skillsList.appendChild(row);
    });

    document.getElementById('addParagraphBtn').onclick = () => {
      content.about.storyParagraphs.push('');
      renderAboutPanel();
    };
    document.getElementById('addTimelineBtn').onclick = () => {
      content.about.timeline.push({ title: 'New Milestone', desc: '' });
      renderAboutPanel();
    };
    document.getElementById('addSkillBtn').onclick = () => {
      content.about.skills.push({ name: 'New Skill', value: 75 });
      renderAboutPanel();
    };

    document.getElementById('saveAboutBtn').onclick = () => {
      content.about.mission = document.getElementById('aboutMission').value;
      persist('About page saved.');
      renderDashboard();
    };
  }

  /* ---------------- Contact panel ---------------- */

  function renderContactPanel() {
    document.getElementById('contactEmail').value = content.site.email;
    document.getElementById('contactWhatsapp').value = content.site.whatsapp;
    document.getElementById('contactWhatsappDisplay').value = content.site.whatsappDisplay;
    document.getElementById('contactLinkedin').value = content.site.linkedin;
    document.getElementById('contactResearchgate').value = content.site.researchgate;
    document.getElementById('contactInvite').value = content.contact.inviteLine;
    document.getElementById('contactWeb3formsKey').value = content.site.web3formsKey || '';

    document.getElementById('saveContactBtn').onclick = () => {
      content.site.email = document.getElementById('contactEmail').value.trim();
      content.site.whatsapp = document.getElementById('contactWhatsapp').value.trim();
      content.site.whatsappDisplay = document.getElementById('contactWhatsappDisplay').value.trim();
      content.site.linkedin = document.getElementById('contactLinkedin').value.trim();
      content.site.researchgate = document.getElementById('contactResearchgate').value.trim();
      content.contact.inviteLine = document.getElementById('contactInvite').value;
      content.site.web3formsKey = document.getElementById('contactWeb3formsKey').value.trim();
      persist('Contact info saved.');
    };
  }

  /* ---------------- Images panel ---------------- */

  function renderImagesPanel() {
    document.getElementById('profilePreview').src = content.site.profilePhoto;

    document.getElementById('profileUpload').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const dataUrl = await window.SJStore.fileToResizedDataURL(file, 800, 0.85);
      content.site.profilePhoto = dataUrl;
      document.getElementById('profilePreview').src = dataUrl;
      persist('Profile photo updated everywhere.');
    };
  }

  /* ---------------- Theme panel ---------------- */

  function renderThemePanel() {
    const grid = document.getElementById('themeGrid');
    const themes = window.SJStore.THEMES;

    grid.innerHTML = Object.keys(themes).map((key) => {
      const t = themes[key];
      const isActive = key === activeThemeName;
      return `
        <button type="button" class="admin-theme-card ${isActive ? 'is-active' : ''}" data-theme="${key}">
          <div class="admin-theme-card__swatches">
            ${t.swatch.map((c) => `<span class="admin-theme-card__swatch" style="background:${c}"></span>`).join('')}
          </div>
          <p class="admin-theme-card__label">${t.label}</p>
          ${isActive ? '<span class="admin-theme-card__active-tag">Currently active</span>' : ''}
        </button>
      `;
    }).join('');

    grid.querySelectorAll('.admin-theme-card').forEach((card) => {
      card.addEventListener('click', () => {
        activeThemeName = card.getAttribute('data-theme');
        window.SJStore.setThemeName(activeThemeName);
        toast(`Theme changed to ${themes[activeThemeName].label} \u2014 live in this browser. Publish to make it live everywhere.`);
        renderThemePanel();
        renderDashboard();
      });
    });
  }

  /* ---------------- Publish & Backup ---------------- */

  function initBackupControls() {
    const publishBtn = document.getElementById('publishBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importFile = document.getElementById('importFile');
    const status = document.getElementById('backupStatus');

    if (publishBtn) {
      publishBtn.onclick = () => {
        const payload = { theme: activeThemeName, content: content };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast('content.json downloaded \u2014 upload it to your data/ folder on GitHub to publish.');
      };
    }

    exportBtn.onclick = () => {
      const payload = {
        type: 'safyan-portfolio-backup',
        exportedAt: new Date().toISOString(),
        theme: activeThemeName,
        content: content
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `safyan-portfolio-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('Backup file downloaded.');
    };

    importFile.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onerror = () => {
        status.style.color = 'var(--orange-soft)';
        status.textContent = 'Could not read that file.';
      };
      reader.onload = () => {
        let parsed;
        try {
          parsed = JSON.parse(reader.result);
        } catch (err) {
          status.style.color = 'var(--orange-soft)';
          status.textContent = 'That file is not a valid backup (couldn\u2019t be read as JSON).';
          importFile.value = '';
          return;
        }

        if (!parsed || typeof parsed.content !== 'object') {
          status.style.color = 'var(--orange-soft)';
          status.textContent = 'That file doesn\u2019t look like a portfolio backup.';
          importFile.value = '';
          return;
        }

        const confirmed = window.confirm(
          'Importing will replace all current content on this device with the content from this backup file. Continue?'
        );
        if (!confirmed) {
          importFile.value = '';
          return;
        }

        content = parsed.content;
        window.SJStore.setContent(content);
        if (parsed.theme && window.SJStore.THEMES[parsed.theme]) {
          activeThemeName = parsed.theme;
          window.SJStore.setThemeName(parsed.theme);
        }

        renderAllPanels();
        status.style.color = 'var(--blue-soft)';
        status.textContent = 'Backup imported \u2014 content restored and live everywhere on this browser.';
        toast('Backup imported successfully.');
        importFile.value = '';
      };
      reader.readAsText(file);
    };
  }

  /* ---------------- Helpers ---------------- */

  function escapeAttr(str) {
    return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function escapeHTML(str) {
    return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
