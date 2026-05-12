/* =====================================================
   THE ENCHANTED GAZETTE — JavaScript
   ===================================================== */

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  setDate();
  initParticles();
  initFireflies();
  initNavigation();
  initMemoryGame();
  initGardenGame();
  initWordSearch();
  initHoroscope();
  initMoonCalendar();
  initWeatherCycle();
  rotateDailyWisdom();
  animateMasthead();
});

/* ── DATE ── */
function setDate() {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const el = document.getElementById('current-date');
  if (el) el.textContent = new Date().toLocaleDateString('en-GB', opts);
}

/* ── PARTICLES ── */
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  const emojis = ['🌸','🍂','✨','🌿','🍃','🌺','⭐','🌼','🍄','💫','🌸','🌷'];
  let count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${0.6 + Math.random() * 1.2}rem;
      animation-duration: ${12 + Math.random() * 20}s;
      animation-delay: ${-Math.random() * 20}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

function initFireflies() {
  const container = document.getElementById('fireflies-container');
  if (!container) return;
  for (let i = 0; i < 14; i++) {
    const ff = document.createElement('div');
    ff.className = 'firefly';
    const dx = (Math.random() - 0.5) * 120;
    const dy = -40 - Math.random() * 80;
    const ex = (Math.random() - 0.5) * 80;
    const ey = -60 - Math.random() * 100;
    ff.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${20 + Math.random() * 70}%;
      --drift-x: ${dx}px;
      --drift-y: ${dy}px;
      --end-x: ${ex}px;
      --end-y: ${ey}px;
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${-Math.random() * 12}s;
    `;
    container.appendChild(ff);
  }
}

/* ── NAVIGATION ── */
function initNavigation() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.section;
      switchSection(target);
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec && sec.classList.contains('paper-section')) {
        e.preventDefault();
        switchSection(id);
        document.querySelectorAll('.nav-link').forEach(l => {
          l.classList.toggle('active', l.dataset.section === id);
        });
      }
    });
  });
}

function switchSection(id) {
  document.querySelectorAll('.paper-section').forEach(s => s.classList.remove('active-section'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active-section');
    window.scrollTo({ top: document.querySelector('.newspaper-nav').offsetTop - 10, behavior: 'smooth' });
  }
}

/* ── GAME TAB SWITCHING ── */
window.showGame = function(name) {
  document.querySelectorAll('.game-container').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('game-' + name).classList.remove('hidden');
  document.querySelectorAll('.game-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(name === 'memory' ? 'mushroom' : name === 'garden' ? 'fairy' : 'word')) {
      t.classList.add('active');
    }
  });
  if (name === 'garden' && !gardenInitialized) {
    startGardenPassiveIncome();
    gardenInitialized = true;
  }
};

/* ── WEATHER CYCLE ── */
const weathers = [
  { icon: '🌸', temp: '72°F', desc: 'Magical & Mild' },
  { icon: '☀️', temp: '74°F', desc: 'Sunny & Enchanted' },
  { icon: '🌙', temp: '65°F', desc: 'Moonlit & Soft' },
  { icon: '🌦️', temp: '68°F', desc: 'Petal Showers' },
  { icon: '🌤️', temp: '71°F', desc: 'Fair & Whimsical' },
  { icon: '🌈', temp: '70°F', desc: 'Rainbow After Rain' },
];
let wIdx = 0;

function initWeatherCycle() {
  setInterval(() => {
    wIdx = (wIdx + 1) % weathers.length;
    const w = weathers[wIdx];
    const icon = document.getElementById('weather-icon');
    const temp = document.getElementById('weather-temp');
    const desc = document.getElementById('weather-desc');
    if (icon) icon.textContent = w.icon;
    if (temp) temp.textContent = w.temp;
    if (desc) desc.textContent = w.desc;
  }, 12000);
}

/* ── DAILY WISDOM ── */
const wisdoms = [
  '"Even the smallest acorn holds the soul of a great oak. What dreams do you carry within?"',
  '"The forest does not hurry, yet everything is accomplished."',
  '"Be like the moss: soft, persistent, and willing to grow anywhere you are planted."',
  '"A cottage without a garden is just a house. A house without magic is just walls."',
  '"The fairies leave gifts for those who remember to leave gifts first."',
  '"In the language of flowers, every petal is a sentence waiting to be read."',
  '"Brew your tea with intention. Every cup is a spell, every sip a prayer."',
  '"The mushrooms remember what the trees forgot. Ask them, if you dare."',
  '"Magic is just attention paid to the right things, at the right moment."',
];

function rotateDailyWisdom() {
  const el = document.getElementById('daily-wisdom');
  if (!el) return;
  const idx = Math.floor(Math.random() * wisdoms.length);
  el.textContent = wisdoms[idx];
}

/* ── MASTHEAD ANIMATION ── */
function animateMasthead() {
  const title = document.querySelector('.title-main');
  if (!title) return;
  title.addEventListener('mouseover', () => {
    title.style.filter = 'brightness(1.2)';
  });
  title.addEventListener('mouseout', () => {
    title.style.filter = '';
  });
}

/* ── MOON CALENDAR ── */
function initMoonCalendar() {
  const grid = document.getElementById('moon-calendar-grid');
  if (!grid) return;
  const moons = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
  const today = new Date().getDate();
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  // Day-of-week header
  days.forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'moon-day';
    cell.style.cssText = 'font-size:0.6rem; color:rgba(200,168,48,0.8); font-weight:bold;';
    cell.textContent = d;
    grid.appendChild(cell);
  });
  // Days of May 2026 (starts Thursday = index 4)
  for (let i = 0; i < 4; i++) {
    const blank = document.createElement('div');
    blank.className = 'moon-day';
    grid.appendChild(blank);
  }
  for (let d = 1; d <= 31; d++) {
    const cell = document.createElement('div');
    cell.className = 'moon-day' + (d === today ? ' today' : '');
    const moonPhase = moons[Math.floor(((d - 1) / 30) * 8) % 8];
    cell.innerHTML = `<span class="moon-emoji">${moonPhase}</span><span class="moon-num">${d}</span>`;
    grid.appendChild(cell);
  }
  // Update moon phase in weather
  const now = today;
  const phaseEl = document.getElementById('moon-phase');
  if (phaseEl) {
    const phaseNames = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
    const phaseIdx = Math.floor(((now - 1) / 30) * 8) % 8;
    phaseEl.textContent = moons[phaseIdx] + ' ' + phaseNames[phaseIdx];
  }
}

/* ── STORY GENERATOR ── */
const storyTemplates = [
  (hero, quest, setting, item) => `
    <div class="story-text">
      <p>Once upon a time in <em>${setting}</em>, there lived ${hero} named ${randomName()}. Life was simple and sweet — mornings spent gathering dewdrops, evenings spent watching the stars emerge one by one like shy children peeking around a curtain.</p>
      <p>But all that changed on the day ${randomName()} arrived at the cottage door, breathless and wild-eyed, speaking of a great catastrophe: the need to <strong>${quest}</strong>.</p>
      <p>"You are the only one," they said. "The elders have foreseen it. And you will need this." From their cloak they produced <em>${item}</em>, which glowed with a light that seemed to remember every moon it had ever seen.</p>
      <p>And so, with nothing but a packed satchel of dried herbs, a heart full of stubborn hope, and ${item} tucked carefully beneath one arm, ${randomHero()} set out into the unknown...</p>
      <p style="text-align:center; color:rgba(255,255,200,0.6); font-style:italic; margin-top:16px;">~ To be continued in the next edition ~</p>
    </div>
  `,
  (hero, quest, setting, item) => `
    <div class="story-text">
      <p>It began, as most important things do, with a cup of tea going cold.</p>
      <p>${ucFirst(hero)} was sitting in the window of their little home in <em>${setting}</em>, watching the fog roll in from the hills, when something fell from the sky: ${item}, trailing a ribbon of smoke and starlight.</p>
      <p>"Oh dear," said the hero quietly. This was either a gift or a warning, and in the Enchanted Realm, the two were often difficult to tell apart.</p>
      <p>Three days later, having consulted with the Speaking Mushrooms, a very elderly bat named ${randomName()}, and one extremely opinionated hedgehog, they understood at last. They would have to <strong>${quest}</strong>. And they would have to do it before the next full moon.</p>
      <p>"Well then," said ${ucFirst(hero)}, re-lacing their boots and tucking ${item} safely into their satchel. "There is no use dawdling."</p>
      <p style="text-align:center; color:rgba(255,255,200,0.6); font-style:italic; margin-top:16px;">~ The adventure has only just begun ~</p>
    </div>
  `,
  (hero, quest, setting, item) => `
    <div class="story-text">
      <p>In the oldest corner of <em>${setting}</em>, where the paths had grown so faint they were really more of a suggestion, ${hero} had been living quietly for seven years.</p>
      <p>They had come to forget the world, and the world, to its credit, had mostly obliged. Until ${randomName()} arrived with the news that would change everything: someone needed to <strong>${quest}</strong>, and all the signs pointed to ${hero}.</p>
      <p>"The signs always point to someone inconvenient," muttered the hero, but they were already reaching for their cloak.</p>
      <p>The journey would take them through the Whispering Fen, past the Three Crow Stone, and deep into places no map had ever bothered to draw. But first — ${item}. Without it, there was no hope at all. With it, there was at least a small, fluttering, stubborn chance.</p>
      <p>That would have to be enough.</p>
      <p style="text-align:center; color:rgba(255,255,200,0.6); font-style:italic; margin-top:16px;">~ Some stories choose their tellers ~</p>
    </div>
  `,
];

function randomName() {
  const names = ['Elowen Fernsby','Sable Ashwick','Rowan Mossbridge','Clovey Thatchwick','Nell Birchwood','Jasper Willowmere','Fern Duskhollow','Wren Silverbell','Aldric Graymantle','Ivy Thornveil'];
  return names[Math.floor(Math.random() * names.length)];
}
function randomHero() { return ['the hero','our traveller','the young wanderer','the cottage-dweller'][Math.floor(Math.random()*4)]; }
function ucFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

window.generateStory = function() {
  const hero = document.getElementById('story-hero').value;
  const quest = document.getElementById('story-quest').value;
  const setting = document.getElementById('story-setting').value;
  const item = document.getElementById('story-item').value;
  const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
  const output = document.getElementById('story-output');
  output.innerHTML = template(hero, quest, setting, item);
};

/* ══════════════════════════════════════════════════════
   GAME 1: MUSHROOM MEMORY MATCH
   ══════════════════════════════════════════════════════ */
let memCards = [], memFlipped = [], memMatched = 0, memMoves = 0, memTimerInterval = null, memSeconds = 0, memLocked = false;

const CARD_SYMBOLS = ['🍄','🌸','🦋','🌙','⭐','🌿','🦔','🍀','🌺','🐛','🌛','🌼'];

function initMemoryGame() {
  clearInterval(memTimerInterval);
  memFlipped = []; memMatched = 0; memMoves = 0; memSeconds = 0; memLocked = false;
  updateMemStats();
  document.getElementById('mem-message').textContent = '';
  document.getElementById('mem-timer').textContent = '0:00';

  const pairs = CARD_SYMBOLS.slice(0, 8);
  const deck = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
  memCards = deck;

  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  deck.forEach((symbol, i) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = i;
    card.dataset.symbol = symbol;
    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="card-back">
          <div class="card-back-pattern">🌿🌿🌿🌿</div>
        </div>
        <div class="card-front">${symbol}</div>
      </div>
    `;
    card.addEventListener('click', onMemCardClick);
    grid.appendChild(card);
  });

  memTimerInterval = setInterval(() => {
    memSeconds++;
    const m = Math.floor(memSeconds / 60);
    const s = memSeconds % 60;
    document.getElementById('mem-timer').textContent = `${m}:${s.toString().padStart(2,'0')}`;
  }, 1000);
}

