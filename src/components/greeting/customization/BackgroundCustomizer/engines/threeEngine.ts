// src/components/background/engines/threeEngine.ts
export async function initThreeEngine(container: HTMLElement, settings: any) {
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

  if (!window.THREE) {
    await loadScript("https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js").catch(() => {});
  }

  // wrapper element
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.inset = "0";
  container.appendChild(wrapper);

  // create renderer (antialias false to reduce contexts)
  const renderer = new (window as any).THREE.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  wrapper.appendChild(renderer.domElement);

  const scene = new (window as any).THREE.Scene();
  const camera = new (window as any).THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 4;

  const opts = settings.animation.options || {};
  // Force galaxy (no dropdown)
  const color = opts.color || 0xffffff;
  const count = Math.max(800, (opts.count ?? 1200) * ((settings.animation.intensity ?? 80) / 100));

  const geom = new (window as any).THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.7) * 4;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r + (Math.random() - 0.5) * 0.2 * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3 * r;
    pos[i * 3 + 2] = Math.sin(a) * r + (Math.random() - 0.5) * 0.2 * r;
  }
  geom.setAttribute("position", new (window as any).THREE.BufferAttribute(pos, 3));
  const mat = new (window as any).THREE.PointsMaterial({ size: 0.02, color: color, transparent: true, opacity: 0.9 });
  const points = new (window as any).THREE.Points(geom, mat);
  scene.add(points);

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  let rafId = 0;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    points.rotation.z += 0.0004 * (settings.animation.speed ?? 1);
    renderer.render(scene, camera);
  };
  animate();

  return {
    type: "threejs",
    destroy: async () => {
      try { cancelAnimationFrame(rafId); } catch {}
      try { ro.disconnect(); } catch {}
      try { if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); } catch {}
      try { geom.dispose && geom.dispose(); } catch {}
      try { mat.dispose && mat.dispose(); } catch {}
      try { renderer.dispose && renderer.dispose(); } catch {}
      // try force GL context loss
      try {
        // @ts-ignore
        const gl = renderer.getContext && renderer.getContext();
        if (gl) {
          const ext = gl.getExtension("WEBGL_lose_context") || gl.getExtension("WEBKIT_WEBGL_lose_context");
          if (ext && typeof ext.loseContext === "function") ext.loseContext();
        }
      } catch {}
      try { if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper); } catch {}
    }
  };
}
