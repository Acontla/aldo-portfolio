// ===== Switch de tema claro / oscuro =====
const themeSwitch = document.getElementById('theme-switch');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeSwitch) {
        themeSwitch.setAttribute('aria-checked', theme === 'light' ? 'true' : 'false');
    }
}

// Sincroniza el estado inicial del switch con el tema ya aplicado en el <head>
if (themeSwitch) {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    themeSwitch.setAttribute('aria-checked', current === 'light' ? 'true' : 'false');

    themeSwitch.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
    });
}

// ===== Navegacion Mobile =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Cerrar menu al hacer click en un link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Animaciones al hacer scroll (Intersection Observer) =====
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

// ===== Formulario de contacto (envio real a Formspree) =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn');
    const originalText = btn.textContent;
    const formData = new FormData(contactForm);

    btn.textContent = 'Enviando...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            btn.textContent = 'Enviado!';
            btn.style.opacity = '1';
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        } else {
            throw new Error('Error al enviar');
        }
    })
    .catch(() => {
        btn.textContent = 'Error, intenta de nuevo';
        btn.style.opacity = '1';
        btn.disabled = false;
        setTimeout(() => {
            btn.textContent = originalText;
        }, 3000);
    });
});

// ===== Smooth scroll para links internos =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Explorador de proyectos: lista (izq) abre panel lateral (der) =====
const projItems = document.querySelectorAll('.proj-item');
const projPanels = document.querySelectorAll('.proj-panel');

function activateProject(id) {
    projItems.forEach(item => {
        item.classList.toggle('is-active', item.dataset.project === id);
    });
    projPanels.forEach(panel => {
        panel.classList.toggle('is-active', panel.dataset.panel === id);
    });
}

projItems.forEach(item => {
    const id = item.dataset.project;
    // En desktop se abre al pasar el cursor
    item.addEventListener('mouseenter', () => activateProject(id));
    // En táctil / click también funciona
    item.addEventListener('click', () => activateProject(id));
    // Accesible por teclado: Enter, Espacio o al enfocar
    item.addEventListener('focus', () => activateProject(id));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activateProject(id);
        }
    });
});

// ===== Parallax sutil en los glow decorativos (respeta reduce-motion) =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const sectionGlows = document.querySelectorAll('.section-glow');
    if (sectionGlows.length) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            sectionGlows.forEach(glow => {
                glow.style.transform = `translateY(${scrolled * 0.05}px)`;
            });
        }, { passive: true });
    }
}
