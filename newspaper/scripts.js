/* ═══════════════════════════════════════════════════════
   THE ENCHANTED GAZETTE v2 — JavaScript
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  runLoadingScreen();
  initDate();
  initParticles();
  initFireflies();
  initCursor();
  initNavigation();
  initFloatingControls();
  initScrollReveal();
  initMemoryGame();
  initGardenGame();
  initWordSearch();
  initHoroscope();
  initMoonCalendar();
  rotateDailyWisdom();
  initWeatherCycle();
  initFooterNav();
});

/* ════════════════════════════════════════
   LOADING SCREEN
════════════════════════════════════════ */
function runLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  const fill   = document.getElementById('loading-bar-fill');
  if (!screen) return;

  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) { pct = 100; clearInterval(tick); }
    if (fill) fill.style.width = pct + '%';
    if (pct >= 100) setTimeout(hideLoading, 400);
  }, 120);
}

function hideLoading() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  screen.classList.add('fade-out');
  setTimeout(() => screen.remove(), 900);
  document.getElementById('floating-controls')?.classList.add('visible');
}

/* ════════════════════════════════════════
   CUSTOM CURSOR + SPARKLE TRAIL
════════════════════════════════════════ */
const SPARKLE_SYMBOLS = ['✦','✧','⋆','·','꩜','❋','✿','◌'];
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
let lastSparkleTime = 0;

function initCursor() {
  if (window.matchMedia('(hover:none)').matches) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const cont = document.getElementById('sparkle-container');
  if (!dot || !ring) return;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';

    const now = Date.now();
    if (now - lastSparkleTime > 60) {
      spawnSparkle(mouseX, mouseY, cont);
      lastSparkleTime = now;
    }
  });

  document.addEventListener('click', e => {
    for (let i = 0; i < 7; i++) spawnSparkle(e.clientX, e.clientY, cont, true);
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

function spawnSparkle(x, y, container, burst = false) {
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'sparkle-particle';
  el.textContent = SPARKLE_SYMBOLS[Math.floor(Math.random() * SPARKLE_SYMBOLS.length)];

  const angle  = Math.random() * Math.PI * 2;
  const dist   = burst ? 30 + Math.random() * 50 : 8 + Math.random() * 20;
  const sx = Math.cos(angle) * dist;
  const sy = Math.sin(angle) * dist - (burst ? 0 : 15);

  const hue = Math.random() > .5 ? '#c8a830' : '#dda0dd';
  el.style.cssText = `
    left:${x}px; top:${y}px;
    color:${hue};
    font-size:${burst ? .8 + Math.random() * .6 : .5 + Math.random() * .4}rem;
    --sx:${sx}px; --sy:${sy}px;
    animation-duration:${burst ? .6 + Math.random() * .4 : .5 + Math.random() * .3}s;
  `;
  container.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

/* ════════════════════════════════════════
   AMBIENT SOUND (Web Audio API)
════════════════════════════════════════ */
let audioCtx = null, soundOn = false;
let masterGain, droneOsc, droneGain;
let chimeInterval = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  /* Soft drone — layered fifths */
  [[55, .03],[82.4, .025],[110, .018],[164.8, .012]].forEach(([freq, vol]) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.gain.value = vol;
    gain.connect(masterGain);
    osc.start();
  });

  /* Wind noise */
  const bufSize = audioCtx.sampleRate * 2;
  const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * .12;
  const noise   = audioCtx.createBufferSource();
  const filter  = audioCtx.createBiquadFilter();
  const windGain= audioCtx.createGain();
  noise.buffer = buf; noise.loop = true;
  filter.type = 'bandpass'; filter.frequency.value = 300; filter.Q.value = .4;
  noise.connect(filter); filter.connect(windGain); windGain.gain.value = .025; windGain.connect(masterGain);
  noise.start();
}

function playChime() {
  if (!audioCtx || !soundOn) return;
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
  const freq = notes[Math.floor(Math.random() * notes.length)];
  const osc  = audioCtx.createOscillator();
  const env  = audioCtx.createGain();
  osc.type = 'sine'; osc.frequency.value = freq;
  osc.connect(env); env.connect(masterGain);
  const t = audioCtx.currentTime;
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(.04, t + .02);
  env.gain.exponentialRampToValueAtTime(.001, t + 2.5);
  osc.start(t); osc.stop(t + 2.5);
}

function toggleSound() {
  const btn = document.getElementById('sound-btn');
  if (!soundOn) {
    initAudio();
    soundOn = true;
    masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.5);
    chimeInterval = setInterval(playChime, 3500 + Math.random() * 4000);
    btn?.classList.add('active');
    if (btn) btn.querySelector('.float-icon').textContent = '🔊';
  } else {
    soundOn = false;
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
    clearInterval(chimeInterval);
    btn?.classList.remove('active');
    if (btn) btn.querySelector('.float-icon').textContent = '🎵';
  }
}

