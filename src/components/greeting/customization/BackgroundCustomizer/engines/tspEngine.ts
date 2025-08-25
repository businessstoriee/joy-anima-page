// src/components/background/engines/tspEngine.ts
export async function initTspEngine(container: HTMLElement, settings: any) {
  // loads tsParticles UMD if needed and instantiates into container
  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.body.appendChild(s);
    });

  await loadScript("https://cdn.jsdelivr.net/npm/tsparticles@2.11.0/tsparticles.bundle.min.js").catch(() => {});

  // create wrapper
  const id = `bg-tsp-${Math.random().toString(36).slice(2, 9)}`;
  const el = document.createElement("div");
  el.id = id;
  el.style.position = "absolute";
  el.style.inset = "0";
  container.appendChild(el);

  const opts = settings.animation.options || {};
  const subtype = opts.subtype || "constellation";
  const color = opts.particleColor || "#ffffff";
  const count = Math.max(12, Math.round((opts.particleCount ?? 80) * ((settings.animation.intensity ?? 80) / 100)));
  const speed = Math.max(0.2, (settings.animation.speed ?? 3) / 2);

  const presets: Record<string, any> = {
    constellation: {
      fpsLimit: 60,
      particles: {
        number: { value: count, density: { enable: true, area: 800 } },
        color: { value: color },
        links: { enable: opts.links ?? true, distance: 140, color, opacity: 0.25, width: 1 },
        move: { enable: true, speed, outModes: "out" },
        size: { value: Math.max(1, opts.size ?? 3) }
      },
      detectRetina: true
    },
    nebula: {
      particles: {
        number: { value: Math.max(30, Math.round(count * 0.6)) },
        color: { value: color },
        move: { enable: true, speed: speed * 0.6, outModes: "out", decay: 0.01 },
        size: { value: { min: 1, max: 6 } },
        opacity: { value: { min: 0.2, max: 0.9 } }
      }
    },
    snow: {
      particles: {
        number: { value: Math.max(40, count) },
        color: { value: color },
        move: { enable: true, speed: speed * 0.4, direction: "bottom", outModes: "out" },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 4 } },
        opacity: { value: 0.8 }
      }
    },
    fireworks: {
      particles: {
        number: { value: Math.max(30, Math.round(count * 0.5)) },
        color: { value: color },
        move: { enable: true, speed: speed * 2, outModes: "destroy" },
        shape: { type: ["triangle", "circle", "square"] },
        size: { value: { min: 1, max: 4 } },
        opacity: { value: { min: 0.4, max: 1 } }
      }
    }
  };

  const config = { ...(presets[subtype] || presets.constellation), fullScreen: { enable: false } };

  try {
    const containerObj = await (window as any).tsParticles.load(id, config);
    return {
      type: "tsparticles",
      destroy: async () => {
        try { await containerObj.destroy(); } catch {}
        try { if (el.parentNode) el.parentNode.removeChild(el); } catch {}
      },
      instance: containerObj
    };
  } catch {
    return {
      type: "tsparticles",
      destroy: async () => { try { if (el.parentNode) el.parentNode.removeChild(el); } catch {} }
    };
  }
}
