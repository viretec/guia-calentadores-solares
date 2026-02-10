// ===== PROGRESS BAR =====
const progressBar = document.getElementById('progressBar');

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateProgress);

// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById('mainNav');

function updateNav() {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateNav);

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('.section, .hero');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===== SCROLL ANIMATIONS =====
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => observer.observe(el));

// ===== CHECKLIST TOGGLE =====
function toggleCheck(item) {
    item.classList.toggle('checked');

    // Count checked items in the same parent
    const parent = item.closest('.checklist-items, .steps-list');
    if (parent) {
        const total = parent.querySelectorAll('.checklist-item').length;
        const checked = parent.querySelectorAll('.checklist-item.checked').length;

        if (checked === total && total > 0) {
            // All items checked — celebration effect
            showCelebration(parent);
        }
    }
}

function showCelebration(parent) {
    const existing = parent.querySelector('.celebration');
    if (existing) return;

    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.style.cssText = `
    text-align: center;
    padding: 20px;
    margin-top: 16px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.25);
    border-radius: 12px;
    animation: fadeInUp 0.4s ease;
    font-size: 1rem;
    color: #22c55e;
    font-weight: 600;
  `;
    celebration.innerHTML = '🎉 ¡Excelente! Has completado todos los pasos';
    parent.appendChild(celebration);

    setTimeout(() => {
        celebration.style.opacity = '0';
        celebration.style.transition = 'opacity 0.5s ease';
        setTimeout(() => celebration.remove(), 500);
    }, 3000);
}

// ===== ACCORDION =====
function toggleAccordion(header) {
    const item = header.closest('.accordion-item');
    const body = item.querySelector('.accordion-body');
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.accordion-body').style.maxHeight = '0';
        }
    });

    if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = '0';
    } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
    }
}

// ===== CALCULATOR =====
function calculate() {
    const cost = parseFloat(document.getElementById('repairCost').value);
    const age = parseFloat(document.getElementById('equipAge').value);
    const life = parseFloat(document.getElementById('lifeExpect').value);

    if (isNaN(cost) || isNaN(age) || isNaN(life) || life === 0) {
        alert('Por favor, completa todos los campos con valores numéricos válidos.');
        return;
    }

    const result = (cost * age) / life;
    const resultEl = document.getElementById('calcResult');
    const valueEl = document.getElementById('resultValue');
    const textEl = document.getElementById('resultText');
    const detailEl = document.getElementById('resultDetail');

    // Remove old classes
    resultEl.classList.remove('repair', 'replace', 'evaluate', 'show');

    valueEl.textContent = '$' + result.toLocaleString('es-MX', { maximumFractionDigits: 0 }) + ' MXN';

    if (result < 3000) {
        resultEl.classList.add('repair', 'show');
        textEl.textContent = '✅ Vale la pena reparar';
        detailEl.textContent = 'El resultado es menor a $3,000 MXN. La reparación es la opción más económica.';
    } else if (result > 5000) {
        resultEl.classList.add('replace', 'show');
        textEl.textContent = '🔄 Considera reemplazo';
        detailEl.textContent = 'El resultado supera los $5,000 MXN. Un equipo nuevo puede ser mejor inversión.';
    } else {
        resultEl.classList.add('evaluate', 'show');
        textEl.textContent = '⚖️ Evalúa caso por caso';
        detailEl.textContent = 'El resultado está entre $3,000-$5,000 MXN. Consulta con un profesional.';
    }

    // Animate in
    resultEl.style.animation = 'none';
    resultEl.offsetHeight; // force reflow
    resultEl.style.animation = 'fadeInUp 0.4s ease';
}

// ===== SMOOTH SCROLL FOR HERO CTA =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value, .benefit-value');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;

        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counter.dataset.animated = 'true';
            const text = counter.textContent;

            // Extract number
            const match = text.match(/[\d,]+/);
            if (match) {
                const target = parseInt(match[0].replace(/,/g, ''));
                if (target > 100) {
                    let current = 0;
                    const step = Math.ceil(target / 40);
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        counter.textContent = text.replace(match[0], current.toLocaleString('es-MX'));
                    }, 30);
                }
            }
        }
    });
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ===== INITIAL STATE =====
updateProgress();
updateNav();
updateActiveLink();