/* ════════════════════════════════════════
   NIGHT MODE
════════════════════════════════════════ */
function toggleTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-btn');
  const night = html.dataset.theme !== 'night';
  html.dataset.theme = night ? 'night' : 'day';
  if (btn) {
    btn.querySelector('.float-icon').textContent = night ? '☀️' : '🌙';
    btn.querySelector('.float-label').textContent = night ? 'Day' : 'Night';
    btn.classList.toggle('active', night);
  }
}

/* ════════════════════════════════════════
   FLOATING CONTROLS
════════════════════════════════════════ */
function initFloatingControls() {
  document.getElementById('sound-btn')?.addEventListener('click', toggleSound);
  document.getElementById('theme-btn')?.addEventListener('click', toggleTheme);
  document.getElementById('top-btn')?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
  }, { threshold:.12, rootMargin:'0px 0px -40px 0px' });
  targets.forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
function initNavigation() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.dataset.section;
      switchSection(id);
      links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      closeHamburger();
    });
  });

  const ham = document.getElementById('hamburger');
  const list = document.getElementById('nav-list');
  ham?.addEventListener('click', () => {
    const open = list?.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open);
  });
}

function initFooterNav() {
  document.querySelectorAll('.footer-nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.dataset.section;
      switchSection(id);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === id));
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });
}

function closeHamburger() {
  document.getElementById('hamburger')?.classList.remove('open');
  document.getElementById('nav-list')?.classList.remove('open');
}

function switchSection(id) {
  document.querySelectorAll('.paper-section').forEach(s => s.classList.remove('active-section'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active-section');
    /* Re-run scroll reveal for newly visible elements */
    target.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => {
      if (!el.classList.contains('revealed')) el.classList.add('revealed');
    });
    window.scrollTo({top: document.querySelector('.newspaper-nav')?.offsetTop - 10 ?? 0, behavior:'smooth'});
  }
}

/* ════════════════════════════════════════
   GAME TAB SWITCHING
════════════════════════════════════════ */
window.showGame = function(name) {
  document.querySelectorAll('.game-container').forEach(c => c.classList.add('hidden'));
  document.getElementById('game-' + name)?.classList.remove('hidden');
  document.querySelectorAll('.game-tab').forEach(t => {
    const matches = (name === 'memory' && t.textContent.includes('Mushroom'))
                 || (name === 'garden' && t.textContent.includes('Fairy'))
                 || (name === 'wordsearch' && t.textContent.includes('Word'));
    t.classList.toggle('active', matches);
  });
  if (name === 'garden' && !gardenInitialized) {
    startGardenPassiveIncome();
    gardenInitialized = true;
  }
};

/* ════════════════════════════════════════
   DATE & WEATHER
════════════════════════════════════════ */
function initDate() {
  const el = document.getElementById('current-date');
  if (el) el.textContent = new Date().toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}

const WEATHERS = [
  {icon:'🌸',temp:'72°F',desc:'Magical & Mild'},
  {icon:'☀️',temp:'74°F',desc:'Sunny & Enchanted'},
  {icon:'🌙',temp:'65°F',desc:'Moonlit & Soft'},
  {icon:'🌦️',temp:'68°F',desc:'Petal Showers'},
  {icon:'🌤️',temp:'71°F',desc:'Fair & Whimsical'},
  {icon:'🌈',temp:'70°F',desc:'Rainbow After Rain'},
];
let wIdx = 0;
function initWeatherCycle() {
  setInterval(() => {
    wIdx = (wIdx + 1) % WEATHERS.length;
    const w = WEATHERS[wIdx];
    const icon = document.getElementById('weather-icon');
    const temp = document.getElementById('weather-temp');
    const desc = document.getElementById('weather-desc');
    if (icon) { icon.style.animation = 'none'; icon.textContent = w.icon; setTimeout(() => icon.style.animation = '', 10); }
    if (temp) temp.textContent = w.temp;
    if (desc) desc.textContent = w.desc;
  }, 14000);
}

/* ════════════════════════════════════════
   DAILY WISDOM
════════════════════════════════════════ */
const WISDOMS = [
  '"Even the smallest acorn holds the soul of a great oak. What dreams do you carry within?"',
  '"The forest does not hurry, yet everything is accomplished."',
  '"Be like the moss: soft, persistent, willing to grow anywhere you are planted."',
  '"A cottage without a garden is just a house. A house without magic is just walls."',
  '"The fairies leave gifts for those who remember to leave gifts first."',
  '"In the language of flowers, every petal is a sentence waiting to be read."',
  '"Brew your tea with intention. Every cup is a spell, every sip a prayer."',
  '"The mushrooms remember what the trees forgot. Ask them, if you dare."',
  '"Magic is just attention paid to the right things, at the right moment."',
];
function rotateDailyWisdom() {
  const el = document.getElementById('daily-wisdom');
  if (el) el.textContent = WISDOMS[Math.floor(Math.random() * WISDOMS.length)];
}

