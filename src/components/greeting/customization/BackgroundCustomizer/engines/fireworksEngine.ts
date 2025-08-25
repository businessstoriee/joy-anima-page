// src/components/background/engines/fireworksEngine.ts
export async function initFireworksEngine(container: HTMLElement, settings: any) {
  // simple canvas fireworks engine using RAF and ResizeObserver
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.inset = "0";
  container.appendChild(el);

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  el.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { type: "fireworks-js", destroy: async () => { try { if (el.parentNode) el.parentNode.removeChild(el); } catch {} } };
  }

  const opts = settings.animation.options || {};
  const palette = (opts.palette || "#FF5C5C,#FFD166,#06D6A0,#4D96FF").split(",").map((s: string) => s.trim());
  const burstCount = Math.max(8, opts.burstCount ?? 40);
  const spawnInterval = Math.max(250, (opts.spawnInterval ?? (1200 / Math.max(1, settings.animation.speed ?? 3))));
  const particles: any[] = [];
  let last = performance.now();

  const ro = new ResizeObserver(() => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  });
  ro.observe(container);

  function spawnBurst() {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height * 0.45;
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 50 + Math.random() * 80,
        age: 0,
        color: palette[Math.floor(Math.random() * palette.length)],
        r: 0.8 + Math.random() * 3
      });
    }
  }

  let rafId = 0;
  const loop = (now: number) => {
    rafId = requestAnimationFrame(loop);
    if (now - last > spawnInterval) {
      spawnBurst();
      last = now;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 0.04;
      p.vx *= 0.995;
      p.vy *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.age += 1;
      const alpha = Math.max(0, 1 - p.age / p.life);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (p.age >= p.life || p.y > canvas.height + 50) particles.splice(i, 1);
    }
  };
  rafId = requestAnimationFrame(loop);

  return {
    type: "fireworks-js",
    destroy: async () => {
      try { ro.disconnect(); } catch {}
      try { cancelAnimationFrame(rafId); } catch {}
      try { if (el.parentNode) el.parentNode.removeChild(el); } catch {}
    }
  };
}
