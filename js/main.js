/* Black Inheritance — site behaviour. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  /* ---- Mobile menu ---- */
  var overlay = document.getElementById("menu");
  var openBtn = document.querySelector(".site-header .menu-btn");
  var closeBtn = overlay ? overlay.querySelector(".menu-btn") : null;

  function setMenu(open) {
    if (!overlay || !openBtn) return;
    overlay.hidden = !open;
    openBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
    (open ? closeBtn : openBtn).focus();
  }
  if (openBtn) openBtn.addEventListener("click", function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay && !overlay.hidden) setMenu(false);
  });

  /* ---- Reveal on scroll ----
     Only elements below the first screen are hidden, so the page is complete at rest. */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = [].slice.call(document.querySelectorAll("[data-reveal]"));
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("reveal-in");
          en.target.classList.remove("reveal-pending");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("reveal-pending");
        io.observe(el);
      }
    });
  }

  /* ---- Work filter ---- */
  var filters = [].slice.call(document.querySelectorAll(".filter"));
  var cards = [].slice.call(document.querySelectorAll(".work-grid .work-card"));
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      cards.forEach(function (c) {
        c.hidden = !(cat === "all" || (c.getAttribute("data-cat") || "").split(" ").indexOf(cat) > -1);
      });
    });
  });

  /* ---- Forms ----
     Static site: hook these up to Netlify Forms, Formspree or your own endpoint.
     Until then, submissions are validated and acknowledged on the page only. */
  [].slice.call(document.querySelectorAll("form[data-static]")).forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-note");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (note) note.textContent = form.getAttribute("data-success") || "Thank you. We will be in touch.";
      form.reset();
    });
  });

  /* ---- Footer year ---- */
  [].slice.call(document.querySelectorAll("[data-year]")).forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
