/* Sploit's PS Store — live XMB-style wave background
   Standalone Canvas 2D renderer; no libraries or external assets required. */
(() => {
  "use strict";
  if (window.__sploitsXmbStarted) return;
  window.__sploitsXmbStarted = true;


  const style = document.createElement("style");
  style.textContent = `
    html, body { min-height: 100%; }
    html { background: #030b1b !important; }
    body { background: transparent !important; position: relative; isolation: isolate; }
    body::before, body::after { display: none !important; }
    #sploits-xmb-canvas {
      position: fixed; inset: 0; width: 100vw; height: 100vh;
      z-index: -1; display: block; pointer-events: none;
    }
    body > *:not(#sploits-xmb-canvas) { position: relative; }
  `;
  document.head.appendChild(style);

  const canvas = document.createElement("canvas");
  canvas.id = "sploits-xmb-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) return;

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0, height = 0, dpr = 1, raf = 0, last = 0, time = 0;
  let particles = [];
  const TAU = Math.PI * 2;

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: Math.max(28, Math.min(75, Math.round(width / 22))) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: .45 + Math.random() * 1.35,
      speed: 4 + Math.random() * 13,
      phase: Math.random() * TAU,
      alpha: .12 + Math.random() * .36
    }));
  }

  function drawBackground() {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#06142d");
    bg.addColorStop(.48, "#07366c");
    bg.addColorStop(1, "#030b22");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const glow1 = ctx.createRadialGradient(width * .22, height * .3, 0, width * .22, height * .3, width * .72);
    glow1.addColorStop(0, "rgba(0,145,255,.23)");
    glow1.addColorStop(1, "rgba(0,80,180,0)");
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(width * .82, height * .76, 0, width * .82, height * .76, width * .55);
    glow2.addColorStop(0, "rgba(63,73,220,.18)");
    glow2.addColorStop(1, "rgba(20,40,130,0)");
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);
  }

  // A ribbon is drawn as a broad curved band with a luminous edge and soft interior.
  function ribbon(cfg, t) {
    const yBase = height * cfg.y;
    const amp = height * cfg.amp;
    const phase = t * cfg.speed + cfg.phase;
    const points = [];
    const steps = 90;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const x = -width * .12 + u * width * 1.24;
      const envelope = Math.sin(Math.PI * u) * .72 + .28;
      const wave =
        Math.sin(u * cfg.freq * TAU + phase) * .58 +
        Math.sin(u * cfg.freq * .48 * TAU - phase * .72 + cfg.phase) * .30 +
        Math.sin(u * cfg.freq * 1.7 * TAU + phase * .42) * .12;
      points.push({ x, y: yBase + wave * amp * envelope });
    }

    const band = cfg.band;
    ctx.beginPath();
    points.forEach((p, i) => {
      const y = p.y - band * .5;
      if (i === 0) ctx.moveTo(p.x, y);
      else ctx.lineTo(p.x, y);
    });
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      ctx.lineTo(p.x, p.y + band * .5);
    }
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, yBase - band, 0, yBase + band);
    grad.addColorStop(0, cfg.top);
    grad.addColorStop(.42, cfg.mid);
    grad.addColorStop(1, cfg.bottom);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = cfg.opacity;
    ctx.fillStyle = grad;
    ctx.shadowColor = cfg.glow;
    ctx.shadowBlur = cfg.blur;
    ctx.fill();
    ctx.restore();

    // Fine silk highlight running along the crest of the ribbon.
    ctx.save();
    ctx.beginPath();
    points.forEach((p, i) => {
      const y = p.y - band * .34;
      if (i === 0) ctx.moveTo(p.x, y);
      else ctx.lineTo(p.x, y);
    });
    ctx.strokeStyle = cfg.edge;
    ctx.lineWidth = cfg.edgeWidth;
    ctx.globalAlpha = cfg.edgeAlpha;
    ctx.shadowColor = cfg.edge;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();
  }

  const ribbons = [
    { y:.34, amp:.19, band:height*.20, freq:1.05, speed:.18, phase:.4, opacity:.24, top:"rgba(82,205,255,.02)", mid:"rgba(20,145,255,.34)", bottom:"rgba(22,80,210,.02)", glow:"#168cff", blur:34, edge:"rgba(117,224,255,.58)", edgeWidth:2.1, edgeAlpha:.42 },
    { y:.53, amp:.15, band:height*.16, freq:1.3, speed:-.14, phase:2.1, opacity:.27, top:"rgba(50,160,255,.01)", mid:"rgba(35,126,255,.30)", bottom:"rgba(30,70,190,.01)", glow:"#287cff", blur:38, edge:"rgba(104,205,255,.55)", edgeWidth:1.8, edgeAlpha:.36 },
    { y:.73, amp:.13, band:height*.13, freq:1.65, speed:.22, phase:4.4, opacity:.18, top:"rgba(85,190,255,.01)", mid:"rgba(57,115,255,.26)", bottom:"rgba(30,55,170,.01)", glow:"#526bff", blur:42, edge:"rgba(132,174,255,.48)", edgeWidth:1.5, edgeAlpha:.3 },
    { y:.15, amp:.10, band:height*.10, freq:1.1, speed:-.11, phase:3.3, opacity:.13, top:"rgba(70,190,255,.01)", mid:"rgba(20,130,255,.23)", bottom:"rgba(20,70,180,.01)", glow:"#28aaff", blur:30, edge:"rgba(110,215,255,.4)", edgeWidth:1.4, edgeAlpha:.25 }
  ];

  function drawParticles(dt) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (const p of particles) {
      p.x -= p.speed * dt;
      p.y += Math.sin(time * .35 + p.phase) * .12;
      if (p.x < -4) { p.x = width + 4; p.y = Math.random() * height; }
      const pulse = .55 + .45 * Math.sin(time * 1.1 + p.phase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, TAU);
      ctx.fillStyle = `rgba(160,220,255,${p.alpha * pulse})`;
      ctx.shadowColor = "rgba(66,180,255,.8)";
      ctx.shadowBlur = 7;
      ctx.fill();
    }
    ctx.restore();
  }

  function frame(now) {
    if (document.hidden) { raf = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, .04) : .016;
    last = now;
    if (!reduceMotion) time += dt;
    drawBackground();
    const scaled = reduceMotion ? 0 : time;
    // Recompute band heights responsively without reallocating the wave geometry.
    ribbons.forEach((r, i) => {
      const cfg = { ...r, band: height * [.20,.16,.13,.10][i] };
      ribbon(cfg, scaled);
    });
    if (!reduceMotion) drawParticles(dt);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (!raf) { last = 0; raf = requestAnimationFrame(frame); }
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  resize();
  start();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
})();
