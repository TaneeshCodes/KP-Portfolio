/* Kashisa Padhy — Portfolio interactions */
(function () {
  "use strict";

  /* Enable scroll-reveal animation only when it can actually play.
     Until then the base (visible) styles apply — so print/PDF/backgrounded
     tabs / reduced-motion / no-JS always show content. */
  var root = document.documentElement;
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function armAnimation() {
    if (!prefersReduced && document.visibilityState === "visible") {
      root.classList.add("anim-ready");
    }
  }
  armAnimation();
  // If the page loaded in a background tab, arm once it becomes visible.
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") { armAnimation(); if (typeof update === "function") update(); }
  });
  // Never let the animated (hidden) state bleed into print/PDF output.
  window.addEventListener("beforeprint", function () { root.classList.remove("anim-ready"); });
  window.addEventListener("afterprint", armAnimation);

  /* ---- sticky nav state ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  function setMenu(open) {
    toggle.classList.toggle("open", open);
    mobile.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () {
    setMenu(!mobile.classList.contains("open"));
  });
  mobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  /* ---- reveal + scroll-spy (scroll-position based; robust everywhere) ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var sections = ["home", "about", "projects", "experience", "education", "skills"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var links = {};
  document.querySelectorAll('.nav__links a[href^="#"]').forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });

  var ticking = false;

  /* Failsafe: if the entrance transition never advances (paused/throttled
     render contexts, e.g. some preview panes), hard-commit the visible
     end-state so content can never get stuck invisible. */
  function commitIfStalled(el) {
    setTimeout(function () {
      if (el.classList.contains("shown")) return;
      var op = parseFloat(getComputedStyle(el).opacity);
      if (isNaN(op) || op < 0.9) el.classList.add("shown");
    }, 1400);
  }

  function update() {
    ticking = false;
    var vh = window.innerHeight;

    /* reveal anything whose top is within ~92% of the viewport */
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      var top = el.getBoundingClientRect().top;
      if (top < vh * 0.9) {
        el.classList.add("in");
        commitIfStalled(el);
        reveals.splice(i, 1);
      }
    }

    /* scroll-spy: section whose midpoint band crosses ~38% of viewport */
    var marker = vh * 0.38, current = null;
    sections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= marker && r.bottom > marker) current = s.id;
    });
    if (current) {
      Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
      if (links[current]) links[current].classList.add("active");
      else if (current === "skills" && links.education) links.education.classList.add("active");
    }
  }
  function onTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onTick, { passive: true });
  window.addEventListener("resize", onTick);
  window.addEventListener("load", update);
  update();

  /* ---- contact form validation ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    var nameF = document.getElementById("f-name");
    var emailF = document.getElementById("f-email");
    var msgF = document.getElementById("f-msg");
    var ok = document.getElementById("formOk");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function clearOn(field, input) {
      input.addEventListener("input", function () {
        if (field.classList.contains("invalid")) field.classList.remove("invalid");
      });
    }
    clearOn(nameF, document.getElementById("in-name"));
    clearOn(emailF, document.getElementById("in-email"));
    clearOn(msgF, document.getElementById("in-msg"));

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = document.getElementById("in-name").value.trim();
      var email = document.getElementById("in-email").value.trim();
      var msg = document.getElementById("in-msg").value.trim();
      var valid = true;
      nameF.classList.toggle("invalid", !name); if (!name) valid = false;
      emailF.classList.toggle("invalid", !emailRe.test(email)); if (!emailRe.test(email)) valid = false;
      msgF.classList.toggle("invalid", msg.length < 4); if (msg.length < 4) valid = false;
      if (!valid) { ok.classList.remove("show"); return; }
      ok.classList.add("show");
      form.querySelectorAll("input, textarea").forEach(function (f) { f.value = ""; });
      setTimeout(function () { ok.classList.remove("show"); }, 6000);
    });
  }

  /* ---- year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
