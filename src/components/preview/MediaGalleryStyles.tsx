import React from "react";

export const layoutClassMap = {
  grid: "grid-layout",
  masonry: "masonry-layout",
  carousel: "carousel-layout",
  slideshow: "slideshow-layout",
  polaroid: "polaroid-layout",
  hexagon: "hexagon-layout",
  circular: "circular-layout",
  spiral: "spiral-layout",
  wave: "wave-layout",
  gallery: "gallery-layout",
} as const;

export type LayoutType = keyof typeof layoutClassMap;

const css = `
/* Fonts & base */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap');

:root {
  --bg-grad-1: #f5f7fa;
  --bg-grad-2: #c3cfe2;
  --card-radius: 14px;
  --shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.gallery-container { transition: all 0.28s ease; }
.gallery-title { font-family: 'Playfair Display', serif; font-weight: 700; letter-spacing: -0.5px; }
.gallery-item { transition: all 0.35s ease; overflow: hidden; border-radius: var(--card-radius); background: white; opacity:0; transform: translateY(20px); animation: fadeUp .6s forwards; }
.gallery-item:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 36px rgba(0,0,0,0.14); }
.gallery-item img, .gallery-item video { transition: transform 0.5s ease; }
.gallery-item:hover img, .gallery-item:hover video { transform: scale(1.06); }

/* ---------- Animations ---------- */
@keyframes fadeUp {
  from { opacity:0; transform: translateY(20px); }
  to { opacity:1; transform: translateY(0); }
}
@keyframes fadeInScale {
  from { opacity:0; transform: scale(0.94); }
  to { opacity:1; transform: scale(1); }
}

/* ---------- Grid (Gallery classic) ---------- */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}
.grid-layout .gallery-item img, .grid-layout .gallery-item video { width: 100%; height: 220px; object-fit: cover; }

/* ---------- Masonry ---------- */
.masonry-layout { columns: 3 220px; column-gap: 16px; }
.masonry-layout .gallery-item { display:inline-block; width:100%; margin:0 0 16px; animation: fadeUp .6s forwards; }
.masonry-layout .gallery-item img, .masonry-layout .gallery-item video { width:100%; height:auto; object-fit:cover; }

/* ---------- Carousel ---------- */
.carousel-layout {
  display:flex; gap:16px; padding: 12px 6px;
  overflow-x:auto; scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.carousel-layout::-webkit-scrollbar { display:none; }
.carousel-layout .gallery-item {
  flex: 0 0 70%; max-width: 70%; scroll-snap-align:center;
  border-radius:16px; animation: fadeInScale .7s forwards;
}
.carousel-layout .gallery-item img, .carousel-layout .gallery-item video { width:100%; height:260px; object-fit:cover; }

/* ---------- Slideshow (Enhanced) ---------- */
.slideshow-layout {
  position:relative; width:100%; height:420px; overflow:hidden;
  border-radius:18px; box-shadow: var(--shadow);
}
.slideshow-layout .gallery-item {
  position:absolute; inset:0; width:100%; height:100%;
  opacity:0; transform:scale(1.05); transition:opacity 1s ease, transform 1s ease;
}
.slideshow-layout .gallery-item.active { opacity:1; transform:scale(1); z-index:5; }
.slideshow-layout .gallery-item img,.slideshow-layout .gallery-item video{ width:100%; height:100%; object-fit:cover; }

/* ---------- Gallery (New Enhanced classic grid) ---------- */
.gallery-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.gallery-layout .gallery-item {
  border-radius:16px; box-shadow: var(--shadow); animation: fadeUp .8s forwards;
}
.gallery-layout .gallery-item img, .gallery-layout .gallery-item video { width:100%; height:220px; object-fit:cover; }

/* ---------- Polaroid ---------- */
.polaroid-layout {
  display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:18px;
}
.polaroid-layout .gallery-item {
  background:white; padding:14px 14px 36px 14px;
  transform:rotate(2deg); box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.polaroid-layout .gallery-item:nth-child(2n){ transform:rotate(-3deg); }
.polaroid-layout .gallery-item img,.polaroid-layout .gallery-item video{ width:100%; height:180px; object-fit:cover; }

/* ---------- Hexagon ---------- */
.hexagon-layout { display:flex; flex-wrap:wrap; justify-content:center; gap:18px; padding:28px 0; }
.hexagon-layout .gallery-item { width:200px; height:170px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); overflow:hidden; }
.hexagon-layout .gallery-item img, .hexagon-layout .gallery-item video { width:100%; height:100%; object-fit:cover; }

/* ---------- Circular ---------- */
.circular-layout { display:flex; flex-wrap:wrap; justify-content:center; gap:22px; }
.circular-layout .gallery-item {
  width:150px; height:150px; border-radius:50%;
  overflow:hidden; border:6px solid #fff; box-shadow: var(--shadow);
}
.circular-layout .gallery-item img, .circular-layout .gallery-item video{ width:100%; height:100%; object-fit:cover; }

/* ---------- Spiral ---------- */
.spiral-layout { display:flex; flex-wrap:wrap; justify-content:center; padding:36px 0; gap:16px; }
.spiral-layout .gallery-item { width:160px; height:160px; transform: rotate(5deg); overflow:hidden; }
.spiral-layout .gallery-item:nth-child(2n){ transform: rotate(-6deg); }
.spiral-layout .gallery-item img, .spiral-layout .gallery-item video{ width:100%; height:100%; object-fit:cover; }

/* ---------- Wave ---------- */


/* --- Wave Layout --- */
.wave-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.wave-layout .media-item {
  flex: 0 0 auto;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  animation: waveFloat 4s ease-in-out infinite;
}

/* Wave float animation */
@keyframes waveFloat {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-10px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(10px); }
}

/* staggered delays for wave effect */
.wave-layout .media-item:nth-child(1) { animation-delay: 0s; }
.wave-layout .media-item:nth-child(2) { animation-delay: 0.2s; }
.wave-layout .media-item:nth-child(3) { animation-delay: 0.4s; }
.wave-layout .media-item:nth-child(4) { animation-delay: 0.6s; }
.wave-layout .media-item:nth-child(5) { animation-delay: 0.8s; }
.wave-layout .media-item:nth-child(6) { animation-delay: 1s; }
.wave-layout .media-item:nth-child(7) { animation-delay: 1.2s; }
.wave-layout .media-item:nth-child(8) { animation-delay: 1.4s; }


/* ---------- Lightbox ---------- */
.lightbox-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:1200; padding:20px; }
.lightbox-panel { background:white; border-radius:16px; max-width:1100px; width:100%; max-height:90vh; overflow:hidden; display:flex; flex-direction:column; }
.lightbox-media { width:100%; height:70vh; display:flex; align-items:center; justify-content:center; background:#000; }
.lightbox-media img, .lightbox-media video{ max-width:100%; max-height:100%; object-fit:contain; }

/* ---------- Responsive tweaks ---------- */
@media (max-width: 1024px) {
  .masonry-layout { columns: 2 200px; }
  .carousel-layout .gallery-item { flex-basis: 76%; max-width:76%; }
   .wave-layout .media-item {
    width: 100px;
    height: 100px;
  }
}
@media (max-width: 768px) {
  .grid-layout, .gallery-layout { grid-template-columns: 1fr; gap:12px; }
  .carousel-layout .gallery-item { flex-basis: 80%; max-width:80%; }
  .polaroid-layout .gallery-item img { height: 140px; }
  .hexagon-layout .gallery-item { width:150px; height:130px; }
  .circular-layout .gallery-item { width:120px; height:120px; border-width:4px; }
   .wave-layout {
    justify-content: space-around;
  }
  .wave-layout .media-item {
    width: 80px;
    height: 80px;
  }
}
@media (max-width: 480px) {
  .carousel-layout .gallery-item { flex-basis: 85%; max-width:85%; }
  .grid-layout, .gallery-layout { gap:10px; }
  .slideshow-layout { height: 320px; }
  

  .wave-layout {
    justify-content: center;
    gap: 8px;
  }
  .wave-layout .media-item {
    width: 70px;
    height: 70px;
  }
  }
`;

export const MediaGalleryStyles: React.FC = () => (
  <style dangerouslySetInnerHTML={{ __html: css }} />
);

export default MediaGalleryStyles;