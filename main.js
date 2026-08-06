(function(){
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll(){
    if(window.scrollY > 12){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  navToggle.addEventListener('click', function(){
    var open = mobileNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      mobileNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Five Pillars Arc ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.arc-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.pillar-panel'));

  function selectPillar(key){
    tabs.forEach(function(t){ t.setAttribute('aria-selected', t.dataset.pillar === key ? 'true' : 'false'); });
    panels.forEach(function(p){ p.classList.toggle('is-active', p.dataset.panel === key); });
  }
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){ selectPillar(tab.dataset.pillar); });
  });
  // Default open: Artificial Intelligence, the flagship programme
  selectPillar('ai');

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- Stat count-up ---------- */
  var statNums = document.querySelectorAll('.stat .num');
  var counted = false;
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window && statNums.length){
    var statsIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !counted){
          counted = true;
          statNums.forEach(animateCount);
        }
      });
    }, { threshold: 0.4 });
    statsIo.observe(document.querySelector('.stats-band'));
  } else {
    statNums.forEach(function(el){
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Modals ---------- */
  var openTriggers = document.querySelectorAll('[data-modal-open]');
  var lastFocused = null;

  function openModal(key){
    var overlay = document.getElementById('modal-' + key);
    if(!overlay) return;
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var firstField = overlay.querySelector('input, select, textarea');
    if(firstField) firstField.focus();
  }
  function closeModal(overlay){
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if(lastFocused) lastFocused.focus();
  }

  openTriggers.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      openModal(btn.getAttribute('data-modal-open'));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(function(overlay){
    overlay.addEventListener('click', function(e){
      if(e.target === overlay){ closeModal(overlay); }
    });
    overlay.querySelectorAll('[data-modal-close]').forEach(function(btn){
      btn.addEventListener('click', function(){ closeModal(overlay); });
    });
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      document.querySelectorAll('.modal-overlay.is-open').forEach(closeModal);
    }
  });

  /* ---------- Forms: submit to Web3Forms (falls back to mailto) ---------- */
  // 1. Go to https://web3forms.com, enter the email that should receive
  //    submissions (prioryfive.i@gmail.com), confirm it — no account/password needed.
  // 2. Paste the access key you're emailed into WEB3FORMS_ACCESS_KEY below.
  // Until a real key is set, forms automatically fall back to opening an email draft.
  var WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

  function submitViaMailto(form, subject){
    var lines = [];
    Array.prototype.forEach.call(form.elements, function(el){
      if(!el.name || el.type === 'hidden') return;
      var value = el.value ? el.value.trim() : '';
      if(value){ lines.push(el.name + ': ' + value); }
    });
    var mailto = 'mailto:prioryfive.i@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = mailto;
  }

  function showSuccess(form, message){
    form.style.display = 'none';
    var success = form.parentElement.querySelector('.form-success');
    if(success){
      var msgEl = success.querySelector('.modal-sub');
      if(msgEl && message){ msgEl.textContent = message; }
      success.classList.add('is-visible');
    }
  }

  function showError(form){
    var note = form.querySelector('.form-note');
    if(note){
      note.textContent = "Something went wrong sending that. Please email prioryfive.i@gmail.com or call 0757 319 555 directly.";
      note.style.color = '#B4502A';
    }
  }

  document.querySelectorAll('form[data-form]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var subject = form.getAttribute('data-subject') || 'Inquiry — Priority Five Initiative';
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';

      // No key configured yet — use the reliable mailto fallback.
      if(!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE"){
        submitViaMailto(form, subject);
        showSuccess(form, "We've opened your email app with your details filled in — just hit send.");
        return;
      }

      var formData = new FormData(form);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', subject);
      formData.append('from_name', 'Priority Five Initiative website');

      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.success){
          showSuccess(form, "Thank you — your submission has been sent. We'll be in touch soon.");
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(function(){
        // Network or service issue — fall back to mailto so nothing gets lost.
        submitViaMailto(form, subject);
        showSuccess(form, "We've opened your email app with your details filled in — just hit send.");
      })
      .finally(function(){
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      });
    });
  });

})();
