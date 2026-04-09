/* ══════════════════════════════════════
   NANO MANGO — JS
══════════════════════════════════════ */

/* ── Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

/* ── Scroll Reveal ── */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

/* ── Counter animation ── */
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1600;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, +el.dataset.target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ── Particle Canvas ── */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '#FFD84D' : '#1DB954';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.08;
        ctx.strokeStyle = '#FFD84D';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── Mouse parallax on orbs ── */
document.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 20;
  const my = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelector('.orb1').style.transform = `translate(${mx * 0.5}px, ${my * 0.5}px)`;
  document.querySelector('.orb2').style.transform = `translate(${-mx * 0.3}px, ${-my * 0.3}px)`;
});

/* ── Contact Form Validation ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameErr = document.getElementById('nameErr');
    const emailErr = document.getElementById('emailErr');
    const msgErr = document.getElementById('msgErr');

    // Reset
    [name, email, message].forEach(el => el.classList.remove('error'));
    [nameErr, emailErr, msgErr].forEach(el => el.classList.remove('show'));

    if (!name.value.trim()) {
      name.classList.add('error'); nameErr.classList.add('show'); valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      email.classList.add('error'); emailErr.classList.add('show'); valid = false;
    }
    if (!message.value.trim()) {
      message.classList.add('error'); msgErr.classList.add('show'); valid = false;
    }

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.querySelector('.btn-text').textContent = 'Sending...';

      setTimeout(() => {
        form.reset();
        document.getElementById('formSuccess').classList.add('show');
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Send Message';
        setTimeout(() => {
          document.getElementById('formSuccess').classList.remove('show');
        }, 5000);
      }, 1200);
    }
  });

  // Live validation clear
  ['name','email','message'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
      this.classList.remove('error');
      document.getElementById(id + 'Err').classList.remove('show');
    });
  });
}

/* ── Smooth active nav links ── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
});
