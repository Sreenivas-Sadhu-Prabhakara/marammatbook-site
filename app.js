/* MarammatBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero job card moves itself along the pipeline —
      repairing -> ready -> pickup message staged -> delivered with warranty,
      and the "on the bench" / "ready for pickup" counts tick over.
      A live demo of the promise. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the job card moves itself ---------- */
  var rows = document.getElementById("reg-rows");
  var liveTag = document.getElementById("reg-live-tag");
  var caption = document.getElementById("reg-caption");
  var openEl = document.getElementById("reg-open");
  var readyEl = document.getElementById("reg-ready");

  if (!rows || !liveTag || !openEl || !readyEl) return;

  // The middle "in the shop" row is the one that moves along the pipeline.
  var jobRow = rows.querySelector('[data-state="active"]');

  // Cycle: repairing -> ready (msg staged) -> delivered (warranty set) -> reset.
  var stages = [
    {
      tag: "Repairing",
      tagClass: "tag--due",
      caption: "Display + digitiser fitted — labour and parts logged as you go.",
      open: "7 jobs",
      ready: "2 jobs",
      state: "active",
      flash: false
    },
    {
      tag: "Ready ✓",
      tagClass: "tag--paid",
      caption: "Marked ready → a \"your iPhone 12 is ready for pickup\" message staged.",
      open: "6 jobs",
      ready: "3 jobs",
      state: "done",
      flash: true
    },
    {
      tag: "Delivered",
      tagClass: "tag--paid",
      caption: "Handed over · warranty-until set to 90 days. That's the whole flow.",
      open: "6 jobs",
      ready: "2 jobs",
      state: "done",
      flash: false
    }
  ];

  var i = 0;

  function applyStage(s) {
    liveTag.textContent = s.tag;
    liveTag.className = "reg-row__tag " + s.tagClass;
    if (jobRow) jobRow.setAttribute("data-state", s.state);
    caption.textContent = s.caption;
    openEl.textContent = s.open;
    readyEl.textContent = s.ready;
    if (jobRow && s.flash) {
      jobRow.classList.add("flash");
      setTimeout(function () {
        jobRow.classList.remove("flash");
      }, 900);
    }
  }

  // If the user prefers reduced motion, just show the "ready" end-state once
  // (the promise fulfilled) and don't loop.
  if (reduceMotion) {
    applyStage(stages[1]);
    liveTag.textContent = "Ready ✓";
    caption.textContent =
      "Repairing → ready → pickup message → delivered with warranty — hands-free.";
    return;
  }

  // Only animate while the widget is on screen (saves work, feels intentional).
  var running = false;
  var timer = null;

  function advance() {
    i = (i + 1) % stages.length;
    applyStage(stages[i]);
  }

  function loop() {
    timer = setTimeout(function () {
      advance();
      loop();
    }, i === 0 ? 2600 : 2000);
  }

  var vis = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
        }
      });
    },
    { threshold: 0.35 }
  );
  vis.observe(rows.closest(".register"));
})();
