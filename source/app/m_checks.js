// Check yourself: commit to an answer, then lift the stitched paper flap to reveal, verify key ideas, and rate yourself.
// Back from Chapter N (:::recall): the same, plus "You predicted ..." when it recalls a :::predict.
// Predict first: choose an option + confidence before the stitched paper flap peels back; shows 4-quadrant calibration.
// Understand it (:::five): toggle "Quiz me on these 5 questions" to turn any concept card into an active recall drill.
// Case file (:::case): commit a detective hypothesis & confidence before revealing the forensic solution.
// Try it at home: a small experiment journal (prediction, done, what happened).
import App from './core.js';

const { el, store } = App;
const RATINGS = [
  ['got', 'I got it'],
  ['partly', 'Partly'],
  ['not', 'Not yet'],
];
const CONF_STOPS = [
  ['sure', 'Sure'],
  ['guess', '50–50 guess'],
  ['unsure', 'Not sure'],
];

const FLAP_CORNER_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" class="flap-ear"><path d="M4 18 L18 4 L18 14 Q18 18 14 18 Z" fill="currentColor" opacity=".18"/><path d="M4 18 L18 4 M6 12 L12 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>';

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

function playSound(kind) {
  if (typeof window !== 'undefined' && window.__bookSound) window.__bookSound.play(kind);
}

function reveal(node, show) {
  if (show) {
    node.hidden = false;
    if (!App.reduceMotion() && node.animate) {
      node.animate([
        { opacity: 0, transform: 'perspective(700px) rotateX(-18deg) translateY(-6px)', transformOrigin: 'top center' },
        { opacity: 1, transform: 'perspective(700px) rotateX(0deg) translateY(0)', transformOrigin: 'top center' },
      ], { duration: 340, easing: 'cubic-bezier(.22, .8, .24, 1)' });
    }
  } else node.hidden = true;
}

const LETTERS = 'ABCDEFGHIJ';
const clean = s => String(s || '').replace(/\s+/g, ' ').trim();

function chapterContextOf(node) {
  const ch = node && node.closest && node.closest('article.chapter[id]');
  const sec = node && node.closest && node.closest('section.sec[id]');
  const chNum = ch ? Number(ch.id.replace('ch', '')) : 0;
  const chapterId = ch ? `ch-${chNum}` : 'ch-0';
  const skillId = sec && sec.id ? sec.id.replace(/^s/, '').replace('-', '.') : chapterId;
  return { chNum, chapterId, skillId };
}

function extractKeyIdeas(container) {
  if (!container) return [];
  const seen = new Set();
  const ideas = [];
  const stopWords = new Set([
    'the', 'and', 'but', 'for', 'nor', 'yet', 'yes', 'no', 'only', 'both',
    'first', 'second', 'third', 'answer', 'explains', 'explain', 'initial',
    'continued', 'supports', 'neither', 'alone', 'because', 'whereas', 'however',
    'through', 'between', 'without', 'before', 'after', 'during', 'within',
  ]);
  const add = raw => {
    const t = clean(raw).replace(/^[.,;:()[\]—–-]+|[.,;:()[\]—–-]+$/g, '');
    if (!t || t.length < 2 || t.length > 68) return;
    const low = t.toLowerCase();
    if (seen.has(low) || stopWords.has(low)) return;
    seen.add(low);
    ideas.push(t);
  };
  container.querySelectorAll('b, strong, em').forEach(n => add(n.textContent));
  const rawText = clean(container.textContent).replace(/^The answer\s*/i, '').replace(/^Forensic resolution & converging evidence\s*/i, '');
  if (ideas.length < 3) {
    const numMatches = rawText.match(/\b\d+(?:[.,]\d+)?(?:\s*(?:%|nm|µm|mm|cm|m|g|kg|mg|mL|L|kJ\/mol|ATP|°C|s|min|h|×|÷))+/g) || [];
    numMatches.slice(0, 3).forEach(add);
  }
  if (ideas.length < 3) {
    const words = rawText.match(/\b[A-Za-z]{6,}(?:\s+[A-Za-z]{5,})?\b/g) || [];
    for (const w of words) {
      const tokens = w.toLowerCase().split(/\s+/);
      if (tokens.some(t => stopWords.has(t))) continue;
      add(w);
      if (ideas.length >= 4) break;
    }
  }
  return ideas.slice(0, 5);
}

