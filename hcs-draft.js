/* Shared behaviour for every page: nav disclosure and scroll reveal.
   No dependencies. Everything degrades to static under reduced motion, and
   nothing here is load-bearing for reading the page. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* mobile nav disclosure */
  var btn = document.getElementById('nav-toggle');
  var panel = document.getElementById('nav-links');
  if (btn && panel) {
    var mq = window.matchMedia('(max-width: 768px)');
    var sync = function () { panel.hidden = mq.matches; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
    panel.addEventListener('click', function (e) {
      if (mq.matches && e.target.closest('a')) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mq.matches && !panel.hidden) {
        panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus();
      }
    });
    mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
    sync();
  }

  /* scroll reveal: IntersectionObserver, never a scroll listener */
  var items = document.querySelectorAll('.rise');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('seen');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
    /* Safety net: nothing stays hidden because an observer missed it. */
    setTimeout(function () {
      for (var k = 0; k < items.length; k++) items[k].classList.add('seen');
    }, 2500);
  }

  /* hero video is decoration: stop it for anyone who asked for less motion */
  var v = document.querySelector('.hero-media video');
  if (v && reduce.matches) { v.pause(); v.removeAttribute('autoplay'); }
})();
