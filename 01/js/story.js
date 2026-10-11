/* Love Story: tumpukan foto, polaroid flip, garis waktu, dan navigasi bab. */
(function () {
  var $ = function (q, c) {
      return (c || document).querySelector(q);
    },
    $$ = function (q, c) {
      return [].slice.call((c || document).querySelectorAll(q));
    };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // galeri foto digeser / diketuk
  var stack = $("#stack"),
    order = $$(".sc", stack),
    n = order.length,
    drag = null,
    moved = 0,
    lastAct = 0,
    vis = false;
  var POS = [
    [0, 0, 0],
    [10, -3, 4],
    [-9, -6, -5],
    [14, -9, 7],
  ];
  function layout() {
    order.forEach(function (c, i) {
      var p = POS[Math.min(i, 3)];
      c.style.zIndex = 20 - i;
      c.style.transition =
        "transform .55s cubic-bezier(.2,.8,.2,1),opacity .45s";
      c.style.transform =
        "translate(" +
        p[0] +
        "px," +
        p[1] +
        "px) rotate(" +
        p[2] +
        "deg) scale(" +
        (1 - Math.min(i, 3) * 0.035) +
        ")";
      c.style.opacity = i > 3 ? 0 : 1;
    });
  }
  function fly(dir) {
    var top = order[0];
    lastAct = performance.now();
    top.style.transition =
      "transform .5s cubic-bezier(.5,0,.9,.4),opacity .45s";
    top.style.transform =
      "translate(" +
      dir * Math.max(420, innerWidth) +
      "px,-50px) rotate(" +
      dir * 26 +
      "deg)";
    top.style.opacity = 0;
    setTimeout(function () {
      order.push(order.shift());
      top.style.transition = "none";
      requestAnimationFrame(layout);
    }, 480);
  }
  layout();
  stack.addEventListener("pointerdown", function (e) {
    if (!e.target.closest(".sc") || drag) return;
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId };
    moved = 0;
    lastAct = performance.now();
    order[0].style.transition = "none";
  });
  stack.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x,
      dy = e.clientY - drag.y;
    moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
    if (moved > 8 && !stack.hasPointerCapture(e.pointerId))
      try {
        stack.setPointerCapture(e.pointerId);
      } catch (_) {}
    order[0].style.transform =
      "translate(" + dx + "px," + dy * 0.4 + "px) rotate(" + dx / 14 + "deg)";
  });
  function up(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    var dx = (e ? e.clientX : drag.x) - drag.x,
      d = drag;
    drag = null;
    if (Math.abs(dx) > 70) fly(dx > 0 ? 1 : -1);
    else if (moved < 8) fly(Math.random() < 0.5 ? -1 : 1); // ketuk
    else layout();
  }
  stack.addEventListener("pointerup", up);
  stack.addEventListener("pointercancel", function (e) {
    drag = null;
    layout();
  });
  // tidak ada efek klik saat geser
  stack.addEventListener(
    "click",
    function (e) {
      if (moved > 8) e.stopPropagation();
    },
    true
  );
  new IntersectionObserver(function (es) {
    vis = es[0].isIntersecting;
  }).observe(stack);
  if (!reduce)
    setInterval(function () {
      if (vis && !drag && performance.now() - lastAct > 3500)
        fly(Math.random() < 0.5 ? -1 : 1);
    }, 4200);

  // efek flip card
  $$(".pol").forEach(function (p) {
    function flip() {
      p.classList.toggle("flip");
      var h = $(".hint", p);
      if (h) h.style.opacity = 0;
    }
    p.addEventListener("click", flip);
    p.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flip();
      }
    });
  });

  // teks muncul kata demi kata
  if (!reduce)
    $$(".tx").forEach(function (t) {
      var words = t.textContent.trim().split(/\s+/);
      t.textContent = "";
      t.classList.add("sp");
      words.forEach(function (w, i) {
        var sp = document.createElement("span");
        sp.textContent = w;
        sp.style.transitionDelay = Math.min(i * 35, 1400) + "ms";
        t.appendChild(sp);
        t.appendChild(document.createTextNode(" "));
      });
    });

  // progres garis, bab aktif, navigasi
  var tl = $("#tl2"),
    chs = $$(".ch", tl),
    navs = $$("#chnav button"),
    tick = false;
  function update() {
    tick = false;
    var anchor = innerHeight * 0.58,
      r = tl.getBoundingClientRect();
    tl.style.setProperty(
      "--prog",
      Math.max(0, Math.min(1, (anchor - r.top - 18) / (r.height - 36)))
    );
    var cur = -1;
    chs.forEach(function (c, i) {
      var cr = c.getBoundingClientRect(),
        reached = cr.top < anchor;
      c.classList.toggle("on", reached);
      if (reached && cr.bottom > anchor - 40) cur = i;
    });
    chs.forEach(function (c, i) {
      c.classList.toggle("cur", i === cur);
    });
    navs.forEach(function (b, i) {
      b.classList.toggle("act", i === cur);
    });
  }
  addEventListener(
    "scroll",
    function () {
      if (!tick) {
        tick = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  addEventListener("resize", update);
  update();
  navs.forEach(function (b) {
    b.addEventListener("click", function () {
      var c = chs[+b.dataset.go];
      var y = c.getBoundingClientRect().top + scrollY - innerHeight * 0.18;
      scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
  });
})();