function matchesIdea(answerText, idea) {
  const hay = clean(answerText).toLowerCase();
  if (!hay) return false;
  const needle = clean(idea).toLowerCase();
  if (hay.includes(needle)) return true;
  const tokens = needle.split(/[^a-z0-9µ°]+/i).filter(t => t.length >= 4 || /^\d+$/.test(t));
  if (!tokens.length) return false;
  const hitCount = tokens.filter(t => hay.includes(t)).length;
  return hitCount >= Math.ceil(tokens.length * 0.65);
}

function computeQuadrant(isPass, conf) {
  const highConf = conf === 'sure' || !conf;
  if (isPass && highConf) {
    return {
      id: 'solid_mastery',
      tone: 'got',
      badge: 'Got It Cold',
      note: 'High confidence + accurate mechanism — locked into spaced memory.',
    };
  }
  if (isPass && !highConf) {
    return {
      id: 'fragile_guess',
      tone: 'partly',
      badge: 'Right — Let’s Lock It In',
      note: 'Your reasoning landed on the right mechanism even though you felt unsure. Notice why it works so it stops feeling like a guess.',
    };
  }
  if (!isPass && highConf) {
    return {
      id: 'productive_surprise',
      tone: 'not',
      badge: 'Productive Surprise · Misconception Shift',
      note: 'Being confident and then seeing the counter-evidence is how the brain rewires a tempting intuition fastest (the hypercorrection effect).',
    };
  }
  return {
    id: 'honest_gap',
    tone: 'partly',
    badge: 'Good Question to Explore',
    note: 'Spotting what is still fuzzy before looking is the first step to owning the mechanism.',
  };
}

function inferCorrectOptionIndex(opts, revealText) {
  const rev = clean(revealText).replace(/^What happens\s*/i, '').toLowerCase();
  if (!rev || !opts.length) return -1;
  const ordinals = [
    [/^(the\s+)?first\b/, 0],
    [/^(the\s+)?second\b/, 1],
    [/^(the\s+)?third\b/, 2],
    [/^(the\s+)?fourth\b/, 3],
    [/^option\s+a\b|^choice\s+a\b/, 0],
    [/^option\s+b\b|^choice\s+b\b/, 1],
    [/^option\s+c\b|^choice\s+c\b/, 2],
    [/^option\s+d\b|^choice\s+d\b/, 3],
  ];
  for (const [rx, idx] of ordinals) {
    if (idx < opts.length && rx.test(rev)) return idx;
  }
  const firstSentence = rev.split(/(?<=[.!?])\s+/)[0] || rev;
  if (/^no\b/.test(firstSentence)) {
    const noIdx = opts.findIndex(o => /^no\b/i.test(clean(o)));
    if (noIdx >= 0) return noIdx;
  }
  if (/^yes\b/.test(firstSentence)) {
    const yesIdx = opts.findIndex(o => /^yes\b/i.test(clean(o)));
    if (yesIdx >= 0) return yesIdx;
  }
  let bestIdx = 0;
  let bestScore = -1;
  opts.forEach((opt, idx) => {
    const words = clean(opt).toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 4);
    if (!words.length) return;
    const hits = words.filter(w => firstSentence.includes(w) || rev.slice(0, 240).includes(w)).length;
    const score = hits / Math.sqrt(words.length);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  });
  return bestIdx;
}

