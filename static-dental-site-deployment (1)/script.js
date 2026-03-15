/* ============================================
   DR. GUPTA'S DENTAL CLINIC - SCRIPT.JS
   Minimal, performant vanilla JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Hamburger / Mobile Menu ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuLinks  = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        hamburger.classList.add('open');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    menuLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ── Active nav link on scroll ── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    var scrollPos = window.scrollY + 90;
    sections.forEach(function (section) {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + section.id) {
            a.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ── Scroll Reveal ── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Appointment Form Submission ── */
  var apptForm    = document.getElementById('appointmentForm');
  var formBody    = document.getElementById('formBody');
  var formSuccess = document.getElementById('formSuccess');

  if (apptForm) {
    apptForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = apptForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      /* Simulate async submission */
      setTimeout(function () {
        formBody.style.display    = 'none';
        formSuccess.classList.add('show');
        apptForm.reset();
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Request Appointment';
      }, 1200);
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Year in footer ── */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ── Reviews carousel: drag + dots + auto-scroll ── */
  var rvTrack = document.getElementById('reviewsTrack');
  var rvDots  = document.querySelectorAll('.rv-dot');

  if (rvTrack && rvDots.length) {
    var currentSlide = 0;
    var totalSlides  = rvDots.length;
    var autoTimer    = null;

    function getCardWidth() {
      var card = rvTrack.querySelector('.rv-card');
      if (!card) return 300;
      return card.offsetWidth + 20; /* card width + gap */
    }

    function goToSlide(idx) {
      currentSlide = Math.max(0, Math.min(idx, totalSlides - 1));
      rvTrack.scrollTo({ left: currentSlide * getCardWidth(), behavior: 'smooth' });
      rvDots.forEach(function (d, i) {
        d.classList.toggle('rv-dot--active', i === currentSlide);
      });
    }

    /* Dot click */
    rvDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAuto();
      });
    });

    /* Auto-advance every 4 s */
    function startAuto() {
      autoTimer = setInterval(function () {
        goToSlide((currentSlide + 1) % totalSlides);
      }, 4000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }
    startAuto();

    /* Drag scroll (mouse) */
    var isDown = false, startX, scrollLeft;
    rvTrack.addEventListener('mousedown', function (e) {
      isDown = true;
      rvTrack.style.cursor = 'grabbing';
      startX     = e.pageX - rvTrack.offsetLeft;
      scrollLeft = rvTrack.scrollLeft;
    });
    rvTrack.addEventListener('mouseleave', function () { isDown = false; rvTrack.style.cursor = ''; });
    rvTrack.addEventListener('mouseup',    function () { isDown = false; rvTrack.style.cursor = ''; });
    rvTrack.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var walk = (e.pageX - rvTrack.offsetLeft - startX) * 1.4;
      rvTrack.scrollLeft = scrollLeft - walk;
    });

    /* Update active dot on native scroll */
    rvTrack.addEventListener('scroll', function () {
      var idx = Math.round(rvTrack.scrollLeft / getCardWidth());
      if (idx !== currentSlide) {
        currentSlide = idx;
        rvDots.forEach(function (d, i) {
          d.classList.toggle('rv-dot--active', i === currentSlide);
        });
      }
    }, { passive: true });
  }

})();
