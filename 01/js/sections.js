/* Hitung mundur, video, lightbox galeri, amplop digital, serta RSVP/ucapan (Google Sheet). */
(function () {
  var $ = function (q, c) {
      return (c || document).querySelector(q);
    },
    $$ = function (q, c) {
      return [].slice.call((c || document).querySelectorAll(q));
    };

  if (RUN_DEMO) {
    /* DEMO: tanggal selalu 1 bulan dari tanggal akses.
     Resepsi = akses + 1 bulan (pukul 10.00 WIB, target countdown),
     akad = resepsi - 5 hari, live streaming = akad + 1 hari.
     Blok ini harus jalan SEBELUM target countdown dibaca di bawah. */
    var demoDays = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    var demoMonths = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    var demoShortMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    function demoPad(n) {
      return String(n).padStart(2, "0");
    }
    function demoAddOneMonth(d) {
      var y = d.getFullYear(),
        m = d.getMonth() + 1;
      var lastDay = new Date(y, m + 1, 0).getDate();
      return new Date(y, m, Math.min(d.getDate(), lastDay), 10, 0, 0, 0);
    }
    function demoLongDate(d) {
      return (
        demoDays[d.getDay()] +
        ", " +
        d.getDate() +
        " " +
        demoMonths[d.getMonth()] +
        " " +
        d.getFullYear()
      );
    }
    var yearStoryBegan = new Date().getFullYear() - 3;
    var demoResepsi = demoAddOneMonth(new Date());
    var demoAkad = new Date(demoResepsi);
    demoAkad.setDate(demoAkad.getDate() - 5);
    var demoLive = new Date(demoResepsi);
    var demoCd = $("#cd");
    if (demoCd)
      demoCd.dataset.target =
        demoResepsi.getFullYear() +
        "-" +
        demoPad(demoResepsi.getMonth() + 1) +
        "-" +
        demoPad(demoResepsi.getDate()) +
        "T10:00:00+07:00";
    var demoHeroDate = $(".h-date");
    if (demoHeroDate) demoHeroDate.textContent = demoLongDate(demoResepsi);
    var demoCards = $$("#date .card");
    function demoSetCard(card, d) {
      if (!card) return;
      var day = $(".day", card),
        num = $(".num", card),
        mon = $(".mon", card);
      if (day) day.textContent = demoDays[d.getDay()];
      if (num) {
        num.textContent = d.getDate();
        num.dataset.count = d.getDate();
      }
      if (mon)
        mon.textContent = demoMonths[d.getMonth()] + " " + d.getFullYear();
    }
    demoSetCard(demoCards[0], demoAkad);
    demoSetCard(demoCards[1], demoResepsi);
    var demoLiveDescs = $$("#date .card.live .desc");
    if (demoLiveDescs[1]) demoLiveDescs[1].textContent = demoLongDate(demoLive);
    var demoChip = $('#tl2 article[data-i="2"] .chip');
    if (demoChip)
      demoChip.textContent =
        demoPad(demoResepsi.getDate()) +
        " " +
        demoShortMonths[demoResepsi.getMonth()] +
        " " +
        demoResepsi.getFullYear();
    /* Lamaran dinamis: 6 bulan sebelum resepsi, tanggal yang sama
       (mengikuti pola Ayu-Ezi: lamaran 6 Jun 2026, resepsi 6 Des 2026). */
    var demoLamaran = new Date(demoResepsi);
    demoLamaran.setMonth(demoLamaran.getMonth() - 6);
    if (demoLamaran.getDate() !== demoResepsi.getDate())
      demoLamaran.setDate(0); /* jepit ke akhir bulan target bila meluber */
    var demoLamaranChip = $('#tl2 article[data-i="1"] .chip');
    if (demoLamaranChip)
      demoLamaranChip.textContent =
        demoPad(demoLamaran.getDate()) +
        " " +
        demoShortMonths[demoLamaran.getMonth()] +
        " " +
        demoLamaran.getFullYear();
    var ysb = $(".year-story-began");
    if (ysb) ysb.textContent = yearStoryBegan;
  }

  var cd = $("#cd"),
    target = new Date(cd.dataset.target).getTime();
  function tick() {
    var d = Math.max(0, target - Date.now()),
      p = function (n) {
        return String(n).padStart(2, "0");
      };

    if (d === 0) {
      cd.remove();
      $("#std h2").textContent = "Sakinah Mawaddah Warahmah";
    } else {
      $("[data-p=d]", cd).textContent = Math.floor(d / 864e5);
      $("[data-p=h]", cd).textContent = p(Math.floor((d % 864e5) / 36e5));
      $("[data-p=m]", cd).textContent = p(Math.floor((d % 36e5) / 6e4));
      $("[data-p=s]", cd).textContent = p(Math.floor((d % 6e4) / 1e3));
    }
  }
  tick();
  setInterval(tick, 1000);

  /* ===== SAVE THE DATE =====
     Tombol "Simpan ke Kalender" mengunduh file .ics Resepsi
     (10.00-12.00 WIB, tanggal dinamis demo = akses + 1 bulan)
     yang bisa dibuka Google Calendar, Apple Calendar, dan
     Outlook. Waktu diambil dari target countdown yang sama
     (#cd data-target, sudah digeser blok demo di atas). */
  var saveBtn = $("#btn-save-cal");
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      var start = new Date(target),
        end = new Date(target + 2 * 36e5),
        fmt = function (d) {
          return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        },
        ics = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Nadia & Rizki//Save The Date//ID",
          "BEGIN:VEVENT",
          "UID:resepsi-nadia-rizki@alyads.github.io",
          "DTSTAMP:" + fmt(new Date()),
          "DTSTART:" + fmt(start),
          "DTEND:" + fmt(end),
          "SUMMARY:Resepsi Pernikahan Nadia & Rizki",
          "LOCATION:Kediaman Mempelai Wanita\, Jl. Mawar No. 18\, Bandung\, Jawa Barat",
          "DESCRIPTION:Info lengkap: https://alyads.github.io/01/",
          "BEGIN:VALARM",
          "TRIGGER:-P1D",
          "ACTION:DISPLAY",
          "DESCRIPTION:Resepsi Pernikahan Nadia & Rizki besok",
          "END:VALARM",
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\r\n"),
        blob = new Blob([ics], { type: "text/calendar" }),
        a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "Resepsi-Nadia-Rizki.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 1000);
    });
  }
  var gcalBtn = $("#btn-gcal");
  if (gcalBtn) {
    var gStart = new Date(target),
      gEnd = new Date(target + 2 * 36e5),
      gFmt = function (d) {
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      };
    gcalBtn.href =
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
      encodeURIComponent("Resepsi Pernikahan Nadia & Rizki") +
      "&dates=" +
      gFmt(gStart) +
      "/" +
      gFmt(gEnd) +
      "&details=" +
      encodeURIComponent(
        "Resepsi pernikahan Nadia Putri Lestari dan Rizki Aditya Pratama. Info lengkap: https://alyads.github.io/01/",
      ) +
      "&location=" +
      encodeURIComponent(
        "Kediaman Mempelai Wanita, Jl. Mawar No. 18, Bandung, Jawa Barat",
      );
  }

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
    { threshold: 0.6 },
  );
  $$("[data-count]").forEach(function (el) {
    co.observe(el);
  });

  var stdLoaded = false;
  window.addEventListener("invitation-open", function () {
    if (stdLoaded) return;
    stdLoaded = true;
    $("#stdVid video").play();
  });

  // video galeri lokal: klik untuk memuat
  var yt = $("#yt");
  if (yt) {
    yt.addEventListener("click", function () {
      if (!$("video", yt).classList.contains("show")) {
        $("video", yt).style.display = "block";
        $("video", yt).play();
        $("video", yt).classList.add("show");
        $(".play", yt).style.display = "none";
        if (window.__pauseMusic) window.__pauseMusic();
      }
    });
  }

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
  var KEY = "undangan-demo-ucapan",
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
  if (g) ((rName.value = g), check());
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
