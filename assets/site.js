/* MahaShivaji Foundation · site behaviours (v6 "Open Files")
   ============ OPTIONAL SETTING ============ */
const MAHASHIVAJI = {
  // WhatsApp number with country code, digits only, e.g. "919800000000". Leave empty to hide the button.
  whatsapp: ""
};
/* ========================================= */

(function () {
  const RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ss = { get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
               set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  /* menu, whatsapp, year */
  const btn = document.querySelector(".menu-btn"), nav = document.querySelector(".nav");
  if (btn && nav) btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  if (MAHASHIVAJI.whatsapp) document.querySelectorAll(".wa").forEach(el => { el.href = "https://wa.me/" + MAHASHIVAJI.whatsapp; el.classList.add("on"); });
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  /* status bar: IST clock, session id, read progress */
  const clock = document.querySelector("[data-clock]");
  function tick() {
    if (!clock) return;
    try { clock.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false }); }
    catch (e) { clock.textContent = new Date().toTimeString().slice(0, 8); }
  }
  tick(); setInterval(tick, 1000);
  let sid = ss.get("ms-sid");
  if (!sid) { sid = Math.random().toString(16).slice(2, 6).toUpperCase(); ss.set("ms-sid", sid); }
  document.querySelectorAll("[data-sess]").forEach(el => el.textContent = sid);
  const read = document.querySelector("[data-read]");
  function onScroll() {
    if (!read) return;
    const h = document.documentElement.scrollHeight - innerHeight;
    read.textContent = (h > 0 ? Math.min(100, Math.round(scrollY / h * 100)) : 100) + "%";
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* text scramble */
  const GLYPHS = "▓▒░#/<>_=+*01XΔ";
  function scramble(el) {
    if (RM || el.dataset.done) return; el.dataset.done = "1";
    const nodes = [];
    const walk = n => n.childNodes.forEach(c => c.nodeType === 3 ? (c.textContent.trim() && nodes.push([c, c.textContent])) : walk(c));
    walk(el);
    const total = nodes.reduce((a, [, t]) => a + t.length, 0);
    const dur = Math.min(1100, 380 + total * 14), t0 = performance.now();
    (function frame(now) {
      const p = Math.min(1, (now - t0) / dur); let seen = 0;
      nodes.forEach(([n, t]) => {
        let out = "";
        for (let i = 0; i < t.length; i++) {
          const ch = t[i], k = (seen + i) / total;
          out += (ch === " " || k < p) ? ch : (k < p + 0.18 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : ch === "\n" ? ch : " ");
        }
        n.textContent = out; seen += t.length;
      });
      if (p < 1) requestAnimationFrame(frame); else nodes.forEach(([n, t]) => n.textContent = t);
    })(t0);
  }

  /* count up */
  function countUp(el) {
    const end = +el.dataset.count; if (RM || !end) return;
    const t0 = performance.now(), d = 1200;
    (function f(now) { const p = Math.min(1, (now - t0) / d); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
  }

  /* reveal on scroll */
  function startObservers() {
    if (!("IntersectionObserver" in window)) { document.querySelectorAll(".rv").forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const t = e.target; io.unobserve(t);
      if (t.classList.contains("rv")) {
        const sib = [...t.parentElement.children].filter(c => c.classList.contains("rv"));
        t.style.transitionDelay = Math.min(sib.indexOf(t), 8) * 60 + "ms";
        t.classList.add("in");
      }
      if (t.hasAttribute("data-scramble")) scramble(t);
      if (t.hasAttribute("data-count")) countUp(t);
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".rv,[data-scramble],[data-count]").forEach(e => io.observe(e));
  }

  /* boot sequence (home page, once per session) */
  const boot = document.getElementById("boot");
  if (boot) {
    if (RM || ss.get("ms-boot")) { boot.remove(); startObservers(); }
    else {
      ss.set("ms-boot", "1");
      document.documentElement.style.overflow = "hidden";
      const pre = boot.querySelector(".boot-text"), lines = pre.dataset.lines.split("|");
      let li = 0, ci = 0, timer, finished = false;
      const tmp = document.createElement("textarea");
      const plain = lines.map(l => { tmp.innerHTML = l; return tmp.value; });
      function finish() {
        if (finished) return; finished = true; clearTimeout(timer);
        pre.textContent = plain.join("\n");
        boot.classList.add("done"); document.documentElement.style.overflow = "";
        setTimeout(() => boot.remove(), 700);
        removeEventListener("keydown", finish); boot.removeEventListener("click", finish);
        startObservers();
      }
      function type() {
        if (li >= plain.length) { timer = setTimeout(finish, 450); return; }
        const line = plain[li];
        ci += li === 0 ? 2 : 3;
        pre.textContent = plain.slice(0, li).join("\n") + (li ? "\n" : "") + line.slice(0, ci);
        if (ci >= line.length) { li++; ci = 0; timer = setTimeout(type, 140); } else timer = setTimeout(type, 12);
      }
      addEventListener("keydown", finish); boot.addEventListener("click", finish);
      timer = setTimeout(type, 250);
    }
  } else startObservers();

  /* ---------------- archive ---------------- */
  const lib = document.querySelector(".lib");
  if (lib) {
    const state = { stage: "all", need: "all", type: "all", q: "" };
    const params = new URLSearchParams(location.hash.slice(1));
    ["stage", "need", "type"].forEach(k => { if (params.get(k)) state[k] = params.get(k); });
    const items = [...lib.querySelectorAll(".item")];
    const order = items.slice();
    const count = document.querySelector(".count"), empty = document.querySelector(".empty-q");
    const q = document.getElementById("q"), sort = document.getElementById("sort");
    const visible = () => items.filter(i => !i.hidden);
    function apply() {
      let n = 0; const s = state.q.trim().toLowerCase();
      items.forEach(it => {
        const ok = (state.stage === "all" || it.dataset.stage.split(" ").includes(state.stage)) &&
                   (state.need === "all" || it.dataset.need === state.need) &&
                   (state.type === "all" || it.dataset.type === state.type) &&
                   (!s || it.textContent.toLowerCase().includes(s));
        it.hidden = !ok; if (ok) n++;
      });
      document.querySelectorAll(".fbtn").forEach(b => b.setAttribute("aria-pressed", state[b.dataset.k] === b.dataset.v ? "true" : "false"));
      if (count) count.textContent = n + (n === 1 ? " file" : " files");
      if (empty) empty.hidden = n > 0;
    }
    function hash() {
      const h = ["stage", "need", "type"].filter(k => state[k] !== "all").map(k => k + "=" + state[k]).join("&");
      history.replaceState(null, "", h ? "#" + h : location.pathname);
    }
    document.querySelectorAll(".fbtn").forEach(b => b.addEventListener("click", () => { state[b.dataset.k] = b.dataset.v; hash(); apply(); }));
    if (q) q.addEventListener("input", () => { state.q = q.value; apply(); });
    if (sort) sort.addEventListener("change", () => {
      const arr = order.slice();
      const name = e => e.querySelector("h3").textContent;
      if (sort.value === "az") arr.sort((a, b) => name(a).localeCompare(name(b)));
      if (sort.value === "za") arr.sort((a, b) => name(b).localeCompare(name(a)));
      arr.forEach(e => lib.appendChild(e)); items.splice(0, items.length, ...arr);
    });

    /* viewer */
    const V = id => document.getElementById(id);
    const viewer = V("viewer"); let cur = null, lastFocus = null;
    function show(it) {
      cur = it;
      V("v-id").textContent = it.querySelector(".type").textContent.split("·")[0].trim() + " · " + (visible().indexOf(it) + 1) + " / " + visible().length;
      V("v-thumb").innerHTML = it.querySelector(".thumb").innerHTML;
      V("v-type").textContent = it.querySelector(".type").textContent;
      V("v-title").textContent = it.querySelector("h3").textContent;
      V("v-desc").textContent = it.querySelector("p").textContent;
      V("v-tags").innerHTML = it.querySelector(".tags").innerHTML;
      V("v-open").href = it.href;
      V("v-src").textContent = "Opens " + it.href.split("/")[2].replace("www.", "") + " in a new tab. The Foundation is independent of this body.";
      if (viewer.hidden) { lastFocus = document.activeElement; viewer.hidden = false; document.documentElement.style.overflow = "hidden"; }
      V("v-open").focus({ preventScroll: true });
    }
    function close() { viewer.hidden = true; document.documentElement.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); }
    function step(d) { const v = visible(); if (!cur || !v.length) return; show(v[(v.indexOf(cur) + d + v.length) % v.length]); }
    lib.addEventListener("click", e => {
      const it = e.target.closest(".item"); if (!it || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault(); show(it);
    });
    viewer.addEventListener("click", e => { if (e.target === viewer) close(); });
    viewer.querySelector(".v-close").addEventListener("click", close);
    V("v-prev").addEventListener("click", () => step(-1));
    V("v-next").addEventListener("click", () => step(1));
    addEventListener("keydown", e => {
      if (viewer.hidden) return;
      if (e.key === "Escape") close(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1);
    });
    function random() {
      const v = visible(); if (!v.length) return;
      const it = v[(Math.random() * v.length) | 0];
      it.classList.add("in"); it.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" });
      it.classList.remove("flash"); void it.offsetWidth; it.classList.add("flash");
      setTimeout(() => show(it), RM ? 0 : 500);
    }
    const rb = V("rand"); if (rb) rb.addEventListener("click", random);
    apply();
    if (location.hash === "#random") { history.replaceState(null, "", location.pathname); setTimeout(random, 400); }
  }
})();

/* Self-resolution builder (stays in this browser only) */
(function () {
  const verbSel = document.getElementById("rv-verb");
  if (!verbSel) return;
  const ACTS = {
    Connect: ["introduce two people who should know each other", "find one mentor in my field and write to them", "reconnect with three people from my village or town"],
    Create: ["write a one-page plan for my idea", "sell my first product or service to a real customer", "register my business on Udyam"],
    Develop: ["complete one course from the Academy", "learn to use one AI tool well in my work", "read one serious book on Maharashtra's history"],
    Contribute: ["give one hour to someone who is starting out", "teach a skill I have to a younger person", "review one page of the Library in my field"],
    Improve: ["document one problem in my area, with evidence", "attend my gram sabha or ward meeting", "file one RTI application on an issue that matters"],
    Progress: ["write down where I stand today, and review it in ninety days", "choose one frontier skill and start learning it", "save a fixed share of my income every month"]
  };
  const $ = id => document.getElementById(id);
  const act = $("rv-act"), custom = $("rv-custom"), when = $("rv-when"), name = $("rv-name");
  const text = $("rv-text"), tag = $("rv-tag"), msg = $("rv-msg"), wa = $("rv-wa"), list = $("rv-list"), empty = $("rv-empty");
  const KEY = "ms-resolutions";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch (e) { return false; } };
  let kept = load();

  function fillActs() {
    act.innerHTML = ACTS[verbSel.value].map(a => `<option>${a}</option>`).join("");
  }
  function current() {
    const what = (custom.value.trim() || act.value).replace(/\.$/, "");
    const who = name.value.trim();
    return (who ? `I, ${who}, resolve to ` : "I resolve to ") + what + " " + when.value + ".";
  }
  function render() {
    tag.textContent = verbSel.value;
    text.textContent = current();
    wa.href = "https://wa.me/?text=" + encodeURIComponent(current() + " (" + verbSel.value + " · MahaShivaji Foundation)");
  }
  function renderList() {
    list.innerHTML = "";
    kept.forEach((r, i) => {
      const li = document.createElement("li");
      if (r.done) li.className = "done";
      li.innerHTML = `<span class="rv-v">${r.verb}</span><span class="rv-t"></span><span class="rv-b"><button type="button" data-i="${i}" data-a="done">${r.done ? "Reopen" : "Done"}</button><button type="button" data-i="${i}" data-a="del">Remove</button></span>`;
      li.querySelector(".rv-t").textContent = r.text;
      list.appendChild(li);
    });
    empty.hidden = kept.length > 0;
  }
  verbSel.addEventListener("change", () => { fillActs(); render(); });
  [act, when, name].forEach(el => el.addEventListener("change", render));
  [custom, name].forEach(el => el.addEventListener("input", render));
  $("rv-keep").addEventListener("click", () => {
    kept.unshift({ verb: verbSel.value, text: current(), done: false });
    msg.textContent = save(kept) ? "Kept. It will be here when you return to this page on this device." : "Kept for this visit. This browser does not allow saving.";
    renderList();
  });
  $("rv-copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(current()); msg.textContent = "Copied."; }
    catch (e) { msg.textContent = "Select the text above to copy it."; }
  });
  list.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const i = +b.dataset.i;
    if (b.dataset.a === "del") kept.splice(i, 1); else kept[i].done = !kept[i].done;
    save(kept); renderList();
  });
  fillActs(); render(); renderList();
})();
