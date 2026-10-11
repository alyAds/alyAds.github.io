/* Hitung mundur, video, lightbox galeri, amplop digital, serta RSVP/ucapan (Google Sheet). */
(function () {
  var $ = function (q, c) {
      return (c || document).querySelector(q);
    },
    $$ = function (q, c) {
      return [].slice.call((c || document).querySelectorAll(q));
    };

  var cd = $("#cd"),
    target = new Date(cd.dataset.target).getTime();
  function tick() {
    var d = Math.max(0, target - Date.now()),
      p = function (n) {
        return String(n).padStart(2, "0");
      };
    $("[data-p=d]", cd).textContent = Math.floor(d / 864e5);
    $("[data-p=h]", cd).textContent = p(Math.floor((d % 864e5) / 36e5));
    $("[data-p=m]", cd).textContent = p(Math.floor((d % 36e5) / 6e4));
    $("[data-p=s]", cd).textContent = p(Math.floor((d % 6e4) / 1e3));
  }
  tick();
  setInterval(tick, 1000);

  var co = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target,
          end = +el.dataset.count,
          t0 = performance.now();
        (function f(t) {
          var k = Math.min(1, (t - t0) / 2000);
          el.textContent = Math.round(end * k);
          if (k < 1) requestAnimationFrame(f);
        })(t0);
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach(function (el) {
    co.observe(el);
  });

  var stdLoaded = false;
  window.addEventListener("invitation-open", function () {
    if (stdLoaded) return;
    stdLoaded = true;
    var id = "-koKPVSwiOo";
    $("#stdVid").innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' +
      id +
      "?autoplay=1&mute=1&controls=0&loop=1&playlist=" +
      id +
      '&playsinline=1&modestbranding=1&rel=0" allow="autoplay; encrypted-media" title="Latar video"></iframe>';
  });

  var yt = $("#yt");
  yt.addEventListener("click", function () {
    if ($("iframe", yt)) return;
    var f = document.createElement("iframe");
    f.src =
      "https://www.youtube-nocookie.com/embed/" +
      yt.dataset.id +
      "?autoplay=1&rel=0";
    f.allow = "autoplay; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    f.title = "Video undangan";
    yt.innerHTML = "";
    yt.appendChild(f);
    if (window.__pauseMusic) window.__pauseMusic();
  });

  // lightbox
  var links = $$("#grid a"),
    lb = $("#lb"),
    lbi = $("img", lb),
    cur = 0;
  function show(i) {
    cur = (i + links.length) % links.length;
    lbi.src = links[cur].getAttribute("href");
    lb.classList.add("open");
  }
  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      show(i);
    });
  });
  $(".x", lb).onclick = function () {
    lb.classList.remove("open");
  };
  $(".p", lb).onclick = function () {
    show(cur - 1);
  };
  $(".n", lb).onclick = function () {
    show(cur + 1);
  };
  lb.addEventListener("click", function (e) {
    if (e.target === lb) lb.classList.remove("open");
  });
  addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") lb.classList.remove("open");
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });

  // amplop digital
  $("#klik").addEventListener("click", function () {
    $("#amplop").classList.toggle("show");
  });
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.copy,
        done = function () {
          var o = b.textContent;
          b.textContent = "Tersalin.";
          setTimeout(function () {
            b.textContent = o;
          }, 1500);
        };
      if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(v).then(done, function () {
          b.textContent = "Gagal";
        });
      else {
        var t = document.createElement("textarea");
        t.value = v;
        document.body.appendChild(t);
        t.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {}
        t.remove();
      }
    });
  });

  var SHEET = (window.UNDANGAN_CONFIG && window.UNDANGAN_CONFIG.sheetUrl) || "";
  var KEY = "undangan-ezi-ayu-ucapan",
    pres = "",
    rName = $("#rName"),
    rMsg = $("#rMsg"),
    send = $("#rSend"),
    info = $("#rInfo"),
    items = [],
    busy = false;
  function say(t, err) {
    info.textContent = t;
    info.style.color = err ? "#b3261e" : "";
  }
  function lload() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function lsave(a) {
    try {
      localStorage.setItem(KEY, JSON.stringify(a));
    } catch (e) {}
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }
  function ago(t) {
    var m = Math.floor((Date.now() - t) / 6e4);
    if (m < 1) return "Baru saja";
    if (m < 60) return m + " menit lalu";
    var h = Math.floor(m / 60);
    if (h < 24) return h + " jam lalu";
    return Math.floor(h / 24) + " hari lalu";
  }
  function render(stats) {
    var hd = stats
      ? stats.hadir
      : items.filter(function (x) {
          return x.p === "hadir";
        }).length;
    var td = stats
      ? stats.tidak
      : items.filter(function (x) {
          return x.p === "tidak";
        }).length;
    $("#sHadir").textContent = hd;
    $("#sTidak").textContent = td;
    $("#rList").innerHTML = items
      .slice(-50)
      .reverse()
      .map(function (x) {
        return (
          '<div class="cm"><div class="av">' +
          esc(String(x.n).charAt(0).toUpperCase()) +
          "</div><div><b>" +
          esc(x.n) +
          '</b><span class="tag">' +
          (x.p === "hadir" ? "Hadir" : "Tidak Hadir") +
          "</span><small>" +
          ago(x.t) +
          "</small><p>" +
          esc(x.m) +
          "</p></div></div>"
        );
      })
      .join("");
  }
  function refresh() {
    if (!SHEET) {
      items = lload();
      render();
      return Promise.resolve();
    }
    return fetch(SHEET)
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d && d.ok) {
          items = d.items || [];
          render(d.stats);
        }
      })
      .catch(function () {});
  }
  function check() {
    send.disabled = busy || !(rName.value.trim() && rMsg.value.trim() && pres);
  }
  [rName, rMsg].forEach(function (el) {
    el.addEventListener("input", check);
  });
  $$(".pill").forEach(function (b) {
    b.addEventListener("click", function () {
      pres = b.dataset.v;
      $$(".pill").forEach(function (x) {
        x.classList.toggle("on", x === b);
      });
      check();
    });
  });
  function finished() {
    rMsg.value = "";
    pres = "";
    $$(".pill").forEach(function (x) {
      x.classList.remove("on");
    });
    say("Terima kasih, ucapan kamu sudah terkirim.");
    setTimeout(function () {
      say("");
    }, 4000);
  }
  send.addEventListener("click", function () {
    if (busy) return;
    var rec = {
      n: rName.value.trim(),
      m: rMsg.value.trim(),
      p: pres,
      t: Date.now(),
    };
    if (!SHEET) {
      items.push(rec);
      lsave(items);
      finished();
      render();
      check();
      return;
    }
    busy = true;
    check();
    say("Mengirim...");
    fetch(SHEET, {
      method: "POST",
      body: JSON.stringify({
        n: rec.n,
        m: rec.m,
        p: rec.p,
        hp: ($("#rHp") || {}).value || "",
      }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (!d || !d.ok) throw new Error((d && d.error) || "gagal");
        items.push(rec);
        render();
        finished();
        refresh();
      })
      .catch(function () {
        say("Gagal mengirim. Periksa koneksi lalu coba lagi.", true);
      })
      .then(function () {
        busy = false;
        check();
      });
  });
  var g = new URLSearchParams(location.search).get("to");
  if (g) (rName.value = g), check();
  refresh();
  if (SHEET) {
    // segarkan daftar saat bagian ucapan terlihat dan tiap 60 detik
    var seen = false;
    new IntersectionObserver(function (es) {
      seen = es[0].isIntersecting;
      if (seen) refresh();
    }).observe($("#rList"));
    setInterval(function () {
      if (seen && !document.hidden) refresh();
    }, 60000);
  }
})();