function onMemCardClick(e) {
  if (memLocked) return;
  const card = e.currentTarget;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  memFlipped.push(card);
  if (memFlipped.length === 2) {
    memMoves++;
    document.getElementById('mem-moves').textContent = memMoves;
    memLocked = true;
    const [a, b] = memFlipped;
    if (a.dataset.symbol === b.dataset.symbol) {
      a.classList.add('matched');
      b.classList.add('matched');
      memMatched++;
      memFlipped = [];
      memLocked = false;
      const score = Math.max(0, 1000 - memMoves * 15 - memSeconds * 2) + memMatched * 50;
      document.getElementById('mem-score').textContent = score;
      document.getElementById('mem-pairs').textContent = `${memMatched}/8`;
      if (memMatched === 8) {
        clearInterval(memTimerInterval);
        showMemoryWin(score);
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        memFlipped = [];
        memLocked = false;
      }, 900);
    }
  }
}

function updateMemStats() {
  document.getElementById('mem-pairs').textContent = '0/8';
  document.getElementById('mem-moves').textContent = '0';
  document.getElementById('mem-score').textContent = '0';
}

function showMemoryWin(score) {
  const msgs = [
    `✨ The mushrooms bow in your honour! Score: ${score}`,
    `🍄 Magnificent! The fairy ring celebrates your victory! Score: ${score}`,
    `🌟 The forest spirits sing your name! Score: ${score}`,
    `🌸 Enchanting! The petals fall in celebration! Score: ${score}`,
  ];
  document.getElementById('mem-message').textContent = msgs[Math.floor(Math.random()*msgs.length)];
}

