(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Thème clair / sombre ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var storedTheme = null;
  try { storedTheme = localStorage.getItem('theme'); } catch (e) { /* stockage indisponible */ }
  if (storedTheme === 'light' || storedTheme === 'dark') {
    root.setAttribute('data-theme', storedTheme);
  }
  updateThemeToggleLabel();

  themeToggle.addEventListener('click', function () {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* stockage indisponible */ }
    updateThemeToggleLabel();
  });

  function updateThemeToggleLabel() {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
    var isDark = current === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Activer le thème clair' : 'Activer le thème sombre');
  }

  /* ---------- Menu mobile ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');

  function closeMobileMenu(returnFocus) {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
    if (returnFocus) menuToggle.focus();
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    if (isOpen) {
      var firstLink = mainNav.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
  });

  mainNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () { closeMobileMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeMobileMenu(true);
    }
  });

  /* ---------- Scroll spy (surbrillance du lien actif) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var id = entry.target.getAttribute('id');
      var link = navLinks.find(function (l) { return l.getAttribute('href') === '#' + id; });
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(function (s) { spyObserver.observe(s); });

  /* ---------- Animation d'apparition au scroll ---------- */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll(
    '.case-card, .research-card, .demo-card, .wireframe-box, .mockup-box, .value-item'
  ));
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Bouton "retour en haut" ---------- */
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 480) {
      scrollTopBtn.classList.add('is-visible');
    } else {
      scrollTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Liens non encore actifs (réseaux sociaux, vidéo à venir) ---------- */
  document.querySelectorAll('[data-placeholder="true"]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ---------- Barres de statistiques animées (études de cas) ---------- */
  var barFills = Array.prototype.slice.call(document.querySelectorAll('.bar-fill'));
  if (barFills.length) {
    barFills.forEach(function (el) {
      var target = el.style.width;
      el.style.width = '0%';
      setTimeout(function () {
        el.style.transition = 'width 900ms ease';
        el.style.width = target;
      }, 100);
    });
  }

  /* ---------- Design visuel : onglets accessibles ---------- */
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  var tabPanels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));

  function activateTab(tab) {
    tabButtons.forEach(function (btn) {
      var isActive = btn === tab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    tabPanels.forEach(function (panel) {
      var shouldShow = panel.getAttribute('aria-labelledby') === tab.id;
      panel.hidden = !shouldShow;
      panel.classList.toggle('is-active', shouldShow);
    });
  }

  tabButtons.forEach(function (btn, index) {
    btn.addEventListener('click', function () { activateTab(btn); });
    btn.addEventListener('keydown', function (e) {
      var newIndex = null;
      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabButtons.length;
      if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (e.key === 'Home') newIndex = 0;
      if (e.key === 'End') newIndex = tabButtons.length - 1;
      if (newIndex !== null) {
        e.preventDefault();
        tabButtons[newIndex].focus();
        activateTab(tabButtons[newIndex]);
      }
    });
  });

  /* ---------- Démo d'interaction : bouton "J'aime" ---------- */
  var likeBtn = document.getElementById('demoLikeBtn');
  var likeLabel = document.getElementById('demoLikeLabel');
  if (likeBtn && likeLabel) {
    likeBtn.addEventListener('click', function () {
      var isPressed = likeBtn.getAttribute('aria-pressed') === 'true';
      likeBtn.setAttribute('aria-pressed', String(!isPressed));
      likeLabel.textContent = isPressed ? "J'aime" : 'Aimé !';
    });
  }

  /* ---------- Démo d'interaction : validation d'e-mail en direct ---------- */
  var demoEmail = document.getElementById('demoEmail');
  var demoEmailHint = document.getElementById('demoEmailHint');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (demoEmail && demoEmailHint) {
    demoEmail.addEventListener('input', function () {
      var value = demoEmail.value.trim();
      if (!value) {
        demoEmail.classList.remove('is-valid', 'is-invalid');
        demoEmailHint.textContent = 'Saisissez une adresse valide pour voir la validation en direct.';
        demoEmailHint.className = 'demo-hint';
        return;
      }
      if (emailPattern.test(value)) {
        demoEmail.classList.add('is-valid');
        demoEmail.classList.remove('is-invalid');
        demoEmailHint.textContent = 'Adresse e-mail valide.';
        demoEmailHint.className = 'demo-hint valid';
      } else {
        demoEmail.classList.add('is-invalid');
        demoEmail.classList.remove('is-valid');
        demoEmailHint.textContent = 'Format invalide — exemple : prenom@exemple.com';
        demoEmailHint.className = 'demo-hint invalid';
      }
    });
  }

  /* ---------- Démo d'interaction : validation d'un code à 4 chiffres en direct ---------- */
  var demoCode = document.getElementById('demoCode');
  var demoCodeHint = document.getElementById('demoCodeHint');
  var codePattern = /^\d{4}$/;

  if (demoCode && demoCodeHint) {
    demoCode.addEventListener('input', function () {
      demoCode.value = demoCode.value.replace(/\D/g, '').slice(0, 4);
      var value = demoCode.value;
      if (!value) {
        demoCode.classList.remove('is-valid', 'is-invalid');
        demoCodeHint.textContent = 'Saisissez un code à 4 chiffres pour voir la validation en direct.';
        demoCodeHint.className = 'demo-hint';
        return;
      }
      if (codePattern.test(value)) {
        demoCode.classList.add('is-valid');
        demoCode.classList.remove('is-invalid');
        demoCodeHint.textContent = 'Code valide.';
        demoCodeHint.className = 'demo-hint valid';
      } else {
        demoCode.classList.add('is-invalid');
        demoCode.classList.remove('is-valid');
        demoCodeHint.textContent = 'Le code doit contenir exactement 4 chiffres.';
        demoCodeHint.className = 'demo-hint invalid';
      }
    });
  }

  /* ---------- Démo d'interaction : interrupteur accessible ---------- */
  var demoSwitch = document.getElementById('demoSwitch');
  if (demoSwitch) {
    demoSwitch.addEventListener('click', function () {
      var isChecked = demoSwitch.getAttribute('aria-checked') === 'true';
      demoSwitch.setAttribute('aria-checked', String(!isChecked));
    });
  }

  /* ---------- Démo d'interaction : chargement progressif ---------- */
  var demoLoadBtn = document.getElementById('demoLoadBtn');
  var demoProgress = document.getElementById('demoProgress');
  var demoProgressBar = document.getElementById('demoProgressBar');
  var demoProgressStatus = document.getElementById('demoProgressStatus');
  var loadInterval = null;

  if (demoLoadBtn && demoProgress && demoProgressBar && demoProgressStatus) {
    demoLoadBtn.addEventListener('click', function () {
      if (loadInterval) clearInterval(loadInterval);
      var progress = 0;
      demoLoadBtn.disabled = true;
      demoProgressStatus.textContent = 'Chargement en cours…';

      loadInterval = setInterval(function () {
        progress += Math.random() * 18 + 8;
        if (progress >= 100) {
          progress = 100;
          clearInterval(loadInterval);
          demoLoadBtn.disabled = false;
          demoProgressStatus.textContent = 'Terminé !';
        }
        demoProgressBar.style.width = progress + '%';
        demoProgress.setAttribute('aria-valuenow', String(Math.round(progress)));
      }, 220);
    });
  }

  /* ---------- Formulaire de contact (envoi réel via Web3Forms) ---------- */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        formStatus.classList.add('is-error');
        formStatus.textContent = 'Merci de compléter tous les champs correctement.';
        return;
      }

      var accessKey = contactForm.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey.indexOf('COLLEZ_VOTRE_CLE') === 0) {
        formStatus.classList.add('is-error');
        formStatus.textContent = 'Formulaire non configuré : ajoutez votre clé Web3Forms dans index.html.';
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      formStatus.classList.remove('is-error');
      formStatus.textContent = 'Envoi en cours…';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: contactForm.querySelector('input[name="subject"]').value,
          name: contactForm.querySelector('#name').value,
          email: contactForm.querySelector('#email').value,
          message: contactForm.querySelector('#message').value,
          botcheck: contactForm.querySelector('input[name="botcheck"]').checked
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            formStatus.classList.remove('is-error');
            formStatus.textContent = 'Merci ! Votre message a bien été envoyé. Réponse sous 24h.';
            contactForm.reset();
          } else {
            formStatus.classList.add('is-error');
            formStatus.textContent = "L'envoi a échoué : " + (data.message || 'réessayez plus tard.');
          }
        })
        .catch(function () {
          formStatus.classList.add('is-error');
          formStatus.textContent = 'Connexion impossible. Réessayez plus tard ou écrivez directement par e-mail.';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* ---------- Année dans le footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
