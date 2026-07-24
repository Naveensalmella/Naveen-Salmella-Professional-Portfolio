// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});
document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ── Nav scroll + scroll progress + back-to-top ──
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
const backTop = document.getElementById('backTop');
function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);
    backTop.classList.toggle('show', y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    spy();
}
window.addEventListener('scroll', onScroll, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Scrollspy (active nav link) ──
const sections = [...document.querySelectorAll('section[id]')];
const navAnchors = [...document.querySelectorAll('#navLinks a')];
function spy() {
    const pos = window.scrollY + 120;
    let current = sections[0]?.id;
    for (const s of sections) {
        if (s.offsetTop <= pos) current = s.id;
    }
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}

// ── Typing effect ──
const roles = ["Full Stack Developer", "React Developer", "Python Developer", "AI Enthusiast", "Problem Solver"];
const typingEl = document.getElementById('typing-text');
let roleIdx = 0, charIdx = 0, deleting = false;
function typeLoop() {
    const current = roles[roleIdx];
    if (!deleting) {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
    } else {
        typingEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// ── Scroll reveal (with stagger for grid children) ──
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const siblings = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'));
            const i = siblings.indexOf(e.target);
            e.target.style.transitionDelay = Math.max(0, i) * 90 + 'ms';
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ── Skill bar animation ──
const skillSection = document.getElementById('skills');
let skillsAnimated = false;
const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            document.querySelectorAll('.skill-fill').forEach(bar => { bar.style.width = bar.dataset.width; });
            document.querySelectorAll('.pct').forEach(counter => {
                const target = +counter.dataset.target;
                let count = 0;
                const step = () => {
                    if (count < target) { count++; counter.textContent = count + '%'; requestAnimationFrame(step); }
                    else { counter.textContent = target + '%'; }
                };
                step();
            });
        }
    });
}, { threshold: 0.3 });
if (skillSection) skillObs.observe(skillSection);

// ── Animated stat counters ──
const statsSection = document.querySelector('.stats');
let statsAnimated = false;
const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            document.querySelectorAll('.stat-num').forEach(el => {
                const target = +el.dataset.target;
                const suffix = el.dataset.suffix || '';
                let count = 0;
                const inc = Math.max(1, Math.ceil(target / 45));
                const step = () => {
                    count += inc;
                    if (count >= target) { el.textContent = target + suffix; }
                    else { el.textContent = count + suffix; requestAnimationFrame(step); }
                };
                step();
            });
        }
    });
}, { threshold: 0.4 });
if (statsSection) statObs.observe(statsSection);

// ── Cursor glow (fine pointers only) ──
const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
        glow.style.opacity = '1';
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ── Theme toggle ──
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
function applyTheme(mode) {
    const light = mode === 'light';
    document.body.classList.toggle('light', light);
    if (themeIcon) themeIcon.className = light ? 'fas fa-sun' : 'fas fa-moon';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#eef2f9' : '#060b18');
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('theme') || 'dark'; } catch (e) { }
applyTheme(savedTheme);
if (themeToggle) themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) { }
});

// ── Project filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        projectCards.forEach(card => {
            const show = f === 'all' || card.dataset.cat === f;
            card.classList.toggle('hide', !show);
        });
    });
});

// ── Contact form ──
// To receive messages straight to your inbox, create a free form at https://formspree.io
// then replace YOUR_FORM_ID below with your form's ID (e.g. https://formspree.io/f/abcdwxyz).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgnvoja';
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg, type) {
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.className = 'toast'; }, 4000);
}
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: contactForm.name.value.trim(),
            email: contactForm.email.value.trim(),
            subject: contactForm.subject.value.trim(),
            message: contactForm.message.value.trim()
        };
        // Fallback: if Formspree isn't configured yet, open the user's email client.
        if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
            const subject = encodeURIComponent(data.subject || `Portfolio message from ${data.name}`);
            const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} (${data.email})`);
            window.location.href = `mailto:naveensalmella46@gmail.com?subject=${subject}&body=${body}`;
            showToast('Opening your email app…');
            return;
        }
        const btn = document.getElementById('cf-submit');
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Sending…';
        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            });
            if (res.ok) { showToast('Message sent — thank you! I\'ll reply soon.', 'success'); contactForm.reset(); }
            else { showToast('Something went wrong. Please email me directly.', 'error'); }
        } catch (err) {
            showToast('Network error. Please email me directly.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = original;
        }
    });
}

// ── GitHub stats (fetched live from GitHub's own API — no third-party image service) ──
(function () {
    const GH_USER = 'Naveensalmella';
    const statList = document.getElementById('ghStatList');
    const langList = document.getElementById('ghLangList');
    if (!statList || !langList) return;

    function showError(el, msg) {
        el.innerHTML = `<div class="gh-error"><i class="fas fa-triangle-exclamation"></i> ${msg}<a href="https://github.com/${GH_USER}" target="_blank">View profile directly →</a></div>`;
    }

    async function loadGithubStats() {
        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${GH_USER}`),
                fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&type=owner`)
            ]);
            if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
            const user = await userRes.json();
            const repos = await reposRes.json();
            if (!Array.isArray(repos)) throw new Error('Unexpected repos response');

            const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
            const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

            statList.innerHTML = `
                <div class="gh-stat-row"><span>Public Repos</span><strong>${user.public_repos ?? repos.length}</strong></div>
                <div class="gh-stat-row"><span>Followers</span><strong>${user.followers ?? 0}</strong></div>
                <div class="gh-stat-row"><span>Total Stars</span><strong>${totalStars}</strong></div>
                <div class="gh-stat-row"><span>Total Forks</span><strong>${totalForks}</strong></div>
            `;

            const langCount = {};
            repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
            const sortedLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
            const maxCount = sortedLangs.length ? sortedLangs[0][1] : 1;

            langList.innerHTML = sortedLangs.length
                ? sortedLangs.map(([lang, count]) => `
                    <div class="gh-lang-row">
                        <div class="gh-lang-top"><span>${lang}</span><span>${count} repo${count > 1 ? 's' : ''}</span></div>
                        <div class="gh-lang-track"><div class="gh-lang-fill" style="width:${(count / maxCount) * 100}%"></div></div>
                    </div>`).join('')
                : `<div class="gh-loading">No language data available.</div>`;
        } catch (err) {
            showError(statList, 'GitHub stats are temporarily unavailable. ');
            showError(langList, 'Top languages are temporarily unavailable. ');
        }
    }

    loadGithubStats();
})();

// init
onScroll();