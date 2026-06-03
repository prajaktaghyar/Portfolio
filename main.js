/* ──────────────────────────────────────
   CANVAS — CONSTELLATION NETWORK
──────────────────────────────────────── */
const cv = document.getElementById('bgc');
const ctx = cv.getContext('2d');
let W, H, pts = [], mx = -999, my = -999;

function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
resize();
addEventListener('resize', () => { resize(); initPts(); });

function Pt() {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.vx = (Math.random() - .5) * .3;
  this.vy = (Math.random() - .5) * .3;
  this.r = Math.random() * 1.3 + .4;
  this.a = Math.random() * .35 + .06;
}

function initPts() {
  pts = [];
  const n = Math.floor(W * H / 16000);
  for (let i = 0; i < n; i++) pts.push(new Pt());
}
initPts();

function draw() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,169,110,${p.a})`;
    ctx.fill();
  });
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 140) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(201,169,110,${.08 * (1 - d / 140)})`;
        ctx.lineWidth = .5;
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }
    const dx = pts[i].x - mx, dy = pts[i].y - my;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 160) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(201,169,110,${.16 * (1 - d / 160)})`;
      ctx.lineWidth = .7;
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(mx, my);
      ctx.stroke();
    }
  }
  requestAnimationFrame(draw);
}
draw();

/* ──────────────────────────────────────
   CUSTOM CURSOR
──────────────────────────────────────── */
const curd = document.getElementById('cur-d');
const curr = document.getElementById('cur-r');
let cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  mx = cx; my = cy;
  curd.style.left = cx + 'px';
  curd.style.top = cy + 'px';
});

document.addEventListener('mousedown', () => {
  document.body.classList.add('click');
  setTimeout(() => document.body.classList.remove('click'), 300);
});

(function loop() {
  rx += (cx - rx) * .13;
  ry += (cy - ry) * .13;
  curr.style.left = rx + 'px';
  curr.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a,button,.proj-card,.sk,.cert,.ach,.cl,.chip,.ftag,.tl-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ──────────────────────────────────────
   SCROLL PROGRESS
──────────────────────────────────────── */
const prog = document.getElementById('progress');
addEventListener('scroll', () => {
  const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100;
  prog.style.width = pct + '%';
});

/* ──────────────────────────────────────
   NAV COMPACT + ACTIVE
──────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');

addEventListener('scroll', () => {
  navbar.classList.toggle('compact', scrollY > 80);
  let cur = '';
  secs.forEach(s => { if (scrollY >= s.offsetTop - 220) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href').slice(1) === cur));
});

/* ──────────────────────────────────────
   TYPEWRITER
──────────────────────────────────────── */
const lines = [
  'Building <strong>end-to-end intelligent systems</strong> — from 99.54%-accurate crop ML pipelines to LLM document analyzers.',
  'From <strong>Nagpur, Maharashtra</strong> — crafting AI solutions that make a <strong>measurable real-world difference</strong>.',
  'Specializing in <strong>Machine Learning · Deep Learning · NLP &amp; LLMs</strong> with a passion for deployment at scale.',
];
let li = 0, ci = 0, del = false;
const twEl = document.getElementById('tw-text');

function type() {
  const cur = lines[li];
  if (!del) {
    if (ci <= cur.length) {
      twEl.innerHTML = cur.substring(0, ci);
      ci++;
      setTimeout(type, ci < cur.length ? 28 : 1800);
    } else {
      del = true;
      setTimeout(type, 2000);
    }
  } else {
    if (ci > 0) {
      twEl.innerHTML = cur.substring(0, ci);
      ci--;
      setTimeout(type, 12);
    } else {
      del = false;
      li = (li + 1) % lines.length;
      setTimeout(type, 300);
    }
  }
}
type();

/* ──────────────────────────────────────
   VIEW PROJECTS SMOOTH SCROLL
──────────────────────────────────────── */
document.getElementById('view-proj-btn').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});

/* ──────────────────────────────────────
   INTERSECTION OBSERVER — REVEAL + COUNTERS + BARS
──────────────────────────────────────── */
const revealed = new Set();
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !revealed.has(e.target)) {
      revealed.add(e.target);
      e.target.classList.add('in');
      e.target.querySelectorAll('.sk-fill').forEach(b => setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 200));
      e.target.querySelectorAll('[data-target]').forEach(el => animFloat(el));
      e.target.querySelectorAll('[data-count]').forEach(el => animInt(el));
    }
  });
}, { threshold: .1 });

document.querySelectorAll('.rv,.tl-item').forEach(el => obs.observe(el));

const bObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sk-fill').forEach(b => {
        b.style.width = '0';
        setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 120);
      });
    }
  });
}, { threshold: .1 });

document.querySelectorAll('.tab-panel').forEach(p => bObs.observe(p));

/* ──────────────────────────────────────
   COUNTER ANIMATIONS
──────────────────────────────────────── */
function animFloat(el) {
  const t = parseFloat(el.dataset.target);
  const suf = el.dataset.suffix || '';
  const dec = t % 1 ? 2 : 0;
  const dur = 1800;
  const s = performance.now();
  const step = now => {
    const p = Math.min((now - s) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = (t * ease).toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function animInt(el) {
  const t = parseInt(el.dataset.count);
  const dur = 1500;
  const s = performance.now();
  const step = now => {
    const p = Math.min((now - s) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(t * ease) + '+';
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ──────────────────────────────────────
   SKILLS TABS
──────────────────────────────────────── */
document.querySelectorAll('.snav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.snav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    panel.classList.add('active');
    panel.querySelectorAll('.sk-fill').forEach(b => {
      b.style.width = '0';
      setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 100);
    });
  });
});

/* ──────────────────────────────────────
   MAGNETIC BUTTONS
──────────────────────────────────────── */
document.querySelectorAll('.btn-mag').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * .15}px,${y * .15}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ──────────────────────────────────────
   AI CONSOLE EASTER EGG
──────────────────────────────────────── */
const trig = document.getElementById('console-trig');
const panel = document.getElementById('ai-console');
const closeBtn = document.getElementById('console-close-btn');
const body = document.getElementById('console-body');
const inp = document.getElementById('console-input');
const sendBtn = document.getElementById('console-send-btn');

trig.addEventListener('click', () => panel.classList.toggle('open'));
closeBtn.addEventListener('click', () => panel.classList.remove('open'));

const kb = {
  'skill': ['Python, TensorFlow, Scikit-learn, RAG pipelines, Transformers (HuggingFace), OpenCV, MediaPipe, MySQL, Pandas, NumPy, XGBoost — and more. Proficiency across the full ML stack.'],
  'project': ['Six flagship projects: Ankur crop AI (99.54% accuracy), RAG document analyzer (70% faster retrieval), LLM attention caching (50% faster inference), speech emotion recognition (92%+), customer segmentation dashboard, and a blood bank management system.'],
  'location': ["Prajakta is based in Nagpur, Maharashtra — the Orange City and geographic center of India. She attends SVPCET for her B.Tech in AI Engineering."],
  'nagpur': ["Nagpur is Maharashtra's second capital and India's geographic center. Prajakta is proud to represent Nagpur on the national AI stage, having been selected for Smart India Hackathon."],
  'education': ['B.Tech in Artificial Intelligence Engineering at SVPCET, Nagpur (2023–2027). Coursework in ML, Deep Learning, AI Algorithms, NLP, Computer Vision, and DSA.'],
  'contact': ['Email: prajaktaghyar033@gmail.com | LinkedIn: prajakta-ghyar-276051317 | GitHub: prajaktaghyar | Phone: +91 8766058851'],
  'internship': ['Machine Learning Intern at CodeAlpha — built credit score prediction and diabetes classification models end-to-end.'],
  'hackathon': ['Selected for Smart India Hackathon with an AI-based solution, representing SVPCET Nagpur at the national level.'],
  'default': ["I can tell you about Prajakta's skills, projects, education, location, or contact details. Just ask!"]
};

function getReply(q) {
  q = q.toLowerCase();
  for (const k in kb) { if (k !== 'default' && q.includes(k)) return kb[k][0]; }
  return kb.default[0];
}

function addMsg(text, who) {
  const d = document.createElement('div');
  d.className = 'console-msg ' + who;
  const label = who === 'ai' ? 'prajakta.ai $' : 'you $';
  d.innerHTML = `<span>${label}</span> ${text}`;
  body.appendChild(d);
  body.scrollTop = body.scrollHeight;
}

function send() {
  const v = inp.value.trim();
  if (!v) return;
  addMsg(v, 'user');
  inp.value = '';
  setTimeout(() => addMsg(getReply(v), 'ai'), 420);
}

sendBtn.addEventListener('click', send);
inp.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
