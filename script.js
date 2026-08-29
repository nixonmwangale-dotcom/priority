document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => cio.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- Testimonial carousel ---------- */
  const slides = document.querySelectorAll('.testi-slide');
  const dotsWrap = document.querySelector('.testi-dots');
  if (slides.length && dotsWrap) {
    let current = 0;
    const dots = [];
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => show(i));
      dotsWrap.appendChild(b);
      dots.push(b);
    });
    function show(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    setInterval(() => show((current + 1) % slides.length), 6000);
  }

  /* ---------- Parallax hero ---------- */
  const parallaxEls = document.querySelectorAll('.parallax-layer');
  if (parallaxEls.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
        el.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }

  /* ---------- Active nav link by page ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Volunteer form ---------- */
  const volForm = document.getElementById('volunteer-form');
  if (volForm) {
    volForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('volunteer-success');
      if (success) {
        success.classList.add('show');
        success.textContent = "Thank you, " + (volForm.querySelector('#v-name').value || 'friend') + " — we've received your details and a Priority Five Initiative coordinator will reach out within 3 working days.";
      }
      volForm.reset();
    });
  }

  /* ---------- Newsletter form(s) ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.newsletter-note');
      if (note) { note.textContent = "You're subscribed — karibu!"; note.style.color = 'var(--yellow)'; }
      form.reset();
    });
  });

  /* ---------- Donate amount selector ---------- */
  const amountBtns = document.querySelectorAll('.amount-btn');
  if (amountBtns.length) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  /* ---------- Accordion (programs how-it-works, if used) ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.classList.toggle('open');
      panel.style.maxHeight = isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

});
