/* ============================================================
   app.js - SnipeDin LinkedIn Job URL Builder
   Pure vanilla JS, zero dependencies.
   ============================================================ */

'use strict';

// ============================================================
// STATE
// ============================================================
const state = {
  keywords:   '',
  location:   '',
  timePosted: '',      // single: r600 | r3600 | r86400 | r604800 | r2592000
  sortBy:     '',      // single: DD | R
  workMode:   [],      // multi:  1 | 2 | 3
  jobType:    [],      // multi:  F | P | C | T | I | V
  experience: [],      // multi:  1..6
  easyApply:  false,
  salary:     '',      // single: 40000 | 60000 | …
  currency:   'INR',   // display currency for salary chips
};

// ============================================================
// BUILT-IN TEMPLATES
// ============================================================
const BUILTIN_TEMPLATES = [
  {
    label: '🚀 Node.js Remote',
    state: { keywords: 'Node.js Developer', workMode: ['2'], timePosted: 'r86400', sortBy: 'DD' },
  },
  {
    label: '⚛️ React Frontend',
    state: { keywords: 'React Developer', jobType: ['F'], timePosted: 'r604800', sortBy: 'DD' },
  },
  {
    label: '☁️ AWS Cloud Eng',
    state: { keywords: 'AWS Cloud Engineer', workMode: ['2', '3'], experience: ['4'], timePosted: 'r604800' },
  },
  {
    label: '🐍 Python Fresh',
    state: { keywords: 'Python Developer', timePosted: 'r86400', sortBy: 'DD', easyApply: true },
  },
  {
    label: '🤖 AI / ML Engineer',
    state: { keywords: 'Machine Learning Engineer', workMode: ['2', '3'], experience: ['3', '4'], timePosted: 'r604800', sortBy: 'DD' },
  },
  {
    label: '💼 Product Manager',
    state: { keywords: 'Product Manager', jobType: ['F'], experience: ['3', '4'], timePosted: 'r604800' },
  },
  {
    label: '🎨 UI/UX Designer',
    state: { keywords: 'UI UX Designer', workMode: ['2', '3'], timePosted: 'r604800', sortBy: 'DD' },
  },
  {
    label: '⚡ Past Hour - Any',
    state: { timePosted: 'r3600', sortBy: 'DD' },
  },
  {
    label: '💰 $100k+ Remote',
    state: { workMode: ['2'], salary: '100000', timePosted: 'r604800', sortBy: 'DD' },
  },
  {
    label: '🟢 Easy Apply Today',
    state: { timePosted: 'r86400', easyApply: true, sortBy: 'DD' },
  },
];

// ============================================================
// LABEL MAPS (for summaries)
// ============================================================
const TIME_LABELS = {
  r600:    '⚡ 10 min',
  r3600:   '1h',
  r86400:  '24h',
  r604800: '1 week',
  r2592000:'1 month',
};

// Currency definitions: symbol + display tiers (values are LinkedIn's f_SB2 param buckets)
const CURRENCIES = {
  USD: { symbol: '$',  suffix: 'k', divisor: 1000,    tiers: [40000, 60000, 80000, 100000, 120000, 140000, 160000, 200000] },
  EUR: { symbol: '€',  suffix: 'k', divisor: 1000,    tiers: [40000, 60000, 80000, 100000, 120000, 140000, 160000, 200000] },
  GBP: { symbol: '£',  suffix: 'k', divisor: 1000,    tiers: [40000, 60000, 80000, 100000, 120000, 140000, 160000, 200000] },
  INR: { symbol: '₹',  suffix: 'L', divisor: 10000,    tiers: [30000,40000, 60000, 80000, 100000, 120000, 140000, 160000, 200000] },
  CAD: { symbol: 'C$', suffix: 'k', divisor: 1000,    tiers: [40000, 60000, 80000, 100000, 120000, 140000, 160000, 200000] },
  AUD: { symbol: 'A$', suffix: 'k', divisor: 1000,    tiers: [40000, 60000, 80000, 100000, 120000, 140000, 160000, 200000] },
};

function salaryLabel(value) {
  const c = CURRENCIES[state.currency];
  const display = value / c.divisor;
  const formatted = Number.isInteger(display) ? display : display.toFixed(1).replace(/\.0$/, '');
  return `${c.symbol}${formatted}${c.suffix}+`;
}

// Kept for backward compat with template summaries (dynamic now)
function getSalaryLabels() {
  const labels = {};
  CURRENCIES[state.currency].tiers.forEach(v => { labels[v] = salaryLabel(v); });
  return labels;
}