function setupCheck(box) {
  const id = box.id;
  const tpl = box.querySelector('template.chk-a');
  if (!id || !tpl || box.querySelector('.chk-ui')) return;
  const key = 'chk:' + id;
  const saved = store.get(key, {});
  const back = box.querySelector('.ans');
  const { chapterId, skillId } = chapterContextOf(box);

  const ta = el('textarea', { class: 'lj-ta', rows: 2, id: id + '-mine', placeholder: 'Write it here, or just think it' });
  ta.value = saved.a || '';
  const label = el('label', { class: 'lj-lab', for: id + '-mine' }, 'Your answer');

  const rtTa = el('textarea', { class: 'lj-ta lj-rt-ta', rows: 1, id: id + '-rt', placeholder: 'Thinking while reading: jot your initial hunch before lifting the flap…' });
  rtTa.value = saved.rt || '';
  const rtWrap = el('details', { class: 'lj-rt', open: !!saved.rt },
    el('summary', { class: 'lj-rt-sum' }, 'Thinking while reading (optional)'),
    rtTa);

  const confRow = el('div', { class: 'lj-conf', role: 'group', 'aria-label': 'How sure are you before lifting the flap?' });
  const confBtns = CONF_STOPS.map(([v, l]) => el('button', { type: 'button', class: 'lj-chip lj-conf-chip', 'data-conf': v, 'aria-pressed': String(saved.conf === v) }, l));
  confRow.append(el('span', { class: 'lj-q' }, 'Confidence:'), ...confBtns);

  function paintConf(c) {
    confBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.conf === c)));
    box.dataset.conf = c || '';
  }
  confBtns.forEach(b => b.addEventListener('click', () => {
    playSound('tick');
    const s = store.get(key, {}); s.conf = b.dataset.conf; s.a = ta.value; s.rt = rtTa.value; s.t = Date.now(); store.set(key, s);
    paintConf(s.conf); App.emit('learn:change');
  }));

  const showBtn = el('button', {
    type: 'button',
    class: 'lj-btn primary chk-flap-btn',
    'aria-expanded': 'false',
    'aria-controls': id + '-reveal',
  }, el('span', { class: 'flap-k' }, 'WHY?'), el('span', { class: 'flap-t' }, 'Lift the flap to see the answer'), el('span', { class: 'flap-i', html: FLAP_CORNER_SVG }));
  const answer = el('div', { class: 'chk-reveal', id: id + '-reveal', hidden: true });
  answer.append(el('p', { class: 'lj-kick' }, 'The answer'));
  const clonedAns = tpl.content.cloneNode(true);
  answer.append(clonedAns);

  // Key-Idea Spotter pills extracted from the model answer
  const keyIdeas = extractKeyIdeas(answer);
  let keyIdeasWrap = null;
  let paintKeyIdeas = () => {};
  if (keyIdeas.length > 0) {
    const chipsWrap = el('div', { class: 'chk-idea-chips' });
    const countBadge = el('span', { class: 'chk-idea-count' });
    keyIdeasWrap = el('div', { class: 'chk-key-ideas', role: 'region', 'aria-label': 'Key ideas in the model answer' },
      el('div', { class: 'chk-idea-head' },
        el('span', { class: 'lj-q' }, 'Key ideas to check in your answer:'),
        countBadge
      ),
      chipsWrap
    );
    const manualChecked = new Set(Array.isArray(saved.ideas) ? saved.ideas : []);
    const ideaBtns = keyIdeas.map(idea => {
      const btn = el('button', { type: 'button', class: 'chk-idea-pill', 'aria-pressed': 'false' },
        el('span', { class: 'chk-idea-icon', 'aria-hidden': 'true' }, '○'),
        el('span', { class: 'chk-idea-txt' }, idea)
      );
      btn.addEventListener('click', () => {
        playSound('tick');
        if (manualChecked.has(idea)) manualChecked.delete(idea);
        else manualChecked.add(idea);
        const s = store.get(key, {});
        s.ideas = [...manualChecked];
        store.set(key, s);
        paintKeyIdeas();
      });
      chipsWrap.append(btn);
      return { idea, btn };
    });
    paintKeyIdeas = () => {
      let matched = 0;
      const curText = ta.value || '';
      ideaBtns.forEach(({ idea, btn }) => {
        const autoHit = matchesIdea(curText, idea);
        const on = autoHit || manualChecked.has(idea);
        if (on) matched++;
        btn.classList.toggle('is-hit', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.querySelector('.chk-idea-icon').textContent = on ? '✓' : '○';
      });
      countBadge.textContent = `${matched} of ${keyIdeas.length} key ideas spotted`;
    };
    answer.append(keyIdeasWrap);
  }

  const masteryBadge = el('p', { class: 'chk-mastery-badge', hidden: true });
  const rateRow = el('div', { class: 'lj-rate', role: 'group', 'aria-label': 'How did you do?' });
  const rateBtns = RATINGS.map(([v, l]) => el('button', { type: 'button', class: 'lj-chip', 'data-r': v, 'aria-pressed': 'false' }, l));
  rateRow.append(el('span', { class: 'lj-q' }, 'How did you do?'), ...rateBtns);
  const again = el('button', { type: 'button', class: 'lj-link' }, 'Try again');
  answer.append(rateRow, masteryBadge, again);

  const save = () => {
    const s = store.get(key, {}); s.a = ta.value; s.rt = rtTa.value; s.t = Date.now(); store.set(key, s);
    paintKeyIdeas();
    App.emit('learn:change');
  };
  ta.addEventListener('input', debounce(save, 350));
  rtTa.addEventListener('input', debounce(save, 400));

  function paintMasteryStatus(r, conf) {
    if (!r) {
      masteryBadge.hidden = true;
      return;
    }
    const isPass = r === 'got';
    const quad = computeQuadrant(isPass, conf);
    const proof = App.mastery && App.mastery.getProof ? App.mastery.getProof(id) : null;
    const dueDays = proof && proof.card && proof.card.scheduledDays ? proof.card.scheduledDays : (isPass ? 3 : 1);
    const schedText = isPass
      ? (proof && proof.status === 'secure' ? 'Secure across 2+ days' : `Proven today · Next spaced check in ${dueDays}d`)
      : (r === 'partly' ? 'Queued for tomorrow’s spaced review (1d)' : 'Scheduled for priority review tomorrow (1d)');
    masteryBadge.hidden = false;
    masteryBadge.dataset.tone = quad.tone;
    masteryBadge.textContent = `${quad.badge} · ${schedText}`;
  }

  function paintRating(r) {
    rateBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.r === r)));
    box.dataset.rated = r || '';
    const s = store.get(key, {});
    paintMasteryStatus(r, s.conf);
  }
  function open(animate) {
    showBtn.hidden = true; showBtn.setAttribute('aria-expanded', 'true');
    paintKeyIdeas();
    if (animate) {
      playSound('flap');
      reveal(answer, true);
    } else answer.hidden = false;
  }
  showBtn.addEventListener('click', () => {
    const s = store.get(key, {}); s.a = ta.value; s.rt = rtTa.value; s.seen = true; s.t = Date.now(); store.set(key, s);
    open(true); App.emit('learn:change');
    answer.querySelector('.lj-chip').focus({ preventScroll: true });
  });
  rateBtns.forEach(b => b.addEventListener('click', () => {
    playSound('tick');
    const r = b.dataset.r;
    const s = store.get(key, {}); s.r = r; s.a = ta.value; s.rt = rtTa.value; s.seen = true; s.t = Date.now(); store.set(key, s);
    if (App.mastery && App.mastery.recordCheck) {
      App.mastery.recordCheck({
        id,
        chapterId,
        skillId,
        isCorrect: r === 'got',
        usedHelp: r === 'partly',
        isClosedChoice: false,
        responseTimeMs: s.conf === 'sure' ? 12000 : 35000,
      });
    }
    paintRating(r); App.emit('learn:change');
  }));
  again.addEventListener('click', () => {
    playSound('flap');
    store.set(key, { a: '', rt: '', conf: '', ideas: [], t: Date.now() });
    ta.value = ''; rtTa.value = ''; paintConf(''); paintRating(''); paintKeyIdeas();
    answer.hidden = true; showBtn.hidden = false; showBtn.setAttribute('aria-expanded', 'false');
    ta.focus(); App.emit('learn:change');
  });

  const ui = el('div', { class: 'chk-ui' }, rtWrap, label, ta, confRow, el('div', { class: 'lj-row' }, showBtn), answer);
  if (back) box.insertBefore(ui, back); else box.append(ui);
  if (back) back.classList.add('lj-back');
  if (saved.seen) open(false);
  paintConf(saved.conf);
  paintRating(saved.r);
  paintKeyIdeas();
}

