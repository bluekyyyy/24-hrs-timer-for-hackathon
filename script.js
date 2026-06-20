const FINAL_COUNTDOWN_THRESHOLD = 10;
let savedDuration = 24 * 60 * 60;
let totalSeconds  = savedDuration;
let timerInterval = null;

// ── SPONSORS ──────────────────────────────────────
const SPONSORS = [
  { name: 'OWASP Foundation',    tag: 'SECURITY PARTNER',  logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
  { name: 'Sathyabama ISST',     tag: 'HOST INSTITUTION',  logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
  { name: 'School of Computing', tag: 'ACADEMIC SPONSOR',  logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
  { name: 'CSE Cyber Security',  tag: 'DEPT. SPONSOR',     logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
  { name: 'TechCorp Systems',    tag: 'GOLD SPONSOR',      logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
  { name: 'CyberShield Inc.',    tag: 'PLATINUM SPONSOR',  logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
  { name: 'HackArena',           tag: 'COMMUNITY SPONSOR', logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
  { name: 'SecureNet Labs',      tag: 'SILVER SPONSOR',    logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
  { name: 'CloudBurst Tech',     tag: 'BRONZE SPONSOR',    logo: '/1_MFlAPjhdTE_AISAdgrBncQ.jpg' },
];
// To swap images: replace the logo paths above with your actual filenames.
// Corner logos: edit the src attributes on #logo-college and #logo-owasp img tags in index.html.

// ── LOGO VISIBILITY ───────────────────────────────
function showLogos() {
  document.getElementById('logo-college').classList.remove('hidden');
  document.getElementById('logo-owasp').classList.remove('hidden');
}
function hideLogos() {
  document.getElementById('logo-college').classList.add('hidden');
  document.getElementById('logo-owasp').classList.add('hidden');
}

// ── TIMER SETUP ───────────────────────────────────
function updatePreview() {
  const h = parseInt(document.getElementById('setup-h').value) || 0;
  const m = parseInt(document.getElementById('setup-m').value) || 0;
  const s = parseInt(document.getElementById('setup-s').value) || 0;
  let parts = [];
  if (h) parts.push(h + (h === 1 ? ' HOUR' : ' HOURS'));
  if (m) parts.push(m + ' MIN');
  if (s) parts.push(s + ' SEC');
  document.getElementById('setup-preview').textContent =
    parts.length ? 'DURATION: ' + parts.join(' ') : 'ENTER A DURATION';
}
function setPreset(h, m, s) {
  document.getElementById('setup-h').value = h;
  document.getElementById('setup-m').value = m;
  document.getElementById('setup-s').value = s;
  updatePreview();
}
function confirmTimer() {
  const h = parseInt(document.getElementById('setup-h').value) || 0;
  const m = parseInt(document.getElementById('setup-m').value) || 0;
  const s = parseInt(document.getElementById('setup-s').value) || 0;
  const secs = h * 3600 + m * 60 + s;
  if (secs <= 0) {
    document.getElementById('setup-preview').textContent = '⚠ PLEASE ENTER A VALID DURATION';
    return;
  }
  savedDuration = secs;
  document.getElementById('header').style.display = 'flex';
  showLogos();
  document.getElementById('marquee-wrap').style.display = 'block';
  crtFlash();
  showOnly('state-standby');
}

// ── MARQUEE ───────────────────────────────────────
function buildMarquee() {
  const track = document.getElementById('marquee-track');
  track.innerHTML = '';
  for (let pass = 0; pass < 2; pass++) {
    SPONSORS.forEach(s => {
      const item = document.createElement('div');
      item.className = 'sponsor-item';
      const logoHTML = s.logo
        ? `<img src="${s.logo}" alt="${s.name}" onerror="this.parentElement.innerHTML='PNG'">`
        : 'PNG';
      item.innerHTML = `
        <div class="sponsor-logo">${logoHTML}</div>
        <div>
          <div class="sponsor-name">${s.name}</div>
          <div class="sponsor-tag">${s.tag}</div>
        </div>`;
      track.appendChild(item);
      const d = document.createElement('div');
      d.className = 'marquee-divider';
      d.textContent = '◆';
      track.appendChild(d);
    });
  }
}

// ── CRT FLASH ─────────────────────────────────────
function crtFlash() {
  const f = document.getElementById('flash');
  f.classList.remove('flash-anim');
  void f.offsetWidth;
  f.classList.add('flash-anim');
}

// ── SHOW STATE ────────────────────────────────────
function showOnly(id) {
  ['state-timer-setup', 'state-standby', 'state-pre', 'state-active', 'state-final', 'state-complete']
    .forEach(s => document.getElementById(s).style.display = 'none');
  document.getElementById(id).style.display = 'flex';
}

// ── PRE COUNTDOWN ─────────────────────────────────
function startPreCountdown() {
  crtFlash();
  showOnly('state-pre');
  hideLogos();
  document.getElementById('marquee-wrap').style.display = 'none';
  let count = 5;
  const el = document.getElementById('pre-number');
  const label = document.getElementById('pre-label');
  const labels = ['INITIATING', 'LOADING', 'ARMED', 'READY', 'GO!!!'];
  function tick() {
    el.textContent = count;
    el.setAttribute('data-val', count);
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'preNumAppear 0.5s cubic-bezier(0.17,0.67,0.35,1.2)';
    label.textContent = labels[5 - count] || 'GO!!!';
    if (count === 0) { setTimeout(startActiveHackathon, 600); return; }
    count--;
    setTimeout(tick, 1000);
  }
  tick();
}

// ── ACTIVE TIMER ──────────────────────────────────
function startActiveHackathon() {
  crtFlash();
  showOnly('state-active');
  showLogos();
  document.getElementById('marquee-wrap').style.display = 'block';
  totalSeconds = savedDuration;
  updateTimerDisplay();
  timerInterval = setInterval(timerTick, 1000);
}

function pad(n) { return String(n).padStart(2, '0'); }

function updateTimerDisplay() {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  document.getElementById('t-h').textContent = pad(h);
  document.getElementById('t-m').textContent = pad(m);
  document.getElementById('t-s').textContent = pad(s);
  const pct = Math.min(100, ((savedDuration - totalSeconds) / savedDuration) * 100);
  document.getElementById('progress-bar').style.width = (100 - pct) + '%';
}

function timerTick() {
  totalSeconds--;
  if (totalSeconds === FINAL_COUNTDOWN_THRESHOLD) {
    clearInterval(timerInterval);
    document.getElementById('marquee-wrap').style.display = 'none';
    startFinalCountdown();
    return;
  }
  if (totalSeconds <= 0) {
    totalSeconds = 0;
    clearInterval(timerInterval);
    updateTimerDisplay();
    setTimeout(showComplete, 800);
    return;
  }
  updateTimerDisplay();
}

// ── FINAL COUNTDOWN ───────────────────────────────
function startFinalCountdown() {
  crtFlash();
  showOnly('state-final');
  hideLogos();
  let count = FINAL_COUNTDOWN_THRESHOLD;
  const el = document.getElementById('final-number');
  function tick() {
    el.textContent = count;
    el.setAttribute('data-val', count);
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'preNumAppear 0.4s cubic-bezier(0.17,0.67,0.35,1.2)';
    const f = document.getElementById('flash');
    f.style.background = '#ff000044';
    f.classList.remove('flash-anim');
    void f.offsetWidth;
    f.classList.add('flash-anim');
    if (count === 0) { setTimeout(showComplete, 600); return; }
    count--;
    setTimeout(tick, 1000);
  }
  tick();
}

// ── COMPLETE ──────────────────────────────────────
function showComplete() {
  document.getElementById('flash').style.background = 'white';
  crtFlash();
  showLogos();
  document.getElementById('marquee-wrap').style.display = 'block';
  showOnly('state-complete');
}

// ── INIT ──────────────────────────────────────────
hideLogos();
document.getElementById('marquee-wrap').style.display = 'none';
buildMarquee();
updatePreview();