// ============================================================
// URL BUILDER
// ============================================================
function buildURL() {
  const params = new URLSearchParams();

  if (state.keywords.trim())   params.set('keywords', state.keywords.trim());
  if (state.location.trim())   params.set('location', state.location.trim());
  if (state.timePosted)        params.set('f_TPR', state.timePosted);
  if (state.sortBy)            params.set('sortBy', state.sortBy);
  if (state.workMode.length)   params.set('f_WT', state.workMode.join(','));
  if (state.jobType.length)    params.set('f_JT', state.jobType.join(','));
  if (state.experience.length) params.set('f_E', state.experience.join(','));
  if (state.easyApply)         params.set('f_EA', 'true');
  if (state.salary)            params.set('f_SB2', state.salary);

  const base = 'https://www.linkedin.com/jobs/search/';
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

// ============================================================
// COUNT ACTIVE FILTERS
// ============================================================
function countActiveFilters() {
  let n = 0;
  if (state.keywords.trim())   n++;
  if (state.location.trim())   n++;
  if (state.timePosted)        n++;
  if (state.sortBy)            n++;
  n += state.workMode.length;
  n += state.jobType.length;
  n += state.experience.length;
  if (state.easyApply) n++;
  if (state.salary)    n++;
  return n;
}

// ============================================================
// UPDATE UI (single source of truth render)
// ============================================================
function updateUI() {
  const url = buildURL();

  // URL display + open button
  document.getElementById('urlText').textContent = url;
  document.getElementById('openBtn').href = url;

  // Stats
  const filterCount = countActiveFilters();
  document.getElementById('filterCount').textContent = filterCount;
  document.getElementById('urlLength').textContent = url.length;

  // Sync mobile sticky bar
  const mobileCount = document.getElementById('mobileFilterCount');
  const mobileOpen  = document.getElementById('mobileOpenBtn');
  if (mobileCount) mobileCount.textContent = filterCount;
  if (mobileOpen)  mobileOpen.href = url;

  // Summaries on filter card headers
  setSummary('search',   (state.keywords.trim() || state.location.trim())
                            ? [state.keywords.trim(), state.location.trim()].filter(Boolean).join(', ')
                            : '');
  setSummary('time',     state.timePosted ? TIME_LABELS[state.timePosted] || '' : '');

  // Show inline warning when ⚡ 10 min is selected — mobile can't use hover tooltip
  const hint = document.getElementById('lightningHint');
  if (hint) hint.classList.toggle('visible', state.timePosted === 'r600');
  setSummary('sort',     state.sortBy === 'DD' ? 'Recent' : state.sortBy === 'R' ? 'Relevant' : '');
  setSummary('workmode', state.workMode.length  ? `${state.workMode.length} selected`  : '');
  setSummary('jobtype',  state.jobType.length   ? `${state.jobType.length} selected`   : '');
  setSummary('exp',      state.experience.length ? `${state.experience.length} selected` : '');
  setSummary('easy',     state.easyApply ? 'On' : '');
  setSummary('salary',   state.salary ? (salaryLabel(state.salary) || '') : '');

  // Active card border highlight
  document.querySelectorAll('.filter-card[id^="card-"]').forEach(card => {
    const key = card.id.replace('card-', '');
    card.classList.toggle('has-active', cardIsActive(key));
  });
}

function setSummary(id, text) {
  const el = document.getElementById(`summary-${id}`);
  if (!el) return;
  // Truncate long summaries for display
  const display = text.length > 22 ? text.slice(0, 20) + '…' : text;
  el.textContent = display;
  el.classList.toggle('visible', !!text);
}

function cardIsActive(key) {
  switch (key) {
    case 'search':   return !!(state.keywords.trim() || state.location.trim());
    case 'time':     return !!state.timePosted;
    case 'sort':     return !!state.sortBy;
    case 'workmode': return state.workMode.length > 0;
    case 'jobtype':  return state.jobType.length > 0;
    case 'exp':      return state.experience.length > 0;
    case 'easy':     return state.easyApply;
    case 'salary':   return !!state.salary;
    default:         return false;
  }
}

// ============================================================
// CHIP: SINGLE-SELECT
// ============================================================
function handleSingleChip(btn) {
  const group = btn.dataset.group;
  const value = btn.dataset.value;
  const wasActive = btn.classList.contains('active');

  // Deactivate all siblings
  document.querySelectorAll(`[data-group="${group}"]`)
          .forEach(b => b.classList.remove('active'));

  if (!wasActive) {
    btn.classList.add('active');
    state[group] = value;
  } else {
    state[group] = '';
  }

  updateUI();
}

// ============================================================
// CHIP: MULTI-SELECT
// ============================================================
function handleMultiChip(btn) {
  const group = btn.dataset.group;
  const value = btn.dataset.value;
  const wasActive = btn.classList.contains('active');

  btn.classList.toggle('active', !wasActive);

  if (!wasActive) {
    if (!state[group].includes(value)) state[group].push(value);
  } else {
    state[group] = state[group].filter(v => v !== value);
  }

  updateUI();
}

// ============================================================
// RESET ALL FILTERS
// ============================================================
function resetAll() {
  state.keywords   = '';
  state.location   = '';
  state.timePosted = '';
  state.sortBy     = '';
  state.workMode   = [];
  state.jobType    = [];
  state.experience = [];
  state.easyApply  = false;
  state.salary     = '';
  state.currency   = 'INR';

  // Sync DOM
  document.getElementById('keywords').value = '';
  document.getElementById('location').value = '';
  document.getElementById('easyApply').checked = false;
  document.querySelectorAll('.chip.active').forEach(c => c.classList.remove('active'));
  // Reset currency pills
  document.querySelectorAll('.currency-pill').forEach(p => p.classList.toggle('active', p.dataset.currency === 'INR'));
  renderSalaryChips();

  updateUI();
}

// ============================================================
// APPLY TEMPLATE STATE
// ============================================================
function applyTemplateState(tpl) {
  resetAll();

  state.keywords   = tpl.keywords   || '';
  state.location   = tpl.location   || '';
  state.timePosted = tpl.timePosted || '';
  state.sortBy     = tpl.sortBy     || '';
  state.workMode   = [...(tpl.workMode   || [])];
  state.jobType    = [...(tpl.jobType    || [])];
  state.experience = [...(tpl.experience || [])];
  state.easyApply  = tpl.easyApply  || false;
  state.salary     = tpl.salary     || '';

  // Sync text inputs
  document.getElementById('keywords').value = state.keywords;
  document.getElementById('location').value = state.location;
  document.getElementById('easyApply').checked = state.easyApply;

  // Activate single-select chips
  ['timePosted', 'sortBy', 'salary'].forEach(group => {
    if (state[group]) {
      const btn = document.querySelector(`[data-group="${group}"][data-value="${state[group]}"]`);
      if (btn) btn.classList.add('active');
    }
  });

  // Activate multi-select chips
  ['workMode', 'jobType', 'experience'].forEach(group => {
    state[group].forEach(val => {
      const btn = document.querySelector(`[data-group="${group}"][data-value="${val}"]`);
      if (btn) btn.classList.add('active');
    });
  });

  updateUI();

  // Scroll to top on mobile after applying a template
  if (window.innerWidth < 960) {
    document.querySelector('.preview-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============================================================
// SAVED TEMPLATES (localStorage)
// ============================================================
const STORAGE_KEY = 'snipedin_v1_templates';

function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function putSaved(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function saveTemplate() {
  const nameInput = document.getElementById('templateName');
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.classList.add('field-error');
    nameInput.focus();
    nameInput.placeholder = 'Please enter a name first!';
    setTimeout(() => {
      nameInput.classList.remove('field-error');
      nameInput.placeholder = 'e.g. My remote Node jobs';
    }, 2000);
    return;
  }

  const snapshot = {
    keywords:   state.keywords,
    location:   state.location,
    timePosted: state.timePosted,
    sortBy:     state.sortBy,
    workMode:   [...state.workMode],
    jobType:    [...state.jobType],
    experience: [...state.experience],
    easyApply:  state.easyApply,
    salary:     state.salary,
  };

  const list = getSaved();
  list.push({ name, snapshot, createdAt: Date.now() });
  putSaved(list);

  nameInput.value = '';
  renderSaved();
  updateSavedCount();

  // Visual feedback
  const btn = document.getElementById('saveTemplateBtn');
  const origText = btn.textContent;
  btn.textContent = '✓ Saved!';
  btn.style.cssText = 'background:var(--success);color:#fff;border-color:var(--success);';
  setTimeout(() => {
    btn.textContent = origText;
    btn.style.cssText = '';
  }, 1800);
}

function deleteTemplate(index) {
  const list = getSaved();
  list.splice(index, 1);
  putSaved(list);
  renderSaved();
  updateSavedCount();
}

function clearAllSaved() {
  if (!confirm('Delete all saved templates? This cannot be undone.')) return;
  putSaved([]);
  renderSaved();
  updateSavedCount();
}

function updateSavedCount() {
  document.getElementById('savedCount').textContent = getSaved().length;
}

function renderSaved() {
  const list = getSaved();
  const card        = document.getElementById('savedTemplatesCard');
  const listEl      = document.getElementById('savedTemplatesList');
  const row         = document.getElementById('savedTemplatesRow');
  const chipsEl     = document.getElementById('savedTemplatesChips');

  if (list.length === 0) {
    card.style.display = 'none';
    row.style.display  = 'none';
    return;
  }

  card.style.display = 'block';
  row.style.display  = 'flex';

  // Preview panel list
  listEl.innerHTML = list.map((t, i) => `
    <div class="saved-item" data-index="${i}" role="listitem" tabindex="0" title="Apply: ${escHtml(t.name)}">
      <span class="saved-item-name">${escHtml(t.name)}</span>
      <span class="saved-item-delete" data-del="${i}" role="button" tabindex="0" title="Delete" aria-label="Delete ${escHtml(t.name)}">✕</span>
    </div>
  `).join('');

  // Templates bar chips
  chipsEl.innerHTML = list.map((t, i) => `
    <button class="template-chip saved-chip" data-saved="${i}" title="Apply: ${escHtml(t.name)}">
      📌 ${escHtml(t.name)}
    </button>
  `).join('');

  // Wire events - list items
  listEl.querySelectorAll('.saved-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.dataset.del !== undefined) return;
      const t = getSaved()[parseInt(item.dataset.index)];
      if (t) applyTemplateState(t.snapshot);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (e.target.dataset.del !== undefined) {
          deleteTemplate(parseInt(e.target.dataset.del));
        } else {
          const t = getSaved()[parseInt(item.dataset.index)];
          if (t) applyTemplateState(t.snapshot);
        }
      }
    });
  });

  listEl.querySelectorAll('.saved-item-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteTemplate(parseInt(btn.dataset.del));
    });
  });

  // Wire events - bar chips
  chipsEl.querySelectorAll('[data-saved]').forEach(chip => {
    chip.addEventListener('click', () => {
      const t = getSaved()[parseInt(chip.dataset.saved)];
      if (t) applyTemplateState(t.snapshot);
    });
  });
}

