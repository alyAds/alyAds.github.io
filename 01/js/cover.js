/* Cover, animasi reveal, tombol "Buka Undangan", dan musik latar. */
(function () {
  // tinggi viewport stabil di mobile
  function setVh() {
    document.documentElement.style.setProperty(
      "--vh",
      window.innerHeight * 0.01 + "px"
    );
  }
  setVh();
  addEventListener("resize", setVh);

  var to = new URLSearchParams(location.search).get("to");
  if (to) document.getElementById("guest").textContent = to;

  var opened = false;
  var rvCover = [].slice.call(document.querySelectorAll("#sec .rv"));
  var rvPage = [].slice.call(document.querySelectorAll(".page .rv"));
  var birds = document.getElementById("birds");

  // fade-up cover
  addEventListener("load", function () {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        rvCover.forEach(function (el) {
          el.classList.add("active");
        });
      });
    });
  });

  // reveal elemen
  var io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          function (es) {
            es.forEach(function (e) {
              if (e.isIntersecting && opened) {
                e.target.classList.add("active");
                io.unobserve(e.target);
              }
            });
          },
          { rootMargin: "0px 0px -100px 0px" }
        )
      : null;

  function revealPage() {
    // reset dulu agar animasi terlihat tepat setelah cover bergeser
    rvPage.forEach(function (el) {
      el.classList.remove("active");
    });
    void document.body.offsetWidth;
    rvPage.forEach(function (el) {
      io ? io.observe(el) : el.classList.add("active");
    });
    if (io) {
      // trigger ulang untuk elemen yang sudah terlihat
      rvPage.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight - 100 && r.bottom > 0) {
          el.classList.add("active");
          io.unobserve(el);
        }
      });
    }
    birds.classList.add("active");
  }

  var audio = document.getElementById("song"),
    mbtn = document.getElementById("music");
  function setPlaying(p) {
    mbtn.classList.toggle("playing", p);
  }
  mbtn.addEventListener("click", function () {
    if (audio.paused)
      audio
        .play()
        .then(function () {
          setPlaying(true);
        })
        .catch(function () {});
    else {
      audio.pause();
      setPlaying(false);
    }
  });
  window.__pauseMusic = function () {
    audio.pause();
  };
  audio.addEventListener("pause", function () {
    setPlaying(false);
  });
  audio.addEventListener("play", function () {
    setPlaying(true);
  });
  var wasPlaying = false;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      wasPlaying = !audio.paused;
      audio.pause();
    } else if (wasPlaying) {
      audio.play().catch(function () {});
    }
  });

  function openInvitation() {
    if (opened) return;
    opened = true;
    var sec = document.getElementById("sec"),
      kolom = document.getElementById("kolom");
    kolom.classList.add("slide");
    sec.classList.add("closing");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    revealPage();
    mbtn.classList.add("show");
    window.dispatchEvent(new Event("invitation-open"));
    audio
      .play()
      .then(function () {
        setPlaying(true);
      })
      .catch(function () {});
    setTimeout(function () {
      sec.style.visibility = "hidden";
      sec.style.display = "none";
    }, 1500);
  }
  var btn = document.getElementById("open");
  btn.addEventListener("click", openInvitation, { once: true });
  btn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openInvitation();
    }
  });
})();
