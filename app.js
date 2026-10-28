(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const T = window.I18N, C = window.CATALOG, CL = window.CAT_LABELS;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  document.documentElement.classList.add('js');

  let lang = localStorage.getItem('avx-lang') || 'ru';
  if (!['ru', 'uz', 'en'].includes(lang)) lang = 'ru';
  const t = (k) => (T[k] && T[k][lang]) || (T[k] && T[k].ru) || k;
  const L = (o) => (typeof o === 'string' ? o : o[lang] || o.ru);
  const fmt = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ');

  /* ---------- конфигуратор: данные ---------- */
  const TYPES = [
    ['bottles', {ru:'ПЭТ бутылка',uz:'PET butilka',en:'PET bottle'}],
    ['preforms', {ru:'ПЭТ преформа',uz:'PET preforma',en:'PET preform'}],
    ['buckets', {ru:'Ведро',uz:'Chelak',en:'Bucket'}],
    ['cups', {ru:'Стакан',uz:'Stakan',en:'Cup'}],
    ['caps', {ru:'Крышка',uz:'Qopqoq',en:'Cap'}]
  ];
  const VOL = {
    bottles: ['0,5 L', '1 L', '1,5 L', '2 L', '5 L'],
    preforms: ['18 g', '28 g', '38 g', '90 g'],
    buckets: ['1 L', '3 L', '5 L', '10 L', '20 L'],
    cups: ['200 ml', '300 ml', '500 ml', '1000 ml'],
    caps: ['28 mm', '38 mm', '48 mm', 'Ø 95 mm']
  };
  const CLOSURE = {
    bottles: [['pco', {ru:'PCO 1881 + винтовая крышка',uz:'PCO 1881 + vintli qopqoq',en:'PCO 1881 + screw cap'}], ['sport', {ru:'Спорт-крышка',uz:'Sport qopqoq',en:'Sport cap'}], ['handle', {ru:'48 mm, крышка с ручкой',uz:'48 mm, tutqichli qopqoq',en:'48 mm, cap with handle'}], ['none', {ru:'Без крышки',uz:'Qopqoqsiz',en:'No cap'}]],
    preforms: [['pco', {ru:'Горловина PCO 1881',uz:'PCO 1881 boʻgʻiz',en:'PCO 1881 neck'}], ['38', {ru:'Горловина 38 mm',uz:'38 mm boʻgʻiz',en:'38 mm neck'}], ['48', {ru:'Горловина 48 mm',uz:'48 mm boʻgʻiz',en:'48 mm neck'}]],
    buckets: [['lid', {ru:'С крышкой',uz:'Qopqoqli',en:'With lid'}], ['tamper', {ru:'Крышка с контролем вскрытия',uz:'Ochilish nazoratli qopqoq',en:'Tamper-evident lid'}], ['none', {ru:'Без крышки',uz:'Qopqoqsiz',en:'No lid'}]],
    cups: [['lid', {ru:'С крышкой',uz:'Qopqoqli',en:'With lid'}], ['none', {ru:'Без крышки',uz:'Qopqoqsiz',en:'No lid'}]],
    caps: [['screw', {ru:'Винтовая',uz:'Vintli',en:'Screw'}], ['sport', {ru:'Спорт',uz:'Sport',en:'Sport'}], ['handle', {ru:'С ручкой',uz:'Tutqichli',en:'With handle'}]]
  };
  const COLORS = [
    ['clear', '#c9eef6', {ru:'Прозрачный',uz:'Shaffof',en:'Clear'}],
    ['blue', '#5cc8e0', {ru:'Голубой',uz:'Havorang',en:'Light blue'}],
    ['green', '#57b38a', {ru:'Зеленый',uz:'Yashil',en:'Green'}],
    ['amber', '#b8742e', {ru:'Коричневый',uz:'Jigarrang',en:'Amber'}],
    ['white', '#f2f4f7', {ru:'Белый',uz:'Oq',en:'White'}],
    ['black', '#2b3036', {ru:'Черный',uz:'Qora',en:'Black'}],
    ['custom', 'conic-gradient(#e85d5d,#e8c95d,#5de88a,#5dc8e8,#a25de8,#e85d5d)', {ru:'Свой цвет',uz:'Oʻz rangingiz',en:'Custom color'}]
  ];
  const BRAND = [['none', {ru:'Без нанесения',uz:'Logotipsiz',en:'No branding'}], ['logo', {ru:'Логотип / этикетка',uz:'Logotip / yorliq',en:'Logo / label'}], ['mold', {ru:'Своя форма под бренд',uz:'Brend uchun oʻz shakli',en:'Custom mold for your brand'}]];
  const QTY = [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000];
  const SPEC_L = {type:{ru:'Тара',uz:'Idish',en:'Type'},volume:{ru:'Объем',uz:'Hajm',en:'Size'},closure:{ru:'Горловина / крышка',uz:'Boʻgʻiz / qopqoq',en:'Neck / closure'},color:{ru:'Цвет',uz:'Rang',en:'Color'},brand:{ru:'Нанесение',uz:'Brendlash',en:'Branding'},qty:{ru:'Тираж',uz:'Tiraj',en:'Quantity'}};
  const UNIT = {ru:'шт.',uz:'dona',en:'pcs'};

  const state = { type: 'bottles', volume: '1,5 L', closure: 'pco', color: 'clear', brand: 'none', qty: 2 };

  const sym = (type, extra = '') => {
    const c = C[type];
    return `<svg viewBox="${c.vb}" ${extra}><use href="#${c.sym}"/></svg>`;
  };

  /* ---------- язык ---------- */
  function applyLang(l) {
    lang = l;
    localStorage.setItem('avx-lang', l);
    document.documentElement.lang = l === 'uz' ? 'uz-Latn' : l;
    document.title = t('title');
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === l));
    renderTabs(); renderCat(curCat, false); renderCfg(); renderSpec(false);
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  /* ---------- каталог ---------- */
  let curCat = 'bottles';
  const tabs = $('#tabs');
  function renderTabs() {
    tabs.innerHTML = Object.keys(C).map((k) => `<button class="tab" role="tab" type="button" id="tab-${k}" aria-controls="cat-panel" aria-selected="${k === curCat}" tabindex="${k === curCat ? 0 : -1}" data-k="${k}" style="--tint:${C[k].tint}">${sym(k, 'aria-hidden="true"')}${t('cat.' + k)}</button>`).join('');
  }
  tabs.addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) selectCat(b.dataset.k); });
  tabs.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const ks = Object.keys(C); let i = ks.indexOf(curCat) + (e.key === 'ArrowRight' ? 1 : -1);
    i = (i + ks.length) % ks.length; selectCat(ks[i]); $(`#tab-${ks[i]}`).focus();
  });
  function selectCat(k) {
    if (k === curCat) return;
    curCat = k; renderTabs();
    const p = $('#cat-panel');
    if (reduce) return renderCat(k, true);
    p.classList.add('is-out');
    setTimeout(() => { renderCat(k, true); p.classList.remove('is-out'); }, 220);
  }
  function renderCat(k) {
    const c = C[k];
    $('#cat-panel').setAttribute('aria-labelledby', `tab-${k}`);
    $('#cat-visual').innerHTML = `<div style="--tint:${c.tint};--cap:#5cc8e0;--lid:#5cc8e0;height:100%">${sym(k, 'aria-hidden="true"')}</div>`;
    $('#cat-name').textContent = L(c.name);
    $('#cat-desc').textContent = L(c.desc);
    $('#cat-items').innerHTML = c.items.map(([v, n, u]) => `
      <article class="item" style="--tint:${c.tint};--cap:#5cc8e0;--lid:#5cc8e0">
        <div class="item__art" aria-hidden="true">${sym(k)}</div>
        <h4>${t('cat.' + k)} ${v}</h4>
        <dl><dt>${L(CL.vol)}</dt><dd>${v}</dd><dt>${L(CL.neck)}</dt><dd>${L(n)}</dd><dt>${L(CL.use)}</dt><dd>${L(u)}</dd></dl>
        <button class="item__go" type="button" data-type="${k}" data-vol="${v}">${t('cat.pick')} →</button>
      </article>`).join('');
  }
  $('#cat-items').addEventListener('click', (e) => {
    const b = e.target.closest('.item__go'); if (!b) return;
    setType(b.dataset.type); if (VOL[b.dataset.type].includes(b.dataset.vol)) state.volume = b.dataset.vol;
    renderCfg(); renderSpec(true);
    $('#config').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  $('#cat-items').addEventListener('pointermove', (e) => {
    const it = e.target.closest('.item'); if (!it) return;
    const r = it.getBoundingClientRect();
    it.style.setProperty('--x', `${e.clientX - r.left}px`); it.style.setProperty('--y', `${e.clientY - r.top}px`);
  });

  /* ---------- конфигуратор ---------- */
  function setType(k) {
    state.type = k;
    if (!VOL[k].includes(state.volume)) state.volume = VOL[k][Math.min(1, VOL[k].length - 1)];
    if (!CLOSURE[k].some(([id]) => id === state.closure)) state.closure = CLOSURE[k][0][0];
  }
  const radio = (g, val, label, cur, extra = '') => `<label class="opt"><input type="radio" name="${g}" value="${val}" ${val === cur ? 'checked' : ''}><span>${extra}${label}</span></label>`;
  function renderCfg() {
    $('[data-group=type]').innerHTML = TYPES.map(([k, l]) => radio('type', k, L(l), state.type)).join('');
    $('[data-group=volume]').innerHTML = VOL[state.type].map((v) => radio('volume', v, v, state.volume)).join('');
    $('[data-group=closure]').innerHTML = CLOSURE[state.type].map(([k, l]) => radio('closure', k, L(l), state.closure)).join('');
    $('[data-group=color]').innerHTML = COLORS.map(([k, c, l]) => radio('color', k, L(l), state.color, `<i class="sw" style="background:${c}"></i>`)).join('');
    $('[data-group=brand]').innerHTML = BRAND.map(([k, l]) => radio('brand', k, L(l), state.brand)).join('');
  }
  $('#cfg').addEventListener('change', (e) => {
    const { name, value } = e.target;
    if (name === 'type') { setType(value); renderCfg(); $(`input[name=type][value=${value}]`).focus(); }
    else if (name in state && name !== 'qty') state[name] = value;
    renderSpec(true, name);
  });
  const qty = $('#qty');
  qty.addEventListener('input', () => { state.qty = +qty.value; renderSpec(true, 'qty'); });

  function specRows() {
    const col = COLORS.find((c) => c[0] === state.color);
    return [
      ['type', L(TYPES.find((x) => x[0] === state.type)[1])],
      ['volume', state.volume],
      ['closure', L(CLOSURE[state.type].find((x) => x[0] === state.closure)[1])],
      ['color', L(col[2])],
      ['brand', L(BRAND.find((x) => x[0] === state.brand)[1])],
      ['qty', `${fmt(QTY[state.qty])}${state.qty === QTY.length - 1 ? '+' : ''} ${L(UNIT)}`]
    ];
  }
  function renderSpec(anim, changed) {
    const rows = specRows();
    $('#spec-list').innerHTML = rows.map(([k, v]) => `<div><dt>${L(SPEC_L[k])}</dt><dd class="${anim && k === changed ? 'flash' : ''}">${v}</dd></div>`).join('');
    $('#qty-out').textContent = fmt(QTY[state.qty]) + (state.qty === QTY.length - 1 ? '+' : '');
    qty.value = state.qty;
    qty.setAttribute('aria-valuetext', rows[5][1]);
    const col = COLORS.find((c) => c[0] === state.color)[1];
    const tint = col.startsWith('#') ? col : '#e8c95d';
    const capOn = !['none'].includes(state.closure);
    const label = state.brand === 'logo' ? 'rgba(255,255,255,.85)' : 'transparent';
    const style = `--tint:${tint};--cap:${capOn ? '#5cc8e0' : 'transparent'};--lid:${capOn ? '#5cc8e0' : 'transparent'};--handle:${capOn || state.type !== 'buckets' ? '#c9d0d8' : '#c9d0d8'};--label:${label}`;
    const v = $('#spec-view');
    const badge = state.brand === 'logo' ? '<span class="logo-badge">LOGO</span>' : state.brand === 'mold' ? `<span class="logo-badge">${lang === 'en' ? 'CUSTOM MOLD' : lang === 'uz' ? 'OʻZ SHAKLI' : 'СВОЯ ФОРМА'}</span>` : '';
    const scale = { bottles: [70, 80, 88, 92, 100], preforms: [70, 80, 88, 100], buckets: [55, 68, 78, 90, 100], cups: [62, 74, 86, 100], caps: [45, 52, 60, 70] }[state.type][VOL[state.type].indexOf(state.volume)] || 100;
    const mold = state.brand === 'mold' ? 'transform:skewX(-4deg) scaleX(1.06);' : '';
    v.innerHTML = `${badge}<div style="${style};height:${scale}%;display:flex;align-items:flex-end;${mold}">${sym(state.type, 'aria-hidden="true"')}</div>`;
    if (anim && !reduce && (changed === 'type' || changed === 'volume')) { v.classList.remove('bump'); void v.offsetWidth; v.classList.add('bump'); }
    updateWa();
  }
  const specText = () => specRows().map(([k, v]) => `${L(SPEC_L[k])}: ${v}`).join('\n');
  function updateWa() { $('#wa').href = `https://wa.me/998336010003?text=${encodeURIComponent(`${t('wa.text')}\n${specText()}`)}`; }

  $('#to-request').addEventListener('click', () => {
    const ta = $('#f-msg');
    ta.value = `${t('cfg.spec')}:\n${specText()}`;
    showForm();
    $('#request').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    const f = ta.closest('.field'); f.classList.remove('is-filled'); void f.offsetWidth; f.classList.add('is-filled');
    setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduce ? 0 : 700);
  });

  /* ---------- форма (демо) ---------- */
  const phone = $('#f-phone');
  phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+998 '; });
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (!d.startsWith('998')) d = '998' + d;
    d = d.slice(0, 12);
    const p = [d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)];
    let out = '+998';
    if (p[0]) out += ' ' + p[0];
    if (p[1]) out += ' ' + p[1];
    if (p[2]) out += '-' + p[2];
    if (p[3]) out += '-' + p[3];
    phone.value = out;
    phone.closest('.field').classList.remove('is-bad');
  });
  $('#f-name').addEventListener('input', (e) => e.target.closest('.field').classList.remove('is-bad'));
  function showForm() { $('#form-ok').hidden = true; $('#form-fields').hidden = false; }
  $('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = $('#f-name'), okN = n.value.trim().length >= 2, okP = phone.value.replace(/\D/g, '').length === 12;
    n.closest('.field').classList.toggle('is-bad', !okN);
    phone.closest('.field').classList.toggle('is-bad', !okP);
    n.setAttribute('aria-invalid', !okN); phone.setAttribute('aria-invalid', !okP);
    if (!okN) return n.focus();
    if (!okP) return phone.focus();
    const b = $('#f-submit'); b.disabled = true;
    b.innerHTML = `<span class="spin" aria-hidden="true"></span><span>${t('f.sending')}</span>`;
    setTimeout(() => {
      b.disabled = false; b.innerHTML = `<span data-i18n="f.send">${t('f.send')}</span><svg class="ic" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
      $('#form-fields').hidden = true; $('#form-ok').hidden = false; $('#form').reset();
      $('#form-ok h3').setAttribute('tabindex', '-1'); $('#form-ok h3').focus();
    }, 1100);
  });
  $('#form-again').addEventListener('click', () => { showForm(); $('#f-name').focus(); });

  /* ---------- шапка, меню, прогресс ---------- */
  const hdr = $('#hdr'), burger = $('#burger'), nav = $('#nav'), mbar = $('#mbar');
  let lastY = scrollY, ticking = false;
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    hdr.classList.toggle('is-scrolled', y > 10);
    const down = y > lastY && y > 480 && burger.getAttribute('aria-expanded') !== 'true';
    hdr.classList.toggle('is-hidden', down);
    hdr.style.setProperty('--p', h > 0 ? (y / h).toFixed(4) : 0);
    mbar.classList.toggle('is-on', y > innerHeight * .6);
    lastY = y; ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); } });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { burger.click(); burger.focus(); } });

  const links = $$('.nav a');
  const secIO = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'catalog', 'config', 'quality', 'request'].forEach((id) => secIO.observe($('#' + id)));

  /* ---------- появление и счетчики ---------- */
  const groups = new Map();
  $$('.reveal').forEach((el) => {
    const p = el.parentElement, i = groups.get(p) || 0; groups.set(p, i + 1);
    el.style.setProperty('--delay', `${Math.min(i, 5) * 70}ms`);
  });
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in'); io.unobserve(en.target);
    const num = en.target.querySelector('[data-count]'); if (num) count(num);
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
  function count(el) {
    const to = +el.dataset.count;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), d = 1200;
    const step = (now) => { const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------- параллакс героя и магнитные кнопки ---------- */
  if (fine && !reduce) {
    const stage = $('#stage'), hero = $('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      stage.style.setProperty('--px', (((e.clientX - r.left) / r.width) - .5).toFixed(3));
      stage.style.setProperty('--py', (((e.clientY - r.top) / r.height) - .5).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => { stage.style.setProperty('--px', 0); stage.style.setProperty('--py', 0); });
    $$('.magnet').forEach((m) => {
      m.addEventListener('pointermove', (e) => {
        const r = m.getBoundingClientRect();
        m.style.setProperty('--mx', `${((e.clientX - r.left) / r.width - .5) * 10}px`);
        m.style.setProperty('--my', `${((e.clientY - r.top) / r.height - .5) * 8}px`);
      });
      m.addEventListener('pointerleave', () => { m.style.setProperty('--mx', '0px'); m.style.setProperty('--my', '0px'); });
    });
  }

  applyLang(lang);
  onScroll();
})();