/* ════════════════════════════════════════
   PARTICLES & FIREFLIES
════════════════════════════════════════ */
function initParticles() {
  const c = document.getElementById('particles-container');
  if (!c) return;
  const emojis = ['🌸','🍂','✨','🌿','🍃','🌺','⭐','🌼','🍄','💫','🌸','🌷'];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.cssText = `left:${Math.random()*100}%;font-size:${.6+Math.random()*1}rem;animation-duration:${14+Math.random()*20}s;animation-delay:${-Math.random()*22}s;`;
    c.appendChild(p);
  }
}

function initFireflies() {
  const c = document.getElementById('fireflies-container');
  if (!c) return;
  for (let i = 0; i < 12; i++) {
    const ff = document.createElement('div');
    ff.className = 'firefly';
    ff.style.cssText = `left:${Math.random()*100}%;top:${20+Math.random()*70}%;--dx:${(Math.random()-.5)*120}px;--dy:${-40-Math.random()*80}px;--ex:${(Math.random()-.5)*80}px;--ey:${-60-Math.random()*100}px;animation-duration:${6+Math.random()*10}s;animation-delay:${-Math.random()*12}s;`;
    c.appendChild(ff);
  }
}

/* ════════════════════════════════════════
   MOON CALENDAR
════════════════════════════════════════ */
function initMoonCalendar() {
  const grid = document.getElementById('moon-calendar-grid');
  if (!grid) return;
  const moons = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
  const today = new Date().getDate();
  const days  = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  days.forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'moon-day';
    cell.style.cssText = 'font-size:.58rem;color:rgba(200,168,48,.8);font-weight:bold;';
    cell.textContent = d;
    grid.appendChild(cell);
  });
  /* May 2026 starts on Friday = index 5 */
  for (let i = 0; i < 5; i++) grid.appendChild(Object.assign(document.createElement('div'),{className:'moon-day'}));
  for (let d = 1; d <= 31; d++) {
    const cell = document.createElement('div');
    cell.className = 'moon-day' + (d === today ? ' today' : '');
    const phaseIdx = Math.floor(((d-1)/30)*8) % 8;
    cell.innerHTML = `<span class="moon-emoji">${moons[phaseIdx]}</span><span class="moon-num">${d}</span>`;
    grid.appendChild(cell);
  }
  const phaseEl = document.getElementById('moon-phase');
  if (phaseEl) {
    const names = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
    const pi = Math.floor(((today-1)/30)*8) % 8;
    phaseEl.textContent = moons[pi] + ' ' + names[pi];
  }
}

/* ════════════════════════════════════════
   STORY GENERATOR
════════════════════════════════════════ */
const NAMES = ['Elowen Fernsby','Sable Ashwick','Rowan Mossbridge','Clover Thatchwick','Nell Birchwood','Jasper Willowmere','Fern Duskhollow','Wren Silverbell','Aldric Graymantle','Ivy Thornveil'];
const rName = () => NAMES[Math.floor(Math.random() * NAMES.length)];
const ucFirst = s => s.charAt(0).toUpperCase() + s.slice(1);

const STORY_TEMPLATES = [
  (h,q,s,it) => `<p>Once upon a time in <em>${s}</em>, there lived ${h} named ${rName()}. Life was simple and sweet — mornings spent gathering dewdrops, evenings spent watching the stars emerge like shy children peeking around a curtain.</p><p>But all that changed on the day ${rName()} arrived at the cottage door, breathless and wild-eyed, speaking of great catastrophe: someone needed to <strong>${q}</strong>.</p><p>"You are the only one," they said. "The elders have foreseen it. And you will need this." From beneath their cloak they produced <em>${it}</em>, which glowed with a light that seemed to remember every moon it had ever seen.</p><p>And so, with a satchel of dried herbs, a heart full of stubborn hope, and ${it} tucked carefully under one arm, ${ucFirst(h)} set out into the unknown…</p>`,
  (h,q,s,it) => `<p>It began, as most important things do, with a cup of tea going cold.</p><p>${ucFirst(h)} was sitting in the window of their little home in <em>${s}</em>, watching the fog roll in from the hills, when something fell from the sky: <em>${it}</em>, trailing a ribbon of smoke and starlight.</p><p>"Oh dear," said ${ucFirst(h)} quietly. This was either a gift or a warning, and in the Enchanted Realm, the two were often difficult to tell apart.</p><p>Three days later, having consulted the Speaking Mushrooms, a very elderly bat named ${rName()}, and one extremely opinionated hedgehog, they understood at last. They would have to <strong>${q}</strong>. And they would have to do it before the next full moon.</p><p>"Well then," said ${ucFirst(h)}, re-lacing their boots and tucking ${it} into their satchel. "There is no use dawdling."</p>`,
  (h,q,s,it) => `<p>In the oldest corner of <em>${s}</em>, where the paths had grown so faint they were really more of a suggestion, ${h} had been living quietly for seven years.</p><p>They had come to forget the world, and the world, to its credit, had mostly obliged — until ${rName()} arrived with news that would change everything: someone needed to <strong>${q}</strong>, and all the signs pointed here.</p><p>"The signs always point to someone inconvenient," muttered ${ucFirst(h)}, already reaching for their cloak.</p><p>The journey ahead would take them through the Whispering Fen, past the Three Crow Stone, and deep into places no map had ever troubled to draw. But first — <em>${it}</em>. Without it, there was no hope at all.</p><p>That would have to be enough.</p>`,
];