function setupHome(box) {
  const n = box.dataset.home;
  if (!n || box.querySelector('.home-ui')) return;
  const key = 'home:' + n;
  const s = store.get(key, {});
  const pid = `home-${n}-pred`, rid = `home-${n}-res`, cid = `home-${n}-done`;
  const pred = el('textarea', { class: 'lj-ta', rows: 2, id: pid, placeholder: 'Make a guess before you begin' });
  pred.value = s.pred || '';
  const res = el('textarea', { class: 'lj-ta', rows: 2, id: rid, placeholder: 'What did you see? Was your guess right?' });
  res.value = s.res || '';
  const done = el('input', { type: 'checkbox', id: cid });
  done.checked = !!s.done;
  const when = el('span', { class: 'lj-date' });
  const resWrap = el('div', { class: 'home-res' }, el('label', { class: 'lj-lab', for: rid }, 'What actually happened?'), res);

  function paint() {
    const cur = store.get(key, {});
    when.textContent = cur.done && cur.date ? new Date(cur.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    resWrap.hidden = !cur.done && !cur.res;
    box.dataset.done = cur.done ? '1' : '';
  }
  const save = () => { const cur = store.get(key, {}); cur.pred = pred.value; cur.res = res.value; cur.t = Date.now(); store.set(key, cur); App.emit('learn:change'); };
  pred.addEventListener('input', debounce(save, 400));
  res.addEventListener('input', debounce(save, 400));
  done.addEventListener('change', () => {
    playSound(done.checked ? 'stamp' : 'tick');
    const cur = store.get(key, {}); cur.done = done.checked; cur.date = done.checked ? Date.now() : null; cur.pred = pred.value; cur.res = res.value;
    store.set(key, cur); const wasHidden = resWrap.hidden; paint();
    if (wasHidden && !resWrap.hidden) { reveal(resWrap, true); res.focus({ preventScroll: true }); }
    App.emit('learn:change');
  });

  const ui = el('div', { class: 'home-ui', role: 'group', 'aria-label': 'My experiment journal' },
    el('p', { class: 'lj-kick' }, 'My experiment journal'),
    el('label', { class: 'lj-lab', for: pid }, 'Before you start: what do you think will happen?'), pred,
    el('div', { class: 'lj-done' }, done, el('label', { for: cid }, 'I did it'), when),
    resWrap);
  box.append(ui);
  paint();
}

function setupPredict(box) {
  const id = box.dataset.predict;
  const list = box.querySelector('.pred-opts');
  const rev = box.querySelector('.pred-reveal');
  if (!id || !list || !rev || box.querySelector('.pred-you')) return;
  const key = 'pred:' + id;
  const { chapterId, skillId } = chapterContextOf(box);
  const q = clean(box.querySelector('.pq') && box.querySelector('.pq').textContent);
  box.classList.add('pred-js');
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', 'Your prediction');
  const btns = [...list.children].map((li, i) => {
    const b = el('button', { type: 'button', class: 'pred-opt', 'aria-pressed': 'false' },
      el('span', { class: 'pred-l', 'aria-hidden': 'true' }, LETTERS[i] || String(i + 1)));
    const txt = el('span', { class: 'pred-t' });
    while (li.firstChild) txt.append(li.firstChild);
    b.append(txt); li.append(b);
    b.addEventListener('click', () => choose(i));
    return b;
  });
  const optTexts = btns.map(b => clean(b.querySelector('.pred-t').textContent));
  const correctIdx = inferCorrectOptionIndex(optTexts, rev.textContent);

  const you = el('p', { class: 'pred-you', 'aria-live': 'polite' });
  const verdictBox = el('div', { class: 'pred-verdict-badge', hidden: true });
  const savedPred = store.get(key, {}) || {};
  const confRow = el('div', { class: 'lj-conf pred-conf', role: 'group', 'aria-label': 'Prediction confidence' });
  const confBtns = CONF_STOPS.map(([v, l]) => el('button', { type: 'button', class: 'lj-chip lj-conf-chip', 'data-conf': v, 'aria-pressed': String(savedPred.conf === v) }, l));
  confRow.append(el('span', { class: 'lj-q' }, 'Confidence:'), ...confBtns);
  confBtns.forEach(b => b.addEventListener('click', () => {
    playSound('tick');
    const cur = store.get(key, {}) || {};
    cur.conf = b.dataset.conf; cur.t = Date.now();
    store.set(key, cur);
    confBtns.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.conf === cur.conf)));
    paint(false);
    App.emit('learn:change');
  }));
  const flapText = el('span', { class: 'flap-t' }, 'Lift the flap to see the answer …after you have made your prediction');
  const flap = el('button', {
    type: 'button',
    class: 'pred-flap',
    'aria-expanded': 'false',
  },
    el('span', { class: 'flap-stitch', 'aria-hidden': 'true' }),
    el('span', { class: 'flap-k' }, 'WHY?'),
    flapText,
    el('span', { class: 'flap-i', html: FLAP_CORNER_SVG }),
  );
  const again = el('button', { type: 'button', class: 'lj-link' }, 'Fold flap & change my prediction');
  list.after(confRow, you, flap);
  rev.prepend(verdictBox);
  rev.append(again);
  rev.id = rev.id || id + '-reveal';
  flap.setAttribute('aria-controls', rev.id);
  btns.forEach(b => b.setAttribute('aria-controls', rev.id));

  flap.addEventListener('click', () => {
    const s = store.get(key, null);
    const has = s && s.c != null && btns[s.c];
    if (!has) {
      you.textContent = 'Pick one of the options above first — then lift the flap.';
      if (!App.reduceMotion() && list.animate) {
        list.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 220 });
      }
      btns[0]?.focus({ preventScroll: true });
      return;
    }
    const openNow = rev.hidden;
    playSound('flap');
    flap.classList.toggle('is-lifted', openNow);
    flap.setAttribute('aria-expanded', String(openNow));
    flapText.textContent = openNow ? 'Flap lifted · Tap to fold back' : 'Tap to lift the flap again';
    reveal(rev, openNow);
  });

  function paint(animate) {
    const s = store.get(key, null);
    const has = s && s.c != null && btns[s.c];
    btns.forEach((b, i) => {
      b.setAttribute('aria-pressed', String(!!has && i === s.c));
      b.disabled = !!has;
      b.classList.toggle('is-correct-opt', !!has && correctIdx >= 0 && i === correctIdx);
      b.classList.toggle('is-picked-wrong', !!has && correctIdx >= 0 && i === s.c && s.c !== correctIdx);
    });
    you.textContent = has ? `You predicted ${LETTERS[s.c]}: ${s.o}` : 'Choose one before you lift the flap.';
    box.dataset.chosen = has ? '1' : '';
    flap.classList.toggle('is-lifted', !!has);
    flap.setAttribute('aria-expanded', String(!!has));
    flapText.textContent = has ? 'Flap lifted · Tap to fold back' : 'Lift the flap to see the answer …after you have made your prediction';
    if (has && correctIdx >= 0) {
      const isPass = s.c === correctIdx;
      const quad = computeQuadrant(isPass, s.conf || 'sure');
      verdictBox.hidden = false;
      verdictBox.dataset.tone = quad.tone;
      verdictBox.innerHTML = '';
      verdictBox.append(
        el('span', { class: 'pred-v-chip' }, quad.badge),
        el('span', { class: 'pred-v-note' }, quad.note)
      );
    } else {
      verdictBox.hidden = true;
    }
    if (has) {
      if (animate) {
        playSound('flap');
        if (!App.reduceMotion() && flap.animate) {
          flap.animate([
            { transform: 'perspective(650px) rotateX(0deg)', transformOrigin: 'top center' },
            { transform: 'perspective(650px) rotateX(-24deg)', transformOrigin: 'top center' },
            { transform: 'perspective(650px) rotateX(0deg)', transformOrigin: 'top center' },
          ], { duration: 320, easing: 'ease-out' });
        }
        reveal(rev, true);
      } else rev.hidden = false;
    } else rev.hidden = true;
  }
  function choose(i) {
    playSound('tick');
    const prev = store.get(key, {}) || {};
    const conf = prev.conf || 'sure';
    const isCorrect = correctIdx >= 0 ? i === correctIdx : true;
    store.set(key, { c: i, o: clean(btns[i].querySelector('.pred-t').textContent), q, conf, ok: isCorrect, t: Date.now() });
    if (App.mastery && App.mastery.recordCheck) {
      App.mastery.recordCheck({
        id: 'pred:' + id,
        chapterId,
        skillId,
        isCorrect,
        usedHelp: false,
        isClosedChoice: true,
        responseTimeMs: conf === 'sure' ? 6000 : 18000,
      });
    }
    paint(true); App.emit('learn:change');
  }
  again.addEventListener('click', () => {
    playSound('flap');
    store.remove(key); paint(false); App.emit('learn:change');
    btns[0].focus({ preventScroll: true });
  });
  paint(false);
}

