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

// ── Nav scroll ──
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// ── Typing effect ──
const roles = ["Full Stack Developer", "Content Creator", "Problem Solver", "AI Enthusiast"];
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

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ── Skill bar animation ──
const skillSection = document.getElementById('skills');
let skillsAnimated = false;
const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            document.querySelectorAll('.skill-fill').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
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
skillObs.observe(skillSection);