window.generateStory = function() {
  const h  = document.getElementById('story-hero').value;
  const q  = document.getElementById('story-quest').value;
  const s  = document.getElementById('story-setting').value;
  const it = document.getElementById('story-item').value;
  const tpl = STORY_TEMPLATES[Math.floor(Math.random() * STORY_TEMPLATES.length)];
  const out = document.getElementById('story-output');
  out.innerHTML = `<div class="story-text">${tpl(h,q,s,it)}<p style="text-align:center;color:rgba(255,255,200,.55);font-style:italic;margin-top:16px">~ To be continued in the next edition ~</p></div>`;
};

/* ════════════════════════════════════════
   GAME 1: MUSHROOM MEMORY MATCH
════════════════════════════════════════ */
let memFlipped = [], memMatched = 0, memMoves = 0, memSecs = 0;
let memLocked = false, memTimer = null;

const CARD_ICONS = ['🍄','🌸','🦋','🌙','⭐','🌿','🦔','🍀','🌺','🐛','🌛','🌼'];

function initMemoryGame() {
  clearInterval(memTimer);
  memFlipped = []; memMatched = 0; memMoves = 0; memSecs = 0; memLocked = false;
  document.getElementById('mem-pairs').textContent = '0/8';
  document.getElementById('mem-moves').textContent = '0';
  document.getElementById('mem-score').textContent = '0';
  document.getElementById('mem-timer').textContent = '0:00';
  document.getElementById('mem-message').textContent = '';

  const pairs = CARD_ICONS.slice(0, 8);
  const deck  = [...pairs, ...pairs].sort(() => Math.random() - .5);

  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  deck.forEach((sym, i) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.sym = sym;
    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="card-back"><div class="card-back-inner">🌿🌿🌿🌿</div></div>
        <div class="card-front">${sym}</div>
      </div>`;
    card.addEventListener('click', onMemClick);
    grid.appendChild(card);
  });

  memTimer = setInterval(() => {
    memSecs++;
    const m = Math.floor(memSecs/60), s = memSecs % 60;
    document.getElementById('mem-timer').textContent = `${m}:${s.toString().padStart(2,'0')}`;
  }, 1000);
}

function onMemClick(e) {
  if (memLocked) return;
  const card = e.currentTarget;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  memFlipped.push(card);
  if (memFlipped.length < 2) return;
  memMoves++;
  document.getElementById('mem-moves').textContent = memMoves;
  memLocked = true;
  const [a, b] = memFlipped;
  if (a.dataset.sym === b.dataset.sym) {
    a.classList.add('matched'); b.classList.add('matched');
    memMatched++; memFlipped = []; memLocked = false;
    document.getElementById('mem-pairs').textContent = `${memMatched}/8`;
    const score = Math.max(0, 1000 - memMoves * 15 - memSecs * 2) + memMatched * 50;
    document.getElementById('mem-score').textContent = score;
    if (memMatched === 8) { clearInterval(memTimer); showMemWin(score); }
  } else {
    setTimeout(() => {
      a.classList.remove('flipped'); b.classList.remove('flipped');
      memFlipped = []; memLocked = false;
    }, 950);
  }
}

const MEM_WIN_MSGS = [
  s => `✨ The mushrooms bow in your honour! Score: ${s}`,
  s => `🍄 Magnificent! The fairy ring celebrates! Score: ${s}`,
  s => `🌟 The forest spirits sing your name! Score: ${s}`,
  s => `🌸 Enchanting! The petals fall in celebration! Score: ${s}`,
];
function showMemWin(score) {
  document.getElementById('mem-message').textContent = MEM_WIN_MSGS[Math.floor(Math.random()*MEM_WIN_MSGS.length)](score);
}

/* ════════════════════════════════════════
   GAME 2: FAIRY GARDEN CLICKER
════════════════════════════════════════ */
let fairyDust = 0, dustPerSec = 0, dustPerClick = 1;
let gardenInitialized = false, gardenInterval = null;

const PLANT_STAGES = [
  {emoji:'🪨',name:'Bare',     val:0},
  {emoji:'🌱',name:'Seedling', val:1},
  {emoji:'🌿',name:'Sprout',   val:2},
  {emoji:'🌸',name:'Bloom',    val:5},
  {emoji:'🌺',name:'Flower',   val:12},
  {emoji:'✨🌺',name:'Enchanted',val:25},
];

const UPGRADES = [
  {id:'rain',  name:'Rain Blessing',    icon:'🌧️',cost:50,   desc:'+3 dust/sec',        dps:3,  cb:0, bought:false},
  {id:'sun',   name:'Sunbeam Enchant',  icon:'☀️',cost:150,  desc:'+8 dust/sec',        dps:8,  cb:0, bought:false},
  {id:'wand',  name:'Crystal Wand',     icon:'🪄',cost:100,  desc:'+5 dust per click',  dps:0,  cb:5, bought:false},
  {id:'fairy', name:'Fairy Helper',     icon:'🧚',cost:400,  desc:'+20 dust/sec',       dps:20, cb:0, bought:false},
  {id:'gloves',name:'Enchanted Gloves', icon:'🧤',cost:300,  desc:'+10 dust per click', dps:0,  cb:10,bought:false},
  {id:'moon',  name:'Moonwater Ritual', icon:'🌙',cost:1000, desc:'+50 dust/sec',       dps:50, cb:0, bought:false},
  {id:'star',  name:'Star Net',         icon:'🌟',cost:2000, desc:'+100 dust/sec',      dps:100,cb:0, bought:false},
  {id:'dragon',name:'Friendly Firedrake',icon:'🐉',cost:5000,desc:'+300 dust/sec',      dps:300,cb:0, bought:false},
];

let gardenPlots = Array(15).fill(null).map((_,i) => ({id:i, stage: i < 5 ? 1 : 0}));

function initGardenGame() {
  renderGardenPlot();
  renderUpgrades();
  updateGardenDisplay();
  addGardenLog('🌿 Your garden awakens…');
  addGardenLog('💧 Click plants or water the garden to collect fairy dust!');
}

function renderGardenPlot() {
  const plot = document.getElementById('garden-plot');
  if (!plot) return;
  plot.innerHTML = '';
  gardenPlots.forEach(p => {
    const stage = PLANT_STAGES[p.stage];
    const el = document.createElement('div');
    el.className = 'garden-plant';
    el.innerHTML = `<span class="plant-emoji">${stage.emoji}</span><span class="plant-stage">${stage.name}</span>`;
    el.addEventListener('click', () => clickPlant(p, el));
    plot.appendChild(el);
  });
}

function clickPlant(plotData, el) {
  if (PLANT_STAGES[plotData.stage].val === 0) return;
  const gained = PLANT_STAGES[plotData.stage].val + dustPerClick - 1;
  fairyDust += gained;
  updateGardenDisplay();
  const popup = document.createElement('div');
  popup.className = 'dust-popup';
  popup.textContent = `+${gained} ✨`;
  el.appendChild(popup);
  setTimeout(() => popup.remove(), 900);
  if (Math.random() < .07 && plotData.stage < PLANT_STAGES.length - 1) {
    plotData.stage++;
    renderGardenPlot();
    addGardenLog(`🌺 A plant grew to ${PLANT_STAGES[plotData.stage].name}!`);
  }
  renderUpgrades();
}

window.waterGarden = function() {
  const active = gardenPlots.filter(p => p.stage > 0);
  const total  = active.reduce((s, p) => s + PLANT_STAGES[p.stage].val, 0) + dustPerClick * active.length;
  fairyDust += total;
  updateGardenDisplay();
  addGardenLog(`💧 Watered the garden. Gained ${total} ✨`);
  if (Math.random() < .3) {
    const idx = Math.floor(Math.random() * gardenPlots.length);
    const p = gardenPlots[idx];
    if (p.stage === 0) { p.stage = 1; renderGardenPlot(); addGardenLog('🌱 A new seedling sprouted!'); }
    else if (p.stage < PLANT_STAGES.length - 1) { p.stage++; renderGardenPlot(); addGardenLog('🌸 A plant bloomed further!'); }
  }
  renderUpgrades();
};

function renderUpgrades() {
  const list = document.getElementById('upgrade-list');
  if (!list) return;
  list.innerHTML = '';
  UPGRADES.forEach(u => {
    if (u.bought) return;
    const el = document.createElement('div');
    el.className = 'upgrade-item' + (fairyDust < u.cost ? ' unaffordable' : '');
    el.innerHTML = `<div class="upgrade-icon">${u.icon}</div><div class="upgrade-info"><div class="upgrade-name">${u.name}</div><div class="upgrade-desc">${u.desc}</div></div><div class="upgrade-cost">${u.cost} ✨</div>`;
    el.addEventListener('click', () => buyUpgrade(u));
    list.appendChild(el);
  });
}

function buyUpgrade(u) {
  if (fairyDust < u.cost || u.bought) return;
  fairyDust -= u.cost; u.bought = true;
  dustPerSec += u.dps; dustPerClick += u.cb;
  document.getElementById('fd-per-sec').textContent  = dustPerSec;
  document.getElementById('water-power').textContent = dustPerClick;
  addGardenLog(`✨ Purchased: ${u.name}!`);
  if (u.dps) addGardenLog(`🌟 Now earning ${dustPerSec} dust/sec.`);
  renderUpgrades(); updateGardenDisplay();
}

function startGardenPassiveIncome() {
  if (gardenInterval) return;
  gardenInterval = setInterval(() => {
    if (dustPerSec > 0) { fairyDust += dustPerSec; updateGardenDisplay(); renderUpgrades(); }
  }, 1000);
}

function updateGardenDisplay() {
  document.getElementById('fd-amount').textContent = Math.floor(fairyDust).toLocaleString();
}

function addGardenLog(msg) {
  const log = document.getElementById('garden-log');
  if (!log) return;
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  const now = new Date();
  entry.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')} — ${msg}`;
  log.insertBefore(entry, log.firstChild);
  while (log.children.length > 25) log.removeChild(log.lastChild);
}

/* ════════════════════════════════════════
   GAME 3: WORD SEARCH
════════════════════════════════════════ */
const WS_WORDS = ['MUSHROOM','FAIRY','COTTAGE','FOREST','LAVENDER','BLOSSOM','MEADOW','WILLOW','ACORN','FERN','HONEY','MOSS','THISTLE','CLOVER','NETTLE','DEWDROP','MOONLIT','HEDGEHOG'];
const WS_SIZE  = 12;
let wsGrid = [], wsFoundWords = new Set(), wsTotalWords = 0;
let wsSelecting = false, wsStart = null, wsSelected = [];
let wsPlaced = [];

function initWordSearch() {
  wsFoundWords.clear(); wsSelecting = false; wsStart = null; wsSelected = []; wsPlaced = [];
  wsGrid = Array.from({length:WS_SIZE}, () => Array(WS_SIZE).fill(''));
  const chosen = [...WS_WORDS].sort(() => Math.random()-.5).slice(0, 10);
  wsTotalWords = chosen.length;
  chosen.forEach(w => placeWord(w));
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < WS_SIZE; r++) for (let c = 0; c < WS_SIZE; c++) if (!wsGrid[r][c]) wsGrid[r][c] = ALPHA[Math.floor(Math.random()*26)];
  renderWsGrid(); renderWordList(chosen); updateWsProgress();
  document.getElementById('ws-message').textContent = '';
}