// ============================================================
// HELPER: escape HTML to prevent XSS in template names
// ============================================================
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// COLLAPSIBLE CARDS
// ============================================================
function toggleCard(id) {
  const card   = document.getElementById(`card-${id}`);
  const header = card.querySelector('[data-toggle]');
  if (!card) return;
  const isCollapsed = card.classList.toggle('collapsed');
  if (header) header.setAttribute('aria-expanded', String(!isCollapsed));
}

// ============================================================
// COPY URL
// ============================================================
function copyURL() {
  const url = buildURL();

  const finish = (ok) => {
    const btn  = document.getElementById('copyBtn');
    const text = document.getElementById('copyBtnText');
    if (ok) {
      btn.classList.add('copied');
      text.textContent = '✓ Copied!';
    } else {
      text.textContent = '⚠ Failed';
    }
    setTimeout(() => {
      btn.classList.remove('copied');
      text.textContent = 'Copy URL';
    }, 2200);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(() => finish(true)).catch(() => finish(false));
  } else {
    // Fallback for non-secure contexts (e.g. file://)
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      finish(true);
    } catch {
      finish(false);
    }
    document.body.removeChild(ta);
  }
}

// ============================================================
// RENDER SALARY CHIPS (currency-aware)
// ============================================================
function renderSalaryChips() {
  const container = document.getElementById('salaryChips');
  if (!container) return;
  const tiers = CURRENCIES[state.currency].tiers;
  const currentVal = state.salary;
  container.innerHTML = tiers.map(v => {
    const active = currentVal === String(v) ? ' active' : '';
    return `<button class="chip${active}" data-group="salary" data-value="${v}">${salaryLabel(v)}</button>`;
  }).join('');
  container.querySelectorAll('[data-group="salary"]').forEach(btn => {
    btn.addEventListener('click', () => handleSingleChip(btn));
  });
}