/* ══════════════════════════════════════════════════════
   GAME 2: FAIRY GARDEN CLICKER
   ══════════════════════════════════════════════════════ */
let fairyDust = 0, dustPerSec = 0, dustPerClick = 1, gardenInitialized = false;
let gardenInterval = null;

const PLANTS = [
  { stage: 0, emoji: '🪨', name: 'Bare Soil', clickValue: 0 },
  { stage: 1, emoji: '🌱', name: 'Seedling', clickValue: 1 },
  { stage: 2, emoji: '🌿', name: 'Sprout', clickValue: 2 },
  { stage: 3, emoji: '🌸', name: 'Bloom', clickValue: 5 },
  { stage: 4, emoji: '🌺', name: 'Full Flower', clickValue: 12 },
  { stage: 5, emoji: '✨🌺', name: 'Enchanted', clickValue: 25 },
];

const UPGRADES = [
  { id: 'rain',     name: 'Rain Blessing',      icon: '🌧️', cost: 50,   desc: '+3 dust/sec',       dps: 3,   clickBonus: 0, bought: false },
  { id: 'sun',      name: 'Sunbeam Enchant',     icon: '☀️', cost: 150,  desc: '+8 dust/sec',       dps: 8,   clickBonus: 0, bought: false },
  { id: 'fairy',    name: 'Fairy Helper',         icon: '🧚', cost: 400,  desc: '+20 dust/sec',      dps: 20,  clickBonus: 0, bought: false },
  { id: 'moon',     name: 'Moonwater Ritual',     icon: '🌙', cost: 1000, desc: '+50 dust/sec',      dps: 50,  clickBonus: 0, bought: false },
  { id: 'wand',     name: 'Crystal Wand',         icon: '🪄', cost: 100,  desc: '+5 dust per click', dps: 0,   clickBonus: 5, bought: false },
  { id: 'gloves',   name: 'Enchanted Gloves',     icon: '🧤', cost: 300,  desc: '+10 dust per click',dps: 0,   clickBonus: 10, bought: false },
  { id: 'star',     name: 'Star Gathering Net',   icon: '🌟', cost: 2000, desc: '+100 dust/sec',     dps: 100, clickBonus: 0, bought: false },
  { id: 'dragon',   name: 'Friendly Firedrake',   icon: '🐉', cost: 5000, desc: '+300 dust/sec',     dps: 300, clickBonus: 0, bought: false },
];

