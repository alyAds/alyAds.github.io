/* Burung merpati, efek hati, riak tombol, miring 3D foto hero, dan parallax. */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var $$ = function (q, c) {
    return [].slice.call((c || document).querySelectorAll(q));
  };
  var NS = "http://www.w3.org/2000/svg";

  // svg merpati
  var WING =
    "M5,2 C8,-14 4,-30 -6,-42 L-7,-33 L-12,-39 L-11,-28 L-18,-32 L-15,-21 L-23,-24 L-17,-12 L-22,-12 L-12,-1 L-6,3Z";
  var BARS =
    '<path d="M-2,0 L-6,-33 M-4,0 L-11,-28 M-6,1 L-15,-21 M-7,1 L-17,-12" stroke="#58657c" stroke-width=".55" fill="none" opacity=".5"/>';
  var TAIL =
    "M-13,1 C-20,2 -30,5 -38,9 L-35,12 L-32,10.5 L-31,14.5 L-27,11.8 L-25,15.5 L-20,11 L-14,8Z";
  var BODY =
    "M-15,3 C-12,-6 0,-11 11,-11 C15,-12 17,-14 21,-14 C26,-14 28,-10 25,-7 C23,-5 20,-4 18,-2 C14,6 4,9 -4,8 C-9,7 -13,6 -15,3Z";
  function dove(v) {
    var g = v === "g",
      body = g ? "url(#dvG)" : "url(#dvW)",
      wing = g ? "#a9b4c6" : "url(#dvWw)",
      far = g ? "#8d99ae" : "#c4cedb",
      st = g ? "#66738a" : "#8793ab",
      head = g ? "#6e7c93" : body;
    var W = function (f) {
      return (
        '<path d="' +
        WING +
        '" fill="' +
        f +
        '" stroke="' +
        st +
        '" stroke-width=".8" stroke-linejoin="round"/>'
      );
    };
    return (
      '<svg viewBox="-40 -40 80 58" aria-hidden="true"><g class="bob">' +
      '<g transform="translate(3,-6)"><g class="far">' +
      W(far) +
      "</g></g>" +
      '<path d="' +
      TAIL +
      '" fill="' +
      (g ? "#7b879c" : "url(#dvW)") +
      '" stroke="' +
      st +
      '" stroke-width=".8" stroke-linejoin="round"/>' +
      '<path d="' +
      BODY +
      '" fill="' +
      body +
      '" stroke="' +
      st +
      '" stroke-width=".8"/>' +
      '<circle cx="21.5" cy="-9.5" r="5" fill="' +
      head +
      '" stroke="' +
      st +
      '" stroke-width=".8"/>' +
      (g
        ? '<ellipse cx="14.5" cy="-6" rx="5" ry="3.6" fill="url(#dvI)" opacity=".85"/>'
        : "") +
      '<path d="M26,-10.6 L32,-8.8 L26,-7.4Z" fill="' +
      (g ? "#5c5560" : "#e1a89c") +
      '"/>' +
      '<circle cx="23.4" cy="-10.8" r="1" fill="' +
      (g ? "#e07a1f" : "#241818") +
      '"/>' +
      '<g transform="translate(1,-6)"><g class="near">' +
      W(wing) +
      BARS +
      "</g></g>" +
      "</g></svg>"
    );
  }
  // gradien burung
  (function () {
    var d = document.createElement("div");
    d.setAttribute("aria-hidden", "true");
    d.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    d.innerHTML =
      '<svg width="0" height="0"><defs>' +
      '<linearGradient id="dvW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d3dce9"/></linearGradient>' +
      '<linearGradient id="dvWw" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e3e9f2"/><stop offset="1" stop-color="#ffffff"/></linearGradient>' +
      '<linearGradient id="dvG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aab5c7"/><stop offset="1" stop-color="#8691a6"/></linearGradient>' +
      '<linearGradient id="dvI" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4fae8f"/><stop offset=".55" stop-color="#7d62b4"/><stop offset="1" stop-color="#4fae8f"/></linearGradient>' +
      "</defs></svg>";
    document.body.appendChild(d);
  })();
  function birdEl(v, w) {
    var d = document.createElement("div");
    d.className = "bd";
    d.style.width = w + "px";
    d.innerHTML = dove(v);
    return d;
  }
  // tambah wadah burung ke tiap bagian (selain hero yang sudah punya)
  var CFG = [
    [".quote", 6, "#EAF0FA"],
    [".mempelai", 6, "#0F031A"],
    [".std", 4, "#EAF0FA"],
    [".acara", 5, "#EAF0FA"],
    [".story", 4, "#0F031A"],
    [".galeri", 5, "#0F031A"],
    [".amplop", 4, "#EAF0FA"],
    [".closing1", 5, "#0F031A"],
    [".closing2", 5, "#0F031A"],
  ];
  CFG.forEach(function (c) {
    var sec = document.querySelector(c[0]);
    if (!sec) return;
    var f = document.createElement("div");
    f.className = "birdfield";
    f.dataset.birds = c[1];
    f.dataset.color = c[2];
    sec.insertBefore(f, sec.firstChild);
  });

  var ptr = null,
    ptrT = 0,
    fields = [];
  addEventListener(
    "pointermove",
    function (e) {
      ptr = { x: e.clientX, y: e.clientY };
      ptrT = performance.now();
    },
    { passive: true }
  );
  addEventListener(
    "pointerdown",
    function (e) {
      ptr = { x: e.clientX, y: e.clientY };
      ptrT = performance.now();
    },
    { passive: true }
  );

  function Field(el) {
    this.el = el;
    this.birds = [];
    this.visible = false;
    this.rect = null;
    this.color = el.dataset.color || "#0F031A";
    var n = +el.dataset.birds || 5;
    for (var i = 0; i < n; i++) this.add(false);
  }
  Field.prototype.size = function () {
    var r = this.el.getBoundingClientRect();
    this.rect = r;
    this.w = r.width;
    this.h = r.height;
  };
  Field.prototype.add = function (temp, x, y) {
    if (!this.w) this.size();
    var dark = this.color !== "#0F031A",
      v = Math.random() < (dark ? 0.85 : 0.5) ? "w" : "g",
      sz = temp ? 24 + Math.random() * 11 : 28 + Math.random() * 27,
      el = birdEl(v, sz);
    el.style.opacity = temp ? 1 : 0.9;
    this.el.appendChild(el);
    var dir = Math.random() < 0.5 ? -1 : 1;
    var b = {
      el: el,
      w: sz,
      dir: dir,
      sp: (0.5 + Math.random() * 0.9) * (sz / 52 + 0.45),
      phase: Math.random() * 6.28,
      freq: 0.5 + Math.random() * 0.9,
      amp: 10 + Math.random() * 26,
      by: y != null ? y : Math.random() * (this.h || 300),
      x: x != null ? x : Math.random() * (this.w || 450),
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      f: 0.24 + Math.random() * 0.14,
      temp: !!temp,
      life: temp ? 3.2 : 0,
      t: 0,
      gliding: false,
      glideCd: 1 + Math.random() * 5,
    };
    if (temp) {
      b.vx = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2.6);
      b.vy = -(0.5 + Math.random() * 1.4);
      b.dir = b.vx < 0 ? -1 : 1;
      b.f = 0.2 + Math.random() * 0.06;
      el.style.setProperty("--f", b.f + "s");
    }
    el.style.setProperty("--f", b.f + "s");
    this.birds.push(b);
    return b;
  };
  Field.prototype.step = function (dt, now) {
    var w = this.w,
      h = this.h,
      r = this.rect,
      active = ptr && now - ptrT < 1200;
    for (var i = this.birds.length - 1; i >= 0; i--) {
      var b = this.birds[i];
      b.t += dt;
      if (b.temp) {
        b.life -= dt;
        b.vx *= 0.992;
        b.vy *= 0.995;
        b.x += b.vx * dt * 60;
        b.by += b.vy * dt * 60;
        if (b.life < 0.8) b.el.style.opacity = Math.max(0, b.life / 0.8);
        if (b.life <= 0 || b.by < -60 || b.x < -60 || b.x > w + 60) {
          b.el.remove();
          this.birds.splice(i, 1);
          continue;
        }
      } else {
        b.x += b.dir * b.sp * dt * 60;
        if (b.x > w + 60) {
          b.x = -50;
          b.by = Math.random() * h;
        } else if (b.x < -60) {
          b.x = w + 50;
          b.by = Math.random() * h;
        }
      }
      var y = b.by + (b.temp ? 0 : Math.sin(b.t * b.freq + b.phase) * b.amp);
      var px = b.x + b.ox,
        py = y + b.oy,
        speed = 1;
      if (active && r) {
        var dx = px - (ptr.x - r.left),
          dy = py - (ptr.y - r.top),
          d = Math.hypot(dx, dy);
        if (d < 130 && d > 0.1) {
          var k = (130 - d) / 130;
          b.vx += (dx / d) * k * 2.4;
          b.vy += (dy / d) * k * 2.4;
          speed = 0.25;
        }
      }
      b.ox += b.vx * dt * 60 * (b.temp ? 0 : 1);
      b.oy += b.vy * dt * 60 * (b.temp ? 0 : 1);
      if (!b.temp) {
        b.vx *= 0.93;
        b.vy *= 0.93;
        b.ox *= 0.985;
        b.oy *= 0.985;
      }
      var flee = Math.min(1, Math.hypot(b.vx, b.vy) / 3);
      if (!b.temp) {
        b.el.style.setProperty("--f", b.f * (1 - 0.5 * flee) + "s");
        b.glideCd -= dt;
        if (flee > 0.25 && b.gliding) {
          b.gliding = false;
          b.glideCd = 2 + Math.random() * 3;
          b.el.classList.remove("glide");
        } else if (b.glideCd <= 0) {
          b.gliding = !b.gliding;
          b.glideCd = b.gliding
            ? 0.9 + Math.random() * 1.8
            : 2 + Math.random() * 5;
          b.el.classList.toggle("glide", b.gliding);
        }
      }
      var vxs = b.temp ? Math.abs(b.vx) : b.sp * 60,
        vys = b.temp
          ? b.vy
          : ((b.amp * b.freq * Math.cos(b.t * b.freq + b.phase)) / 60 + b.vy) *
            1;
      var pitch =
        Math.atan2(
          b.temp ? vys : vys * 1,
          Math.max(0.4, b.temp ? vxs : vxs / 60)
        ) *
        57.3 *
        (b.temp ? 1 : 0.5);
      pitch = Math.max(-26, Math.min(26, pitch));
      var face = b.temp ? (b.vx < 0 ? -1 : 1) : b.dir;
      b.el.style.transform =
        "translate3d(" +
        (px - b.w / 2) +
        "px," +
        (py - b.w * 0.3) +
        "px,0) rotate(" +
        pitch * face +
        "deg) scaleX(" +
        face +
        ")";
    }
  };
  $$(".birdfield").forEach(function (el) {
    fields.push(new Field(el));
  });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      fields.forEach(function (f) {
        if (f.el === e.target) {
          f.visible = e.isIntersecting;
          if (f.visible) f.size();
        }
      });
    });
  });
  fields.forEach(function (f) {
    io.observe(f.el);
  });
  addEventListener("resize", function () {
    fields.forEach(function (f) {
      f.size();
    });
  });

  var last = performance.now();
  (function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    fields.forEach(function (f) {
      if (f.visible) {
        f.rect = f.el.getBoundingClientRect();
        f.step(dt, now);
      }
    });
    requestAnimationFrame(loop);
  })(last);

  // efek merpati terbang saat klik
  var cooldown = 0;
  addEventListener("click", function (e) {
    if (e.target.closest("button,a,input,textarea,.lb,#music,iframe")) return;
    var now = performance.now();
    if (now - cooldown < 350) return;
    cooldown = now;
    fields.forEach(function (f) {
      if (!f.visible || !f.rect) return;
      var r = f.rect;
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        return;
      var cnt = f.birds.filter(function (b) {
        return b.temp;
      }).length;
      if (cnt > 14) return;
      for (var i = 0; i < 5; i++)
        f.add(
          true,
          e.clientX - r.left + (Math.random() - 0.5) * 20,
          e.clientY - r.top + (Math.random() - 0.5) * 20
        );
    });
  });

  // efek lope lope saat klik
  var HEART =
    '<svg viewBox="0 0 24 24"><path fill="COL" d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z"/></svg>';
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".photo,.m-photo,.cover-img,.flower,.heartable"))
      return;
    for (var i = 0; i < 7; i++) {
      var h = document.createElement("div");
      h.className = "heart";
      h.innerHTML = HEART.replace(
        "COL",
        ["#D7AC64", "#E8A0A8", "#ffffff", "#9fb3d1"][i % 4]
      );
      h.style.left = e.clientX + "px";
      h.style.top = e.clientY + "px";
      document.body.appendChild(h);
      var dx = (Math.random() - 0.5) * 110,
        dy = -(60 + Math.random() * 90),
        sc = 0.7 + Math.random() * 0.9;
      h.animate(
        [
          { transform: "translate(0,0) scale(.3)", opacity: 1 },
          {
            transform: "translate(" + dx + "px," + dy + "px) scale(" + sc + ")",
            opacity: 0,
          },
        ],
        {
          duration: 1100 + Math.random() * 600,
          easing: "cubic-bezier(.2,.7,.3,1)",
        }
      ).onfinish = (function (n) {
        return function () {
          n.remove();
        };
      })(h);
    }
  });

  // efek klik
  document.addEventListener("pointerdown", function (e) {
    var b = e.target.closest(".btn,#open,.h-btn");
    if (!b) return;
    var r = b.getBoundingClientRect(),
      s = Math.max(r.width, r.height),
      d = document.createElement("span");
    d.className = "ripple";
    d.style.cssText =
      "width:" +
      s +
      "px;height:" +
      s +
      "px;left:" +
      (e.clientX - r.left - s / 2) +
      "px;top:" +
      (e.clientY - r.top - s / 2) +
      "px";
    b.appendChild(d);
    setTimeout(function () {
      d.remove();
    }, 650);
  });

  // miring 3D foto mengikuti pointer
  var hero = document.getElementById("hero"),
    arch = hero && hero.querySelector(".arch");
  if (arch) {
    var setTilt = function (nx, ny) {
      arch.style.setProperty("--ry", nx * 9 + "deg");
      arch.style.setProperty("--rx", -ny * 7 + "deg");
    };
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      setTilt(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        ((e.clientY - r.top) / r.height) * 2 - 1
      );
    });
    hero.addEventListener("pointerleave", function () {
      setTilt(0, 0);
    });
    addEventListener("deviceorientation", function (e) {
      if (e.gamma == null) return;
      setTilt(
        Math.max(-1, Math.min(1, e.gamma / 30)),
        Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 30))
      );
    });
  }

  // parallax latar & progres timeline saat scroll
  var par = [
    ["#hero", "bottom"],
    [".quote", "bottom"],
    [".closing1", "top"],
  ]
    .map(function (a) {
      return { el: document.querySelector(a[0]), base: a[1] };
    })
    .filter(function (x) {
      return x.el;
    });
  var tl = document.querySelector(".tl"),
    ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      par.forEach(function (p) {
        var r = p.el.getBoundingClientRect(),
          vh = innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        var k = (r.top + r.height / 2 - vh / 2) / vh;
        var pos = (p.base === "bottom" ? 100 : 0) + k * 14;
        p.el.style.backgroundPosition =
          "center " + Math.max(0, Math.min(100, pos)) + "%";
      });
      if (tl) {
        var r = tl.getBoundingClientRect();
        var pr = (innerHeight * 0.7 - r.top) / r.height;
        tl.style.setProperty("--prog", Math.max(0, Math.min(1, pr)));
      }
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