// ============================================================
// RENDER BUILT-IN TEMPLATES
// ============================================================
function renderBuiltin() {
  const container = document.getElementById('builtinTemplates');
  container.innerHTML = BUILTIN_TEMPLATES.map((t, i) => `
    <button class="template-chip" data-builtin="${i}" title="${t.label}">${t.label}</button>
  `).join('');

  container.querySelectorAll('[data-builtin]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTemplateState(BUILTIN_TEMPLATES[parseInt(btn.dataset.builtin)].state);
    });
  });
}

// ============================================================
// ADD CSS FOR FIELD ERROR STATE (injected once)
// ============================================================
function injectErrorStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .field-error {
      border-color: var(--danger) !important;
      box-shadow: 0 0 0 3px rgba(255,82,82,0.15) !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// INIT
// ============================================================
function init() {
  injectErrorStyle();
  initTheme();
  renderBuiltin();
  renderSalaryChips();
  renderSaved();
  updateSavedCount();

  // Text inputs - debounced
  let debounceTimer;
  function onInput(key, el) {
    el.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      state[key] = e.target.value;
      debounceTimer = setTimeout(updateUI, 80);
    });
  }
  onInput('keywords', document.getElementById('keywords'));
  onInput('location', document.getElementById('location'));

  // Easy apply toggle
  document.getElementById('easyApply').addEventListener('change', e => {
    state.easyApply = e.target.checked;
    updateUI();
  });

  // Currency pills
  document.querySelectorAll('.currency-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.currency = pill.dataset.currency;
      document.querySelectorAll('.currency-pill').forEach(p => p.classList.toggle('active', p === pill));
      renderSalaryChips();
      updateUI();
    });
  });

  // Single-select chips (not multi, excluding salary which is wired by renderSalaryChips)
  document.querySelectorAll('.chip:not(.chip-multi):not([data-group="salary"])').forEach(btn => {
    btn.addEventListener('click', () => handleSingleChip(btn));
  });

  // Multi-select chips
  document.querySelectorAll('.chip-multi').forEach(btn => {
    btn.addEventListener('click', () => handleMultiChip(btn));
  });

  // Collapsible card headers
  document.querySelectorAll('[data-toggle]').forEach(header => {
    header.addEventListener('click', () => toggleCard(header.dataset.toggle));
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(header.dataset.toggle);
      }
    });
  });

  // Copy URL
  document.getElementById('copyBtn').addEventListener('click', copyURL);

  // Reset all
  document.getElementById('clearAllBtn').addEventListener('click', resetAll);

  // Save template
  document.getElementById('saveTemplateBtn').addEventListener('click', saveTemplate);
  document.getElementById('templateName').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveTemplate();
  });

  // Clear all saved
  document.getElementById('clearSavedBtn').addEventListener('click', clearAllSaved);

  // Keyboard shortcut: Cmd/Ctrl+K = focus keywords
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('keywords').focus();
    }
    // Cmd/Ctrl+Shift+C = copy URL
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'c') {
      e.preventDefault();
      copyURL();
    }
  });

  // Collapse all filter cards except Search on mobile by default
  if (window.innerWidth <= 960) {
    ['time', 'sort', 'workmode', 'jobtype', 'exp', 'easy', 'salary'].forEach(id => {
      const card = document.getElementById(`card-${id}`);
      if (!card) return;
      card.classList.add('collapsed');
      const header = card.querySelector('[data-toggle]');
      if (header) header.setAttribute('aria-expanded', 'false');
    });
  }

  // Mobile sticky bar — copy button
  const mobileCopyBtn = document.getElementById('mobileCopyBtn');
  if (mobileCopyBtn) {
    mobileCopyBtn.addEventListener('click', () => {
      const url = buildURL();
      const finish = (ok) => {
        const text = document.getElementById('mobileCopyText');
        mobileCopyBtn.classList.add('copied');
        if (text) text.textContent = ok ? '✓ Copied' : '⚠ Failed';
        setTimeout(() => {
          mobileCopyBtn.classList.remove('copied');
          if (text) text.textContent = 'Copy';
        }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => finish(true)).catch(() => finish(false));
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { document.execCommand('copy'); finish(true); } catch { finish(false); }
        document.body.removeChild(ta);
      }
    });
  }

  // Initial render
  updateUI();
}

// ============================================================
// THEME TOGGLE
// ============================================================
const THEME_KEY = 'snipedin_theme';

const MOON_SVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
const SUN_SVG  = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.innerHTML = theme === 'light' ? SUN_SVG : MOON_SVG;
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  // Default dark; respect saved preference
  applyTheme(saved === 'light' ? 'light' : 'dark');
  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

document.addEventListener('DOMContentLoaded', init);
