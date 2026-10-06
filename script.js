// Liverpool Plumbing & Heating Solutions — interactions
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobileMenu');

  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) {
        menu.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close menu');
      } else {
        menu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    // Reset if resized to desktop while open
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && !menu.hasAttribute('hidden')) {
        menu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // Single-open accordion
  var details = Array.prototype.slice.call(document.querySelectorAll('.accordion details'));
  details.forEach(function (d) {
    d.querySelector('summary').addEventListener('click', function () {
      if (d.open) return;
      details.forEach(function (o) { if (o !== d && o.open) o.open = false; });
    });
  });

  // Restrained reveal on scroll
  var io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 })
    : null;
  document.querySelectorAll('.reveal').forEach(function (el) {
    if (io) io.observe(el); else el.classList.add('in');
  });

  // Analytics hook — easy to wire to GA/Plausible later.
  // Define window.LPHS_ANALYTICS = function(event, label){...} to capture events.
  window.trackCTA = function (event, label) {
    try {
      if (typeof window.LPHS_ANALYTICS === 'function') window.LPHS_ANALYTICS(event, label);
      if (window.dataLayer) window.dataLayer.push({ event: 'cta_click', cta: label || event });
    } catch (e) { /* no-op */ }
  };
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      window.trackCTA('cta_click', el.getAttribute('data-cta'));
    });
  });
})();