function placeWord(word) {
  const dirs = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
  for (let attempt = 0; attempt < 250; attempt++) {
    const [dr,dc] = dirs[Math.floor(Math.random()*dirs.length)];
    const r = Math.floor(Math.random()*WS_SIZE), c = Math.floor(Math.random()*WS_SIZE);
    const er = r + dr*(word.length-1), ec = c + dc*(word.length-1);
    if (er < 0 || er >= WS_SIZE || ec < 0 || ec >= WS_SIZE) continue;
    let ok = true;
    for (let i = 0; i < word.length; i++) { const gr=r+dr*i,gc=c+dc*i; if (wsGrid[gr][gc] && wsGrid[gr][gc] !== word[i]){ok=false;break;} }
    if (!ok) continue;
    const cells = [];
    for (let i = 0; i < word.length; i++) { wsGrid[r+dr*i][c+dc*i] = word[i]; cells.push([r+dr*i,c+dc*i]); }
    wsPlaced.push({word,cells});
    return;
  }
}

function renderWsGrid() {
  const grid = document.getElementById('ws-grid');
  if (!grid) return;
  grid.style.gridTemplateColumns = `repeat(${WS_SIZE},1fr)`;
  grid.innerHTML = '';
  for (let r = 0; r < WS_SIZE; r++) for (let c = 0; c < WS_SIZE; c++) {
    const cell = document.createElement('div');
    cell.className = 'ws-cell';
    cell.textContent = wsGrid[r][c];
    cell.dataset.r = r; cell.dataset.c = c;
    cell.addEventListener('mousedown', wsDown);
    cell.addEventListener('mouseenter', wsEnter);
    cell.addEventListener('mouseup', wsUp);
    cell.addEventListener('touchstart', wsTouchStart, {passive:true});
    cell.addEventListener('touchmove', wsTouchMove, {passive:false});
    cell.addEventListener('touchend', wsUp);
    grid.appendChild(cell);
  }
}