let gardenPlots = Array(15).fill(null).map((_, i) => ({
  id: i, stage: i < 5 ? 1 : 0
}));

function initGardenGame() {
  renderGardenPlot();
  renderUpgrades();
  updateGardenDisplay();
  addGardenLog('🌿 Your garden awakens...');
  addGardenLog('💧 Water your plants to collect fairy dust!');
}

function renderGardenPlot() {
  const plot = document.getElementById('garden-plot');
  if (!plot) return;
  plot.innerHTML = '';
  gardenPlots.forEach(p => {
    const plant = PLANTS[p.stage];
    const el = document.createElement('div');
    el.className = 'garden-plant';
    el.innerHTML = `<span class="plant-emoji">${plant.emoji}</span><span class="plant-stage">${plant.name}</span>`;
    el.addEventListener('click', () => clickPlant(p, el));
    plot.appendChild(el);
  });
}

function clickPlant(plotData, el) {
  const plant = PLANTS[plotData.stage];
  if (plant.clickValue === 0) return;
  const gained = plant.clickValue + dustPerClick - 1;
  fairyDust += gained;
  updateGardenDisplay();

  // Float popup
  const popup = document.createElement('div');
  popup.className = 'dust-popup';
  popup.textContent = `+${gained} ✨`;
  el.appendChild(popup);
  setTimeout(() => popup.remove(), 900);

  // Chance to grow plant
  if (Math.random() < 0.08 && plotData.stage < PLANTS.length - 1) {
    plotData.stage++;
    renderGardenPlot();
    addGardenLog(`🌺 A plant grew to ${PLANTS[plotData.stage].name}!`);
  }
}