function setupFiveRecall(box) {
  const bh = box.querySelector(':scope > .bh');
  const fqs = [...box.querySelectorAll(':scope > dl.fqs > .fq')];
  if (!bh || !fqs.length || bh.querySelector('.five-quiz-btn')) return;
  const slug = box.id || 'five-card';
  const { chapterId, skillId } = chapterContextOf(box);
  let quizOn = false;

  const toggleBtn = el('button', {
    type: 'button',
    class: 'lj-chip five-quiz-btn',
    'aria-pressed': 'false',
    title: 'Hide the answers on this card and test your recall question by question',
  }, 'Quiz me on these 5');
  bh.append(toggleBtn);

  const rowControllers = fqs.map((fq, idx) => {
    const dt = fq.querySelector('dt');
    const dd = fq.querySelector('dd');
    if (!dt || !dd) return null;
    const itemId = `${slug}-q${idx + 1}`;
    const revealBtn = el('button', {
      type: 'button',
      class: 'lj-btn five-reveal-btn',
      hidden: true,
    }, `Reveal answer ${idx + 1}: ${clean(dt.textContent)}`);
    const rateWrap = el('div', { class: 'five-rate-row', hidden: true },
      el('span', { class: 'lj-q' }, 'Did you recall it?'),
      el('button', { type: 'button', class: 'lj-chip', 'data-r': 'got' }, 'Got it'),
      el('button', { type: 'button', class: 'lj-chip', 'data-r': 'not' }, 'Review again')
    );
    fq.append(revealBtn, rateWrap);

    revealBtn.addEventListener('click', () => {
      playSound('flap');
      revealBtn.hidden = true;
      dd.hidden = false;
      rateWrap.hidden = false;
    });
    rateWrap.querySelectorAll('button[data-r]').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('tick');
        const r = btn.dataset.r;
        rateWrap.querySelectorAll('button[data-r]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        if (App.mastery && App.mastery.recordCheck) {
          App.mastery.recordCheck({
            id: itemId,
            chapterId,
            skillId,
            isCorrect: r === 'got',
            usedHelp: false,
            isClosedChoice: false,
            responseTimeMs: 8000,
          });
        }
        App.emit('learn:change');
      });
    });

    return {
      enterQuiz() {
        dd.hidden = true;
        revealBtn.hidden = false;
        rateWrap.hidden = true;
      },
      exitQuiz() {
        dd.hidden = false;
        revealBtn.hidden = true;
        rateWrap.hidden = true;
      },
    };
  }).filter(Boolean);

  toggleBtn.addEventListener('click', () => {
    playSound('tick');
    quizOn = !quizOn;
    toggleBtn.setAttribute('aria-pressed', String(quizOn));
    toggleBtn.textContent = quizOn ? 'Show all 5 answers' : 'Quiz me on these 5';
    box.classList.toggle('is-quiz-mode', quizOn);
    rowControllers.forEach(c => (quizOn ? c.enterQuiz() : c.exitQuiz()));
  });
}