function wsCell(r,c) { return document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`); }

function wsDown(e) {
  wsSelecting = true;
  wsStart = {r:+e.target.dataset.r, c:+e.target.dataset.c};
  wsSelected = [wsStart];
  highlightWs();
}

function wsEnter(e) {
  if (!wsSelecting) return;
  const r = +e.target.dataset.r, c = +e.target.dataset.c;
  const dr = Math.sign(r - wsStart.r), dc = Math.sign(c - wsStart.c);
  if (!dr && !dc) return;
  const len = Math.max(Math.abs(r-wsStart.r), Math.abs(c-wsStart.c));
  wsSelected = [];
  for (let i = 0; i <= len; i++) wsSelected.push({r:wsStart.r+dr*i, c:wsStart.c+dc*i});
  highlightWs();
}

function wsUp() {
  if (!wsSelecting) return;
  wsSelecting = false;
  checkWsMatch();
  clearWsHighlight();
}

function wsTouchStart(e) {
  const t = e.touches[0], el = document.elementFromPoint(t.clientX, t.clientY);
  if (el?.classList.contains('ws-cell')) wsDown({target:el});
}
function wsTouchMove(e) {
  e.preventDefault();
  const t = e.touches[0], el = document.elementFromPoint(t.clientX, t.clientY);
  if (el?.classList.contains('ws-cell')) wsEnter({target:el});
}

function highlightWs() {
  document.querySelectorAll('.ws-cell.selected').forEach(el => el.classList.remove('selected'));
  wsSelected.forEach(({r,c}) => { const el = wsCell(r,c); if (el && !el.classList.contains('found')) el.classList.add('selected'); });
}

function clearWsHighlight() {
  document.querySelectorAll('.ws-cell.selected').forEach(el => el.classList.remove('selected'));
  wsSelected = [];
}

function checkWsMatch() {
  const str = wsSelected.map(({r,c}) => wsGrid[r][c]).join('');
  const rev = [...str].reverse().join('');
  let hit = null;
  wsPlaced.forEach(pw => { if ((pw.word===str||pw.word===rev) && !wsFoundWords.has(pw.word)) hit=pw; });
  if (!hit) return;
  wsFoundWords.add(hit.word);
  hit.cells.forEach(([r,c]) => { const el=wsCell(r,c); if(el){el.classList.remove('selected');el.classList.add('found');} });
  document.querySelector(`.ws-word-item[data-word="${hit.word}"]`)?.classList.add('found');
  updateWsProgress();
  if (wsFoundWords.size === wsTotalWords) document.getElementById('ws-message').textContent = '🌸 Magnificent! You found all the enchanted words!';
}

function renderWordList(words) {
  const list = document.getElementById('ws-word-list');
  if (!list) return;
  list.innerHTML = '';
  words.forEach(w => {
    const el = document.createElement('div');
    el.className = 'ws-word-item'; el.dataset.word = w;
    el.textContent = w[0] + w.slice(1).toLowerCase();
    list.appendChild(el);
  });
}

function updateWsProgress() {
  const n = wsFoundWords.size, pct = wsTotalWords ? (n/wsTotalWords)*100 : 0;
  const fill = document.getElementById('ws-progress-fill');
  const text = document.getElementById('ws-progress-text');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `${n} / ${wsTotalWords} words`;
}

/* ════════════════════════════════════════
   HOROSCOPE
════════════════════════════════════════ */
const ZODIAC = [
  {emoji:'🌿',name:'The Willow',     dates:'Mar 21 – Apr 19',element:'Earth',lucky:'3', flower:'Violet',   stone:'Moss Agate', love:'A tender connection deepens under the waxing moon. Leave a wildflower on their windowsill.', work:'Your patience with a slow-growing project finally bears fruit. Trust the timing of the earth.', magic:'Carry rosemary and make wishes on every spider\'s web you see.', body:'The Willow bends but never breaks. This week, your flexibility is your greatest strength. A chance encounter near water brings unexpected wisdom — listen to it carefully.'},
  {emoji:'🍄',name:'The Mushroom',   dates:'Apr 20 – May 20',element:'Wood', lucky:'7', flower:'Lily of the Valley',stone:'Rose Quartz',love:'Your calm, grounded energy draws someone special like bees to clover.',work:'A hidden network of support reveals itself. The roots run deeper than you knew.',magic:'Find a fairy ring and walk around it three times clockwise at dawn.',body:'The Mushroom reminds us that the most vital connections happen underground, unseen. This week, nurture your invisible bonds and watch what grows.'},
  {emoji:'🦋',name:'The Butterfly',  dates:'May 21 – Jun 20',element:'Air',  lucky:'11',flower:'Foxglove', stone:'Citrine',    love:'Your curious heart makes you irresistible. Be honest about what you\'re looking for.',work:'Two opportunities flutter before you. Choose with your gut, not your logic.',magic:'Write your wish on a leaf and release it to a stream.',body:'Transformation is your birthright, dear Butterfly. This week\'s changes, though sudden, carry you exactly where you were always meant to land.'},
  {emoji:'🌙',name:'The Moon Hare',  dates:'Jun 21 – Jul 22',element:'Water',lucky:'2', flower:'White Rose',stone:'Moonstone',  love:'The full moon illuminates what your heart has been whispering. Listen.',work:'Intuition over logic this week. Your gut knows before your mind catches up.',magic:'Leave a bowl of water in moonlight overnight and wash your face with it at dawn.',body:'You feel everything so deeply, Moon Hare. This is your power, not your weakness. This week, honour your sensitivity as the gift it truly is.'},
  {emoji:'🦁',name:'The Golden Stag',dates:'Jul 23 – Aug 22',element:'Fire', lucky:'1', flower:'Sunflower', stone:'Amber',      love:'You shine so brightly. Choose someone who can look at you directly.',work:'Your moment to lead has arrived. Step into it with the grace of the forest king.',magic:'Light a golden candle at sunset and speak your desires aloud to the flame.',body:'The Stag does not apologise for its crown. Walk with the dignity of one who knows their worth, and the forest will part before you.'},
  {emoji:'🌾',name:'The Harvest Witch',dates:'Aug 23 – Sep 22',element:'Earth',lucky:'6',flower:'Chamomile',stone:'Peridot',   love:'Love grows in small, careful acts of service. Yours is noticed and cherished.',work:'Your meticulous attention to detail saves the day. Let it.',magic:'Bundle three herbs from your garden and hang them above your door.',body:'You see what others overlook, Harvest Witch. This week, your eye for the overlooked detail reveals something remarkable.'},
  {emoji:'⚖️',name:'The Silver Fox',  dates:'Sep 23 – Oct 22',element:'Air',  lucky:'8', flower:'Rose',     stone:'Opal',       love:'Balance is needed. Give as much as you receive, no more, no less.',work:'A negotiation goes in your favour. Your charm is your best tool.',magic:'Hold a smooth stone in each hand and find your centre.',body:'The Fox is cunning not from cruelty but from necessity. This week, your cleverness finds a graceful solution that serves everyone.'},
  {emoji:'🕷️',name:'The Spider Queen',dates:'Oct 23 – Nov 21',element:'Water',lucky:'9',flower:'Dark Orchid',stone:'Obsidian',  love:'Depth is what you seek. Anything surface-level feels like a cage.',work:'You see through the illusion to the truth. Share what you see, gently.',magic:'Weave a small intention into a piece of thread and keep it in your pocket.',body:'The Spider Queen builds intricate worlds. Examine the patterns in your life this week. Which threads serve you, and which have you outgrown?'},
  {emoji:'🏹',name:'The Wandering Arrow',dates:'Nov 22 – Dec 21',element:'Fire',lucky:'5',flower:'Jasmine',stone:'Turquoise',love:'Your honesty is refreshing. Someone has been waiting for a person like you.',work:'A distant opportunity materialises. Be ready to move quickly.',magic:'Take the longest path home. Notice what you find.',body:'The Arrow knows its direction before it flies. This week, trust your aim. You are pointing toward exactly the right thing.'},
  {emoji:'🐐',name:'The Mountain Wren',dates:'Dec 22 – Jan 19',element:'Earth',lucky:'4',flower:'Ivy',stone:'Garnet',          love:'Your steadiness is a rare and precious thing. The right person knows how to treasure it.',work:'Slow, deliberate progress beats desperate rushing every time.',magic:'Plant something with the intention of commitment. Watch it grow.',body:'The Wren reaches heights others cannot because it takes one careful step at a time. This week, your persistence reaches its reward.'},
  {emoji:'🌊',name:'The River Spirit', dates:'Jan 20 – Feb 18',element:'Water',lucky:'11',flower:'Water Lily',stone:'Aquamarine',love:'Your unconventional approach to love is exactly what someone has been dreaming of.',work:'An innovative idea that seemed strange now seems obvious. Trust it.',magic:'Let a paper boat carry your wishes downstream.',body:'The River does not ask permission from the stone before finding its way around it. This week, flow around obstacles rather than through them.'},
  {emoji:'🐟',name:'The Dreaming Fish',dates:'Feb 19 – Mar 20',element:'Water',lucky:'12',flower:'Lotus',stone:'Amethyst',      love:'Your romantic imagination is your most beautiful quality. Let someone dive into your world.',work:'A creative vision crystallises into something you can finally share.',magic:'Sleep with a flower beneath your pillow and record your dreams at dawn.',body:'The Fish swims between two worlds. This week, your ability to hold contradictions — the dreamer and the doer — becomes your greatest asset.'},
];

function initHoroscope() {
  const grid = document.getElementById('zodiac-grid');
  if (!grid) return;
  ZODIAC.forEach(sign => {
    const btn = document.createElement('button');
    btn.className = 'zodiac-sign-btn';
    btn.innerHTML = `<span class="zodiac-emoji">${sign.emoji}</span><span class="zodiac-name">${sign.name}</span>`;
    btn.addEventListener('click', () => showHoroscope(sign, btn));
    grid.appendChild(btn);
  });
}

function showHoroscope(sign, btn) {
  document.querySelectorAll('.zodiac-sign-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('horoscope-reading').innerHTML = `
    <div class="horoscope-content" style="color:white">
      <div class="horoscope-sign-header">
        <div class="horoscope-sign-emoji">${sign.emoji}</div>
        <div>
          <div class="horoscope-sign-name">${sign.name}</div>
          <div class="horoscope-sign-dates">${sign.dates} · ${sign.element} Sign</div>
        </div>
      </div>
      <p class="horoscope-body">${sign.body}</p>
      <div class="horoscope-sections">
        <div><div class="horoscope-area-title">💕 Love & Heart</div><div class="horoscope-area-text">${sign.love}</div></div>
        <div><div class="horoscope-area-title">🌿 Work & Craft</div><div class="horoscope-area-text">${sign.work}</div></div>
        <div><div class="horoscope-area-title">✨ Enchantment</div><div class="horoscope-area-text">${sign.magic}</div></div>
      </div>
      <div class="horoscope-lucky">
        <div class="lucky-item"><div class="lucky-label">Lucky Number</div><div class="lucky-value">${sign.lucky}</div></div>
        <div class="lucky-item"><div class="lucky-label">Sacred Flower</div><div class="lucky-value">${sign.flower}</div></div>
        <div class="lucky-item"><div class="lucky-label">Power Stone</div><div class="lucky-value">${sign.stone}</div></div>
        <div class="lucky-item"><div class="lucky-label">Element</div><div class="lucky-value">${sign.element}</div></div>
      </div>
    </div>`;
}