window.waterGarden = function() {
  const gainable = gardenPlots.filter(p => p.stage > 0);
  const total = gainable.reduce((sum, p) => sum + PLANTS[p.stage].clickValue, 0) + dustPerClick * gainable.length;
  fairyDust += total;
  updateGardenDisplay();
  addGardenLog(`💧 Watered the garden. Gained ${total} ✨`);

  // Grow chance
  if (Math.random() < 0.25) {
    const idx = Math.floor(Math.random() * gardenPlots.length);
    if (gardenPlots[idx].stage < PLANTS.length - 1 && gardenPlots[idx].stage > 0) {
      gardenPlots[idx].stage++;
      renderGardenPlot();
      addGardenLog(`🌸 The watering made a plant bloom!`);
    } else if (gardenPlots[idx].stage === 0) {
      gardenPlots[idx].stage = 1;
      renderGardenPlot();
      addGardenLog(`🌱 A new seedling sprouted!`);
    }
  }
};

function renderUpgrades() {
  const list = document.getElementById('upgrade-list');
  if (!list) return;
  list.innerHTML = '';
  UPGRADES.forEach(u => {
    if (u.bought) return;
    const el = document.createElement('div');
    el.className = 'upgrade-item' + (fairyDust < u.cost ? ' unaffordable' : '');
    el.innerHTML = `
      <div class="upgrade-icon">${u.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${u.name}</div>
        <div class="upgrade-desc">${u.desc}</div>
      </div>
      <div class="upgrade-cost">${u.cost} ✨</div>
    `;
    el.addEventListener('click', () => purchaseUpgrade(u));
    list.appendChild(el);
  });
}

function purchaseUpgrade(upgrade) {
  if (fairyDust < upgrade.cost || upgrade.bought) return;
  fairyDust -= upgrade.cost;
  upgrade.bought = true;
  dustPerSec += upgrade.dps;
  dustPerClick += upgrade.clickBonus;
  document.getElementById('fd-per-sec').textContent = dustPerSec;
  document.getElementById('water-power').textContent = dustPerClick;
  addGardenLog(`✨ Purchased: ${upgrade.name}!`);
  if (upgrade.dps > 0) addGardenLog(`🌟 Now earning ${dustPerSec} dust per second.`);
  renderUpgrades();
  updateGardenDisplay();
}

function startGardenPassiveIncome() {
  if (gardenInterval) return;
  gardenInterval = setInterval(() => {
    if (dustPerSec > 0) {
      fairyDust += dustPerSec;
      updateGardenDisplay();
      renderUpgrades();
    }
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
  while (log.children.length > 30) log.removeChild(log.lastChild);
}

/* ══════════════════════════════════════════════════════
   GAME 3: WORD SEARCH
   ══════════════════════════════════════════════════════ */
const WS_WORDS = [
  'MUSHROOM','FAIRY','COTTAGE','FOREST','LAVENDER','BLOSSOM',
  'MEADOW','WILLOW','ACORN','FERN','HONEY','MOSS',
  'THISTLE','CLOVER','NETTLE','DEWDROP','MOONLIT','HEDGEHOG',
];

const WS_SIZE = 12;
let wsGrid = [], wsFoundWords = new Set(), wsTotalWords = 0;
let wsSelecting = false, wsStartCell = null, wsSelectedCells = [];
let wsPlacedWords = [];

function initWordSearch() {
  wsFoundWords.clear();
  wsSelecting = false;
  wsStartCell = null;
  wsSelectedCells = [];
  wsPlacedWords = [];
  wsGrid = Array.from({length: WS_SIZE}, () => Array(WS_SIZE).fill(''));

  // Pick 10 words that fit
  const chosen = [...WS_WORDS].sort(() => Math.random()-0.5).slice(0, 10);
  wsTotalWords = chosen.length;

  // Place words
  chosen.forEach(word => placeWordInGrid(word));

  // Fill blanks
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < WS_SIZE; r++)
    for (let c = 0; c < WS_SIZE; c++)
      if (!wsGrid[r][c]) wsGrid[r][c] = letters[Math.floor(Math.random() * 26)];

  renderWordSearch();
  renderWordList(chosen);
  updateWsProgress();
  document.getElementById('ws-message').textContent = '';
}

function placeWordInGrid(word) {
  const dirs = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
  let placed = false, attempts = 0;
  while (!placed && attempts < 200) {
    attempts++;
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    const [dr, dc] = dir;
    const r = Math.floor(Math.random() * WS_SIZE);
    const c = Math.floor(Math.random() * WS_SIZE);
    const endR = r + dr * (word.length - 1);
    const endC = c + dc * (word.length - 1);
    if (endR < 0 || endR >= WS_SIZE || endC < 0 || endC >= WS_SIZE) continue;
    let ok = true;
    for (let i = 0; i < word.length; i++) {
      const gr = r + dr*i, gc = c + dc*i;
      if (wsGrid[gr][gc] && wsGrid[gr][gc] !== word[i]) { ok = false; break; }
    }
    if (ok) {
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        wsGrid[r+dr*i][c+dc*i] = word[i];
        cells.push([r+dr*i, c+dc*i]);
      }
      wsPlacedWords.push({ word, cells });
      placed = true;
    }
  }
}

