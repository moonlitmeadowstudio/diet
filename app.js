// Фоны
const backgrounds = [
  // Статичные красивые пляжи Unsplash
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1920&q=80',
];

const bgEl = document.getElementById('bg');
const applyBackground = (url) => { bgEl.style.backgroundImage = `url(${url})`; };
let currentBackgroundIndex = 0;

// Предзагрузка, чтобы смена была плавнее
const _preloaded = [];
backgrounds.forEach(url => { const img = new Image(); img.src = url; _preloaded.push(img); });

function nextBackground(){
  currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
  applyBackground(backgrounds[currentBackgroundIndex]);
}

// Стартовый фон
applyBackground(backgrounds[currentBackgroundIndex]);

// Клик по кнопке — следующий фон и ресет таймера
const btn = document.getElementById('setBgToday');
const ROTATE_MS = 15000;
let rotateTimer = null;
function startRotate(){
  if (rotateTimer) clearInterval(rotateTimer);
  rotateTimer = setInterval(nextBackground, ROTATE_MS);
}
if (btn){
  btn.addEventListener('click', () => { nextBackground(); startRotate(); });
}
// Автосмена каждые 15 секунд
startRotate();

// Музыка: максимально агрессивный автозапуск в рамках политик браузера
const audioEl = document.getElementById('bgAudio');
const toggleBtn = document.getElementById('musicToggle');
const vol = document.getElementById('volume');

// Локальный плейлист из папки music
const playlist = [
  './music/summer-vibe_medium-192826.mp3'
];
let trackIndex = 0;
function setTrack(i){
  if (!audioEl) return;
  trackIndex = ((i % playlist.length) + playlist.length) % playlist.length;
  audioEl.src = playlist[trackIndex];
}

function setUIPlaying(on){ if (toggleBtn) toggleBtn.textContent = on ? '⏸ Пауза' : '▶ Музыка'; }
async function tryPlay(){
  try { await audioEl.play(); setUIPlaying(true); }
  catch(e){ /* Автоплей может быть заблокирован — стартуем при первом жесте */ }
}

if (audioEl && toggleBtn && vol){
  audioEl.volume = parseFloat(vol.value || '0.7');
  setTrack(trackIndex);
  window.addEventListener('load', tryPlay);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
  const resume = async () => { await tryPlay(); };
  document.addEventListener('click', resume, { once:true });
  document.addEventListener('touchstart', resume, { once:true });
  toggleBtn.addEventListener('click', async () => {
    if (audioEl.paused) { await tryPlay(); }
    else { audioEl.pause(); setUIPlaying(false); }
  });
  vol.addEventListener('input', e => { audioEl.volume = parseFloat(e.target.value); });
  audioEl.addEventListener('ended', () => { setTrack(trackIndex + 1); tryPlay(); });
}