function setupCase(box, idx) {
  const details = box.querySelector('details');
  if (!details || box.querySelector('.case-ui')) return;
  const { chNum, chapterId, skillId } = chapterContextOf(box);
  const id = box.id || `case-ch${chNum || idx}`;
  box.id = id;
  box.dataset.caseId = id;
  const key = 'case:' + id;
  const saved = store.get(key, {});

  const solDiv = details.querySelector('div') || details;
  const solClone = solDiv.cloneNode(true);
  details.classList.add('case-native-details');

  const ta = el('textarea', {
    class: 'lj-ta',
    rows: 3,
    id: id + '-hyp',
    placeholder: 'Write your detective hypothesis: which clues rule out the rival explanation, and what decisive test settles the case?',
  });
  ta.value = saved.a || '';
  const label = el('label', { class: 'lj-lab', for: id + '-hyp' }, 'Your forensic hypothesis & evidence');

  const confRow = el('div', { class: 'lj-conf', role: 'group', 'aria-label': 'How sure are you of your case solution?' });
  const confBtns = CONF_STOPS.map(([v, l]) => el('button', { type: 'button', class: 'lj-chip lj-conf-chip', 'data-conf': v, 'aria-pressed': String(saved.conf === v) }, l));
  confRow.append(el('span', { class: 'lj-q' }, 'Confidence:'), ...confBtns);

  function paintConf(c) {
    confBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.conf === c)));
    box.dataset.conf = c || '';
  }
  confBtns.forEach(b => b.addEventListener('click', () => {
    playSound('tick');
    const s = store.get(key, {}); s.conf = b.dataset.conf; s.a = ta.value; s.t = Date.now(); store.set(key, s);
    paintConf(s.conf); App.emit('learn:change');
  }));

  const showBtn = el('button', {
    type: 'button',
    class: 'lj-btn primary chk-flap-btn case-flap-btn',
    'aria-expanded': 'false',
    'aria-controls': id + '-reveal',
  },
    el('span', { class: 'flap-k' }, 'CASE SOLUTION'),
    el('span', { class: 'flap-t' }, 'Lift the flap to compare with the forensic solution'),
    el('span', { class: 'flap-i', html: FLAP_CORNER_SVG })
  );

  const answer = el('div', { class: 'chk-reveal case-reveal', id: id + '-reveal', hidden: true });
  answer.append(el('p', { class: 'lj-kick' }, 'Forensic resolution & converging evidence'));
  while (solClone.firstChild) answer.append(solClone.firstChild);

  const keyIdeas = extractKeyIdeas(answer);
  let paintKeyIdeas = () => {};
  if (keyIdeas.length > 0) {
    const chipsWrap = el('div', { class: 'chk-idea-chips' });
    const countBadge = el('span', { class: 'chk-idea-count' });
    const keyIdeasWrap = el('div', { class: 'chk-key-ideas', role: 'region', 'aria-label': 'Forensic clues in the solution' },
      el('div', { class: 'chk-idea-head' },
        el('span', { class: 'lj-q' }, 'Key forensic clues in the resolution:'),
        countBadge
      ),
      chipsWrap
    );
    const ideaBtns = keyIdeas.map(idea => {
      const btn = el('button', { type: 'button', class: 'chk-idea-pill', 'aria-pressed': 'false' },
        el('span', { class: 'chk-idea-icon', 'aria-hidden': 'true' }, '○'),
        el('span', { class: 'chk-idea-txt' }, idea)
      );
      chipsWrap.append(btn);
      return { idea, btn };
    });
    paintKeyIdeas = () => {
      let matched = 0;
      const curText = ta.value || '';
      ideaBtns.forEach(({ idea, btn }) => {
        const on = matchesIdea(curText, idea);
        if (on) matched++;
        btn.classList.toggle('is-hit', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.querySelector('.chk-idea-icon').textContent = on ? '✓' : '○';
      });
      countBadge.textContent = `${matched} of ${keyIdeas.length} forensic clues matched`;
    };
    answer.append(keyIdeasWrap);
  }

  const rateRow = el('div', { class: 'lj-rate', role: 'group', 'aria-label': 'How did your case investigation compare?' });
  const rateBtns = RATINGS.map(([v, l]) => el('button', { type: 'button', class: 'lj-chip', 'data-r': v, 'aria-pressed': 'false' }, l));
  rateRow.append(el('span', { class: 'lj-q' }, 'How did your case analysis compare?'), ...rateBtns);
  const again = el('button', { type: 'button', class: 'lj-link' }, 'Revise or reset case analysis');
  answer.append(rateRow, again);

  const save = () => {
    const s = store.get(key, {}); s.a = ta.value; s.t = Date.now(); store.set(key, s);
    paintKeyIdeas();
    App.emit('learn:change');
  };
  ta.addEventListener('input', debounce(save, 350));

  function paintRating(r) {
    rateBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.r === r)));
    box.dataset.rated = r || '';
  }
  function open(animate) {
    showBtn.hidden = true;
    showBtn.setAttribute('aria-expanded', 'true');
    details.open = true;
    paintKeyIdeas();
    if (animate) {
      playSound('flap');
      reveal(answer, true);
    } else {
      answer.hidden = false;
    }
  }
  showBtn.addEventListener('click', () => {
    const s = store.get(key, {}); s.a = ta.value; s.seen = true; s.t = Date.now(); store.set(key, s);
    open(true); App.emit('learn:change');
  });
  rateBtns.forEach(b => b.addEventListener('click', () => {
    playSound('tick');
    const r = b.dataset.r;
    const s = store.get(key, {}); s.r = r; s.a = ta.value; s.seen = true; s.t = Date.now(); store.set(key, s);
    if (App.mastery && App.mastery.recordCheck) {
      App.mastery.recordCheck({
        id,
        chapterId,
        skillId,
        isCorrect: r === 'got',
        usedHelp: r === 'partly',
        isClosedChoice: false,
        responseTimeMs: 25000,
      });
    }
    paintRating(r); App.emit('learn:change');
  }));
  again.addEventListener('click', () => {
    playSound('flap');
    store.set(key, { a: '', conf: '', t: Date.now() });
    ta.value = ''; paintConf(''); paintRating(''); paintKeyIdeas();
    answer.hidden = true; details.open = false; showBtn.hidden = false; showBtn.setAttribute('aria-expanded', 'false');
    ta.focus(); App.emit('learn:change');
  });

  const ui = el('div', { class: 'chk-ui case-ui' }, label, ta, confRow, el('div', { class: 'lj-row' }, showBtn), answer);
  box.insertBefore(ui, details);
  details.hidden = true;
  if (saved.seen) open(false);
  paintConf(saved.conf);
  paintRating(saved.r);
  paintKeyIdeas();
}

function paintRecall(box) {
  const ref = box.dataset.recallPred;
  if (!ref) return;
  const s = store.get('pred:' + ref, null);
  let p = box.querySelector('.rec-pred');
  if (!s || s.c == null) { if (p) p.remove(); return; }
  if (!p) { p = el('p', { class: 'rec-pred' }); box.querySelector('.bh').after(p); }
  const where = ref.replace(/^pred-/, '').replace('-', '.');
  p.textContent = `Back in section ${where} you predicted: “${s.o}”`;
}

App.ready(() => {
  document.querySelectorAll('.box.predict[data-predict]').forEach(setupPredict);
  document.querySelectorAll('.box.check[id]').forEach(setupCheck);
  document.querySelectorAll('.box.five').forEach(setupFiveRecall);
  document.querySelectorAll('.case').forEach(setupCase);
  const recalls = [...document.querySelectorAll('.box.recall[data-recall-pred]')];
  recalls.forEach(paintRecall);
  App.on('learn:change', () => recalls.forEach(paintRecall));
  document.querySelectorAll('.box.home[data-home]').forEach(setupHome);
});