function renderWordSearch() {
  const grid = document.getElementById('ws-grid');
  if (!grid) return;
  grid.style.gridTemplateColumns = `repeat(${WS_SIZE}, 1fr)`;
  grid.innerHTML = '';
  for (let r = 0; r < WS_SIZE; r++) {
    for (let c = 0; c < WS_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'ws-cell';
      cell.textContent = wsGrid[r][c];
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.addEventListener('mousedown', wsMouseDown);
      cell.addEventListener('mouseenter', wsMouseEnter);
      cell.addEventListener('mouseup', wsMouseUp);
      cell.addEventListener('touchstart', wsTouchStart, {passive:true});
      cell.addEventListener('touchmove', wsTouchMove, {passive:false});
      cell.addEventListener('touchend', wsMouseUp);
      grid.appendChild(cell);
    }
  }
}

function getCellEl(r, c) {
  return document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`);
}

function wsMouseDown(e) {
  wsSelecting = true;
  wsStartCell = { r: parseInt(e.target.dataset.r), c: parseInt(e.target.dataset.c) };
  wsSelectedCells = [wsStartCell];
  highlightSelected();
}

function wsMouseEnter(e) {
  if (!wsSelecting) return;
  const r = parseInt(e.target.dataset.r), c = parseInt(e.target.dataset.c);
  const start = wsStartCell;
  const dr = Math.sign(r - start.r), dc = Math.sign(c - start.c);
  if ((dr === 0 && dc === 0)) return;
  const len = Math.max(Math.abs(r - start.r), Math.abs(c - start.c));
  wsSelectedCells = [];
  for (let i = 0; i <= len; i++) wsSelectedCells.push({r: start.r+dr*i, c: start.c+dc*i});
  highlightSelected();
}

function wsMouseUp() {
  if (!wsSelecting) return;
  wsSelecting = false;
  checkWordMatch();
  clearSelected();
}

function wsTouchStart(e) {
  const touch = e.touches[0];
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (el && el.classList.contains('ws-cell')) wsMouseDown({target: el});
}

function wsTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (el && el.classList.contains('ws-cell')) wsMouseEnter({target: el});
}

function highlightSelected() {
  document.querySelectorAll('.ws-cell.selected').forEach(el => el.classList.remove('selected'));
  wsSelectedCells.forEach(({r,c}) => {
    const el = getCellEl(r, c);
    if (el && !el.classList.contains('found')) el.classList.add('selected');
  });
}

function clearSelected() {
  document.querySelectorAll('.ws-cell.selected').forEach(el => el.classList.remove('selected'));
  wsSelectedCells = [];
}

function checkWordMatch() {
  const str = wsSelectedCells.map(({r,c}) => wsGrid[r][c]).join('');
  const rev = str.split('').reverse().join('');
  let found = null;
  wsPlacedWords.forEach(pw => {
    if ((pw.word === str || pw.word === rev) && !wsFoundWords.has(pw.word)) found = pw;
  });
  if (found) {
    wsFoundWords.add(found.word);
    found.cells.forEach(([r,c]) => {
      const el = getCellEl(r,c);
      if (el) { el.classList.remove('selected'); el.classList.add('found'); }
    });
    markWordFound(found.word);
    updateWsProgress();
    if (wsFoundWords.size === wsTotalWords) {
      document.getElementById('ws-message').textContent = '🌸 Magnificent! You found all the enchanted words!';
    }
  }
}

function renderWordList(words) {
  const list = document.getElementById('ws-word-list');
  if (!list) return;
  list.innerHTML = '';
  words.forEach(w => {
    const el = document.createElement('div');
    el.className = 'ws-word-item';
    el.dataset.word = w;
    el.textContent = w.charAt(0) + w.slice(1).toLowerCase();
    list.appendChild(el);
  });
}

function markWordFound(word) {
  const el = document.querySelector(`.ws-word-item[data-word="${word}"]`);
  if (el) el.classList.add('found');
}

function updateWsProgress() {
  const n = wsFoundWords.size;
  const pct = wsTotalWords > 0 ? (n / wsTotalWords) * 100 : 0;
  const fill = document.getElementById('ws-progress-fill');
  const text = document.getElementById('ws-progress-text');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `${n} / ${wsTotalWords} words`;
}

/* ══════════════════════════════════════════════════════
   HOROSCOPE
   ══════════════════════════════════════════════════════ */
const ZODIAC_SIGNS = [
  { emoji: '🌿', name: 'The Willow', dates: 'Mar 21 – Apr 19', element: 'Earth', lucky: '3', flower: 'Violet', stone: 'Moss Agate',
    love: 'A tender connection deepens under the waxing moon. Leave a wildflower on their windowsill.',
    work: 'Your patience with a slow-growing project finally bears fruit. Trust the timing of the earth.',
    magic: 'Carry a sprig of rosemary and make wishes on every spider\'s web you see.',
    general: 'The Willow bends but never breaks. This week, your flexibility is your greatest strength. A chance encounter near water brings unexpected wisdom.' },
  { emoji: '🍄', name: 'The Mushroom', dates: 'Apr 20 – May 20', element: 'Wood', lucky: '7', flower: 'Lily of the Valley', stone: 'Rose Quartz',
    love: 'Your calm, grounded energy draws someone special like bees to clover.',
    work: 'A hidden network of support reveals itself. The roots run deeper than you knew.',
    magic: 'Find a fairy ring and walk around it three times clockwise at dawn.',
    general: 'The Mushroom reminds us that the most vital connections happen underground, unseen. This week, nurture your invisible bonds.' },
  { emoji: '🦋', name: 'The Butterfly', dates: 'May 21 – Jun 20', element: 'Air', lucky: '11', flower: 'Foxglove', stone: 'Citrine',
    love: 'Your curious heart makes you irresistible. Be honest about what you\'re looking for.',
    work: 'Two opportunities flutter before you. Both are beautiful; choose with your gut.',
    magic: 'Write your wish on a leaf and release it to a stream.',
    general: 'Transformation is your birthright, dear Butterfly. This week\'s changes, though sudden, carry you toward where you were always meant to land.' },
  { emoji: '🌙', name: 'The Moon Hare', dates: 'Jun 21 – Jul 22', element: 'Water', lucky: '2', flower: 'White Rose', stone: 'Moonstone',
    love: 'The full moon illuminates what your heart has been whispering. Listen.',
    work: 'Intuition over logic this week. Your gut knows before your mind catches up.',
    magic: 'Leave a bowl of water in the moonlight overnight and wash your face with it at dawn.',
    general: 'You feel everything so deeply, Moon Hare. This is your power, not your weakness. This week, honour your sensitivity as the gift it truly is.' },
  { emoji: '🦁', name: 'The Golden Stag', dates: 'Jul 23 – Aug 22', element: 'Fire', lucky: '1', flower: 'Sunflower', stone: 'Amber',
    love: 'You shine so brightly. Make sure you\'re choosing someone who can look at you directly.',
    work: 'Your moment to lead has arrived. Step into it with the grace of the forest king.',
    magic: 'Light a golden candle at sunset and speak your desires aloud to the flame.',
    general: 'The Stag does not apologise for its crown. Walk with the dignity of one who knows their worth, and the forest will part before you.' },
  { emoji: '🌾', name: 'The Harvest Witch', dates: 'Aug 23 – Sep 22', element: 'Earth', lucky: '6', flower: 'Chamomile', stone: 'Peridot',
    love: 'Love grows in small, careful acts of service. Yours is noticed and cherished.',
    work: 'Your meticulous attention to detail saves the day this week. Let it.',
    magic: 'Bundle three herbs from your garden and hang them above your door.',
    general: 'You see what others overlook, Harvest Witch. This week, your eye for the overlooked detail reveals something remarkable.' },
  { emoji: '⚖️', name: 'The Silver Fox', dates: 'Sep 23 – Oct 22', element: 'Air', lucky: '8', flower: 'Rose', stone: 'Opal',
    love: 'Balance is needed. Give as much as you receive, no more, no less.',
    work: 'A negotiation goes in your favour. Your charm is your best tool.',
    magic: 'Hold a smooth stone in each hand and find your centre.',
    general: 'The Fox is cunning not from cruelty but from necessity. This week, your cleverness finds a graceful solution that serves everyone.' },
  { emoji: '🕷️', name: 'The Spider Queen', dates: 'Oct 23 – Nov 21', element: 'Water', lucky: '9', flower: 'Dark Orchid', stone: 'Obsidian',
    love: 'Depth is what you seek. Anything surface-level feels like a cage. Seek what is real.',
    work: 'You see through the illusion to the truth. Share what you see, gently.',
    magic: 'Weave a small intention into a piece of thread and keep it in your pocket.',
    general: 'The Spider Queen builds intricate worlds. This week, examine the patterns in your life. Which threads serve you, and which have you outgrown?' },
  { emoji: '🏹', name: 'The Wandering Arrow', dates: 'Nov 22 – Dec 21', element: 'Fire', lucky: '5', flower: 'Jasmine', stone: 'Turquoise',
    love: 'Your honesty is refreshing. Someone has been waiting for a person like you.',
    work: 'A distant opportunity materialises. Be ready to move quickly.',
    magic: 'Take the longest path home. Notice what you find.',
    general: 'The Arrow knows its direction before it flies. This week, trust your aim. You are pointing toward exactly the right thing.' },
  { emoji: '🐐', name: 'The Mountain Wren', dates: 'Dec 22 – Jan 19', element: 'Earth', lucky: '4', flower: 'Ivy', stone: 'Garnet',
    love: 'Your steadiness is a rare and precious thing. The right person knows how to treasure it.',
    work: 'Slow, deliberate progress beats desperate rushing every time. You already know this.',
    magic: 'Plant something with the intention of commitment. Watch it grow.',
    general: 'The Wren reaches heights others cannot because it takes one careful step at a time. This week, your persistence reaches its reward.' },
  { emoji: '🌊', name: 'The River Spirit', dates: 'Jan 20 – Feb 18', element: 'Water', lucky: '11', flower: 'Water Lily', stone: 'Aquamarine',
    love: 'Your unconventional approach to love is exactly what someone has been dreaming of.',
    work: 'An innovative idea that seemed strange now seems obvious. Trust it.',
    magic: 'Let a paper boat carry your wishes downstream.',
    general: 'The River does not ask permission from the stone before finding its way around it. This week, flow around obstacles rather than through them.' },
  { emoji: '🐟', name: 'The Dreaming Fish', dates: 'Feb 19 – Mar 20', element: 'Water', lucky: '12', flower: 'Lotus', stone: 'Amethyst',
    love: 'Your romantic imagination is your most beautiful quality. Let someone dive into your world.',
    work: 'A creative vision crystallises into something you can finally share.',
    magic: 'Sleep with a flower beneath your pillow and record your dreams at dawn.',
    general: 'The Fish swims between two worlds. This week, your ability to hold contradictions within yourself — the dreamer and the doer — becomes your greatest asset.' },
];

function initHoroscope() {
  const grid = document.getElementById('zodiac-grid');
  if (!grid) return;
  ZODIAC_SIGNS.forEach((sign, i) => {
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

  const reading = document.getElementById('horoscope-reading');
  reading.innerHTML = `
    <div class="horoscope-content">
      <div class="horoscope-sign-header">
        <div class="horoscope-sign-emoji">${sign.emoji}</div>
        <div>
          <div class="horoscope-sign-name">${sign.name}</div>
          <div class="horoscope-sign-dates">${sign.dates} · ${sign.element} Sign</div>
        </div>
      </div>
      <p style="color:rgba(255,255,255,0.85); font-family:var(--font-body); font-size:1rem; line-height:1.7; font-style:italic;">${sign.general}</p>
      <div class="horoscope-sections">
        <div>
          <div class="horoscope-area-title">💕 Love & Heart</div>
          <div class="horoscope-area-text">${sign.love}</div>
        </div>
        <div>
          <div class="horoscope-area-title">🌿 Work & Craft</div>
          <div class="horoscope-area-text">${sign.work}</div>
        </div>
        <div>
          <div class="horoscope-area-title">✨ Enchantment</div>
          <div class="horoscope-area-text">${sign.magic}</div>
        </div>
      </div>
      <div class="horoscope-lucky">
        <div class="lucky-item">
          <div class="lucky-label">Lucky Number</div>
          <div class="lucky-value">${sign.lucky}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-label">Sacred Flower</div>
          <div class="lucky-value">${sign.flower}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-label">Power Stone</div>
          <div class="lucky-value">${sign.stone}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-label">Element</div>
          <div class="lucky-value">${sign.element}</div>
        </div>
      </div>
    </div>
  `;
}
