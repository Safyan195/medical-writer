/* ============================================================
   Safyan Javed Portfolio — Content Store
   Single source of truth for all editable site content, themes,
   and admin auth. Persists to localStorage so the Admin Panel
   can update the live site instantly (same browser/device).
   ============================================================ */

(function (global) {
  const CONTENT_KEY = 'sj_site_content_v1';
  const THEME_KEY = 'sj_site_theme_v1';

  /* ---------------- Default content ---------------- */

  const DEFAULT_CONTENT = {
    site: {
      email: 'safyanjaved195@gmail.com',
      whatsapp: '03278515816',
      whatsappDisplay: '0327 8515816',
      linkedin: '#',
      researchgate: '#',
      profilePhoto: 'assets/images/safyan-headshot.jpg',
      web3formsKey: ''
    },
    home: {
      kicker: 'Final Year Pharm-D Student & Medical Writer',
      name: 'Safyan Javed',
      tagline: 'Turning complex science into clear, understandable stories.',
      intro: "I translate dense scientific, medical, and healthcare information into content that reads clearly and holds up to scrutiny \u2014 built on a pharmacy education and a habit of writing for the reader first.",
      highlights: [
        { display: '4', label: 'Core Writing Services' },
        { display: '1', label: 'Clear Communication Goal' },
        { display: '100%', label: 'Focus on Clarity & Accuracy' },
        { display: 'Pharm-D', label: 'Professional Foundation' }
      ]
    },
    servicesIntro: {
      heading: 'How I can help',
      sub: 'Four ways to turn complicated science into content people actually understand.'
    },
    services: [
      {
        id: 's1',
        title: 'Scientific Writing',
        description: 'Clear, structured, and evidence-based scientific content that communicates complex medical and pharmaceutical information accurately and in an easy-to-understand way.',
        price: '',
        iconSvg: "<path d='M14 6h20v36H14z' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round'/><path d='M19 15h10M19 22h10M19 29h6' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>"
      },
      {
        id: 's2',
        title: 'Literature Reviews and Summaries',
        description: 'Research-focused literature reviews and concise summaries that analyze and synthesize scientific evidence, helping readers understand key findings, concepts, and conclusions without unnecessary complexity.',
        price: '',
        iconSvg: "<circle cx='21' cy='21' r='12' stroke='currentColor' stroke-width='1.5'/><path d='M30 30l8 8' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>"
      },
      {
        id: 's3',
        title: 'Healthcare Journalism and Copywriting',
        description: 'Engaging, reader-friendly healthcare content that transforms complex medical and health topics into clear and accessible articles, copy, and educational communication while maintaining accuracy and credibility.',
        price: '',
        iconSvg: "<path d='M8 12h32v24H8z' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round'/><path d='M8 18h32M16 12v6' stroke='currentColor' stroke-width='1.5'/>"
      },
      {
        id: 's4',
        title: 'Continuing Medical Education (CME)',
        description: 'Clear and structured educational content for continuing medical education, designed to communicate relevant medical and healthcare knowledge effectively to professional audiences.',
        price: '',
        iconSvg: "<path d='M24 6l16 8v14c0 8-6.5 12.5-16 14-9.5-1.5-16-6-16-14V14z' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round'/><path d='M17 24l5 5 9-11' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>"
      }
    ],
    portfolio: [
      { id: 'p1', category: 'scientific', tag: 'Scientific Writing', title: 'Mechanism-of-Action Overview', desc: "Explained a drug's mechanism of action for a mixed clinical and academic readership.", image: '', iconSvg: "<path d='M14 6h20v36H14z' stroke='currentColor' stroke-width='1.4' stroke-linejoin='round'/><path d='M19 15h10M19 22h10M19 29h6' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/>" },
      { id: 'p2', category: 'scientific', tag: 'Scientific Writing', title: 'Clinical Trial Design Explainer', desc: "Broke down a clinical trial's design and endpoints into a structured, accurate summary.", image: '', iconSvg: "<path d='M9 24h8l4-14 6 28 4-14h8' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/>" },
      { id: 'p3', category: 'literature', tag: 'Literature Reviews', title: 'Systematic Review Summary', desc: 'Synthesized findings across multiple studies into one organized, readable summary.', image: '', iconSvg: "<circle cx='20' cy='20' r='11' stroke='currentColor' stroke-width='1.4'/><path d='M28 28l9 9' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/>" },
      { id: 'p4', category: 'literature', tag: 'Literature Reviews', title: 'Comparative Drug Class Review', desc: 'Compared outcomes and safety data across a therapeutic drug class in plain, structured language.', image: '', iconSvg: "<rect x='8' y='10' width='14' height='28' rx='2' stroke='currentColor' stroke-width='1.4'/><rect x='26' y='16' width='14' height='22' rx='2' stroke='currentColor' stroke-width='1.4'/>" },
      { id: 'p5', category: 'journalism', tag: 'Healthcare Journalism', title: 'Patient-Friendly Condition Guide', desc: 'Turned a complex condition overview into an accessible, reassuring guide for patients.', image: '', iconSvg: "<path d='M24 8c-7 0-13 5.5-13 14 0 6 4 9 4 12h18c0-3 4-6 4-12 0-8.5-6-14-13-14z' stroke='currentColor' stroke-width='1.4' stroke-linejoin='round'/><path d='M20 40h8' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/>" },
      { id: 'p6', category: 'journalism', tag: 'Healthcare Journalism', title: 'Health News Explainer', desc: 'Covered an emerging healthcare topic for a general audience without oversimplifying the science.', image: '', iconSvg: "<path d='M8 12h32l-4 24H12z' stroke='currentColor' stroke-width='1.4' stroke-linejoin='round'/><path d='M17 20h14' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/>" },
      { id: 'p7', category: 'cme', tag: 'CME Content', title: 'CME Module: Chronic Disease Management', desc: 'Developed a clinician-facing learning module on updated chronic disease management guidance.', image: '', iconSvg: "<path d='M24 6l16 8v14c0 8-6.5 12.5-16 14-9.5-1.5-16-6-16-14V14z' stroke='currentColor' stroke-width='1.4' stroke-linejoin='round'/><path d='M17 24l5 5 9-11' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/>" },
      { id: 'p8', category: 'cme', tag: 'CME Content', title: 'CME Case-Based Learning Unit', desc: 'Wrote a case-based CME unit walking clinicians through diagnosis and treatment decisions.', image: '', iconSvg: "<path d='M24 5l3.6 8.2 8.9.9-6.7 5.9 2 8.7L24 24l-7.8 4.7 2-8.7-6.7-5.9 8.9-.9z' stroke='currentColor' stroke-width='1.3' stroke-linejoin='round'/><path d='M24 30v13' stroke='currentColor' stroke-width='1.4' stroke-linecap='round'/>" }
    ],
    portfolioPage: {
      intro: "A working sample set across scientific writing, literature reviews, healthcare journalism, and CME content. Thumbnails and descriptions below are portfolio placeholders, ready to be replaced with published work through the Admin Panel."
    },
    about: {
      storyParagraphs: [
        "I'm Safyan Javed, a Final Year Pharm-D student and aspiring medical & scientific writer. I've developed a strong interest in medical and scientific communication, particularly in transforming complex scientific, medical, and healthcare information into clear, accurate, and easy-to-understand language.",
        "My focus is on making scientific information accessible while maintaining its accuracy, meaning, and professional quality.",
        "What makes me different is that I don't simply rewrite scientific information. I focus on understanding complex evidence and communicating it in a way that is clear, structured, engaging, and appropriate for the intended audience."
      ],
      mission: 'My mission is to help healthcare, scientific, and medical audiences understand complex information through high-quality, evidence-based communication.',
      timeline: [
        { title: 'Started Pharm-D Journey', desc: 'Began Pharm-D studies, building a foundation in pharmacology, therapeutics, and clinical knowledge.' },
        { title: 'Developed Interest in Medical & Scientific Communication', desc: 'Found a growing interest in translating scientific and healthcare information into clear, accessible language.' },
        { title: 'Started Exploring Scientific Writing', desc: 'Began writing structured, evidence-based scientific content with attention to accuracy and terminology.' },
        { title: 'Developed Skills in Literature Reviews & Research Summaries', desc: 'Built the skills to analyze and synthesize research literature into organized, easy-to-understand summaries.' },
        { title: 'Expanded Into Healthcare Journalism, Copywriting & CME Content', desc: 'Extended this focus into healthcare journalism, copywriting, and CME content for professional audiences.' }
      ],
      skills: [
        { name: 'Scientific Writing', value: 90 },
        { name: 'Literature Reviews & Summaries', value: 92 },
        { name: 'Healthcare Journalism & Copywriting', value: 85 },
        { name: 'Medical & Scientific Communication', value: 95 },
        { name: 'Continuing Medical Education (CME) Content', value: 80 },
        { name: 'Simplifying Complex Scientific Information', value: 96 }
      ],
      awards: []
    },
    contact: {
      inviteLine: "Have a scientific writing, literature review, healthcare journalism, or CME project in mind? Reach out and let's talk about it."
    }
  };

  /* ---------------- Themes ---------------- */

  const THEMES = {
    'charcoal-orange': {
      label: 'Charcoal Orange',
      swatch: ['#101216', '#ff7a3d', '#3fc6ff'],
      vars: {
        '--bg-0': '#101216', '--bg-1': '#16191f', '--bg-2': '#1c2028',
        '--line': 'rgba(242,243,245,0.10)', '--line-strong': 'rgba(242,243,245,0.18)',
        '--text-0': '#f2f3f5', '--text-1': '#b9bec8', '--text-2': '#7d838f',
        '--orange': '#ff7a3d', '--orange-soft': '#ff9a63',
        '--blue': '#3fc6ff', '--blue-soft': '#7ad8ff',
        '--orange-glow': 'rgba(255,122,61,0.35)', '--blue-glow': 'rgba(63,198,255,0.32)'
      }
    },
    'midnight-blue': {
      label: 'Midnight Blue',
      swatch: ['#0b0f1a', '#8b7bff', '#4da3ff'],
      vars: {
        '--bg-0': '#0b0f1a', '--bg-1': '#101627', '--bg-2': '#151d33',
        '--line': 'rgba(226,232,255,0.10)', '--line-strong': 'rgba(226,232,255,0.18)',
        '--text-0': '#eef1fb', '--text-1': '#aeb7d6', '--text-2': '#7680a3',
        '--orange': '#8b7bff', '--orange-soft': '#b3a8ff',
        '--blue': '#4da3ff', '--blue-soft': '#8cc4ff',
        '--orange-glow': 'rgba(139,123,255,0.35)', '--blue-glow': 'rgba(77,163,255,0.32)'
      }
    },
    'slate-purple': {
      label: 'Slate Purple',
      swatch: ['#121016', '#ff5fa8', '#9b6bff'],
      vars: {
        '--bg-0': '#121016', '--bg-1': '#181420', '--bg-2': '#1e1828',
        '--line': 'rgba(243,240,247,0.10)', '--line-strong': 'rgba(243,240,247,0.18)',
        '--text-0': '#f3f0f7', '--text-1': '#bdb3c9', '--text-2': '#8a7f97',
        '--orange': '#ff5fa8', '--orange-soft': '#ff8cc0',
        '--blue': '#9b6bff', '--blue-soft': '#bd9bff',
        '--orange-glow': 'rgba(255,95,168,0.32)', '--blue-glow': 'rgba(155,107,255,0.32)'
      }
    },
    'emerald-dark': {
      label: 'Emerald Dark',
      swatch: ['#0d1512', '#f2b134', '#2ee6a6'],
      vars: {
        '--bg-0': '#0d1512', '--bg-1': '#121c18', '--bg-2': '#17251f',
        '--line': 'rgba(238,246,241,0.10)', '--line-strong': 'rgba(238,246,241,0.18)',
        '--text-0': '#eef6f1', '--text-1': '#aec4b8', '--text-2': '#749283',
        '--orange': '#f2b134', '--orange-soft': '#f7c869',
        '--blue': '#2ee6a6', '--blue-soft': '#7af0c4',
        '--orange-glow': 'rgba(242,177,52,0.30)', '--blue-glow': 'rgba(46,230,166,0.30)'
      }
    }
  };


  /* ---------------- Deep merge (so new default fields survive old saved data) ---------------- */

  function deepMerge(base, override) {
    if (Array.isArray(base)) return override !== undefined ? override : base;
    if (typeof base !== 'object' || base === null) return override !== undefined ? override : base;
    const result = {};
    for (const key of Object.keys(base)) {
      result[key] = deepMerge(base[key], override ? override[key] : undefined);
    }
    if (override) {
      for (const key of Object.keys(override)) {
        if (!(key in result)) result[key] = override[key];
      }
    }
    return result;
  }

  /* ---------------- Published content (data/content.json) ----------------
     This is the file every visitor's browser loads — it's what makes the
     site's content visible to everyone, not just this browser. Publishing
     from the Admin Panel downloads a fresh copy of this file for you to
     upload to your hosting, replacing the old one. ---------------------- */

  let publishedCache = null;

  async function fetchPublished() {
    if (publishedCache) return publishedCache;
    try {
      const res = await fetch('data/content.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('content.json not found');
      const json = await res.json();
      publishedCache = {
        theme: json.theme || 'charcoal-orange',
        content: json.content || DEFAULT_CONTENT
      };
    } catch (e) {
      // Falls back to the built-in defaults. This is expected if you're
      // opening the files directly (file://) rather than through a server —
      // browsers block fetching local files that way. It works normally
      // once hosted on GitHub Pages or any real web server.
      publishedCache = { theme: 'charcoal-orange', content: DEFAULT_CONTENT };
    }
    return publishedCache;
  }

  /* ---------------- Content API ---------------- */

  async function getContent() {
    const published = await fetchPublished();
    try {
      const raw = localStorage.getItem(CONTENT_KEY);
      if (!raw) return deepMerge(published.content, undefined);
      return deepMerge(published.content, JSON.parse(raw));
    } catch (e) {
      return deepMerge(published.content, undefined);
    }
  }

  function setContent(content) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  }

  function resetContent() {
    localStorage.removeItem(CONTENT_KEY);
  }

  /* ---------------- Theme API ---------------- */

  async function getThemeName() {
    const local = localStorage.getItem(THEME_KEY);
    if (local) return local;
    const published = await fetchPublished();
    return published.theme;
  }

  function setThemeName(name) {
    localStorage.setItem(THEME_KEY, name);
    applyThemeByName(name);
  }

  function applyThemeByName(name) {
    const theme = THEMES[name] || THEMES['charcoal-orange'];
    const root = document.documentElement;
    Object.keys(theme.vars).forEach((key) => {
      root.style.setProperty(key, theme.vars[key]);
    });
  }

  async function applyTheme() {
    const name = await getThemeName();
    applyThemeByName(name);
  }

  /* ---------------- Image helper: resize + compress an uploaded file to a dataURL ---------------- */

  function fileToResizedDataURL(file, maxDim, quality) {
    maxDim = maxDim || 900;
    quality = quality || 0.82;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Could not load image'));
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  global.SJStore = {
    getContent, setContent, resetContent,
    getThemeName, setThemeName, applyTheme, applyThemeByName, THEMES,
    fileToResizedDataURL,
    CONTENT_KEY, THEME_KEY
  };
})(window);
