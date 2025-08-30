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
  // New Creative Layouts
  floating: "floating-layout",
  orbiting: "orbiting-layout",
  cascading: "cascading-layout",
  vortex: "vortex-layout",
  constellation: "constellation-layout",
  magnetic: "magnetic-layout", 
  ripple: "ripple-layout",
  kaleidoscope: "kaleidoscope-layout",
  drifting: "drifting-layout",
  pulsing: "pulsing-layout"
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



/* --------------------------- Grid (Gallery classic) --------------------- */

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.grid-layout .gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #f9f9f9;
  transform: translateY(30px) scale(0.95);
  opacity: 0;
  animation: gridItemEnter 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, opacity;
}

/* Staggered entrance animation */
.grid-layout .gallery-item:nth-child(1) { animation-delay: 0.05s; }
.grid-layout .gallery-item:nth-child(2) { animation-delay: 0.1s; }
.grid-layout .gallery-item:nth-child(3) { animation-delay: 0.15s; }
.grid-layout .gallery-item:nth-child(4) { animation-delay: 0.2s; }
.grid-layout .gallery-item:nth-child(5) { animation-delay: 0.25s; }
/* (you can extend as needed or calculate in JS if dynamic) */

/* Hover effects */
.grid-layout .gallery-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(0, 0, 0, 0.08);
}

.grid-layout .gallery-item:active {
  transform: translateY(-4px) scale(0.99);
}

/* Media styling */
.grid-layout .gallery-item img,
.grid-layout .gallery-item video {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Subtle zoom on hover */
.grid-layout .gallery-item:hover img,
.grid-layout .gallery-item:hover video {
  transform: scale(1.05);
}

/* Overlay shimmer effect */
.grid-layout .gallery-item::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.grid-layout .gallery-item:hover::before {
  opacity: 1;
}

/* Keyframes */
@keyframes gridItemEnter {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95) rotate(1deg);
  }
  60% {
    opacity: 0.7;
    transform: translateY(-8px) scale(1.02) rotate(-1deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .grid-layout .gallery-item,
  .grid-layout .gallery-item img,
  .grid-layout .gallery-item video {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}



/* ---------- Enhanced Carousel Layout ---------- */
.carousel-layout {
  display: flex;
  gap: 24px;
  padding: 24px 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  cursor: grab;
  position: relative;
  min-height: 320px;
}

.carousel-layout::-webkit-scrollbar {
  display: none;
}

.carousel-layout:active {
  cursor: grabbing;
}

.carousel-layout .gallery-item {
  flex: 0 0 calc(80% - 12px);
  max-width: calc(80% - 12px);
  scroll-snap-align: center;
  border-radius: 20px;
  animation: carouselItemEnter 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  transform-origin: center center;
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
  will-change: transform, opacity;
}

.carousel-layout .gallery-item.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  z-index: 5;
}

.carousel-layout .gallery-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.2),
    0 8px 20px rgba(0, 0, 0, 0.1);
}

.carousel-layout .gallery-item:active {
  transform: translateY(-4px) scale(1.01);
}

.carousel-layout .gallery-item img,
.carousel-layout .gallery-item video {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center center;
}

.carousel-layout .gallery-item:hover img,
.carousel-layout .gallery-item:hover video {
  transform: scale(1.05);
}

/* Media overlay effect */
.carousel-layout .gallery-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
  pointer-events: none;
}

.carousel-layout .gallery-item:hover::before {
  opacity: 1;
}

/* Navigation arrows */
.carousel-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 10;
  pointer-events: none;
}

.carousel-arrow {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.carousel-layout:hover .carousel-arrow {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.carousel-arrow:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(0) scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.carousel-arrow:active {
  transform: translateY(0) scale(0.95);
}

.carousel-arrow svg {
  width: 20px;
  height: 20px;
  color: #333;
  transition: transform 0.2s ease;
}

.carousel-arrow:hover svg {
  transform: scale(1.2);
}

/* Progress indicators */
.carousel-progress {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel-layout:hover .carousel-progress {
  opacity: 1;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-dot:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: scale(1.3);
}

.carousel-dot.active {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  transform: scale(1.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Animation keyframes */
@keyframes carouselItemEnter {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95) rotate(2deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-5px) scale(1.02) rotate(-1deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0);
  }
}

@keyframes carouselItemExit {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .carousel-layout {
    gap: 16px;
    padding: 20px 8px;
    min-height: 280px;
  }
  
  .carousel-layout .gallery-item {
    flex: 0 0 calc(85% - 8px);
    max-width: calc(85% - 8px);
  }
  
  .carousel-layout .gallery-item img,
  .carousel-layout .gallery-item video {
    height: 240px;
  }
  
  .carousel-arrow {
    width: 40px;
    height: 40px;
    opacity: 0.8;
  }
  
  .carousel-arrow svg {
    width: 18px;
    height: 18px;
  }
  
  .carousel-progress {
    bottom: 12px;
    padding: 6px 10px;
  }
  
  .carousel-dot {
    width: 6px;
    height: 6px;
  }
}

/* Tablet responsiveness */
@media (min-width: 769px) and (max-width: 1024px) {
  .carousel-layout .gallery-item {
    flex: 0 0 calc(60% - 12px);
    max-width: calc(60% - 12px);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .carousel-layout {
    scroll-behavior: auto;
  }
  
  .carousel-layout .gallery-item,
  .carousel-layout .gallery-item img,
  .carousel-layout .gallery-item video,
  .carousel-arrow,
  .carousel-dot {
    transition: none;
    animation: none;
  }
  
  .carousel-layout .gallery-item:hover,
  .carousel-layout .gallery-item:hover img,
  .carousel-layout .gallery-item:hover video {
    transform: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .carousel-arrow {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .carousel-arrow svg {
    color: white;
  }
  
  .carousel-progress {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .carousel-dot {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .carousel-dot:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
  .carousel-dot.active {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  }
}

/* Enhanced focus states for accessibility */
.carousel-arrow:focus-visible,
.carousel-dot:focus-visible {
  outline: 2px solid #4ecdc4;
  outline-offset: 2px;
}

/* Smooth scrolling enhancement */
.carousel-layout {
  scroll-padding: 0 24px;
}

/* Performance optimization */
.carousel-layout .gallery-item {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}


/* ---------- Enhanced Slideshow ---------- */
.slideshow-layout {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  isolation: isolate;
}

.slideshow-layout .gallery-item {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scale(1.1) translateX(0);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1;
  will-change: transform, opacity;
  filter: brightness(0.95);
}

/* Different entrance animations for variety */
.slideshow-layout .gallery-item.next {
  transform: scale(1.05) translateX(100px);
  opacity: 0;
}

.slideshow-layout .gallery-item.prev {
  transform: scale(1.05) translateX(-100px);
  opacity: 0;
}

.slideshow-layout .gallery-item.zoom-in {
  transform: scale(1.2);
  opacity: 0;
}

.slideshow-layout .gallery-item.active {
  opacity: 1;
  transform: scale(1) translateX(0);
  z-index: 10;
  filter: brightness(1);
  transition-delay: 0.2s;
}

/* Smooth media handling */
.slideshow-layout .gallery-item img,
.slideshow-layout .gallery-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Subtle zoom effect on active media */
.slideshow-layout .gallery-item.active img,
.slideshow-layout .gallery-item.active video {
  transform: scale(1.03);
}

/* Navigation controls */
.slideshow-nav {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 50px;
}

.slideshow-nav-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.slideshow-nav-btn:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.2);
}

.slideshow-nav-btn.active {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.3);
}

/* Arrow navigation */
.slideshow-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  z-index: 15;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  pointer-events: none;
}

.slideshow-arrow {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  pointer-events: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(20px);
}

.slideshow-layout:hover .slideshow-arrow {
  opacity: 1;
  transform: translateY(0);
}

.slideshow-arrow:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(0) scale(1.1);
}

.slideshow-arrow svg {
  width: 24px;
  height: 24px;
  color: #333;
}

/* Progress bar */
.slideshow-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 20;
  overflow: hidden;
}

.slideshow-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  width: 0%;
  transition: width 0.1s linear;
}

/* Caption overlay */
.slideshow-caption {
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  padding: 20px;
  z-index: 15;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.slideshow-layout:hover .slideshow-caption {
  opacity: 1;
  transform: translateY(0);
}

.slideshow-caption h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.slideshow-caption p {
  font-size: 1rem;
  opacity: 0.9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Mobile optimization */
@media (max-width: 768px) {
  .slideshow-layout {
    height: 400px;
    border-radius: 16px;
  }
  
  .slideshow-nav {
    bottom: 16px;
    padding: 10px;
  }
  
  .slideshow-nav-btn {
    width: 10px;
    height: 10px;
  }
  
  .slideshow-arrow {
    width: 44px;
    height: 44px;
    opacity: 0.8;
  }
  
  .slideshow-caption {
    bottom: 80px;
    padding: 16px;
  }
  
  .slideshow-caption h3 {
    font-size: 1.25rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .slideshow-nav {
    background: rgba(0, 0, 0, 0.7);
  }
  
  .slideshow-arrow {
    background: rgba(0, 0, 0, 0.7);
  }
  
  .slideshow-arrow svg {
    color: white;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .slideshow-layout .gallery-item,
  .slideshow-layout .gallery-item img,
  .slideshow-layout .gallery-item video,
  .slideshow-arrow,
  .slideshow-caption {
    transition: none;
  }
  
  .slideshow-layout .gallery-item.active img,
  .slideshow-layout .gallery-item.active video {
    transform: scale(1);
  }
}



/* ========== ENHANCED MASONRY LAYOUT ========== */
.masonry-layout {
  columns: 3 280px;
  column-gap: 24px;
  padding: 20px;
  perspective: 1000px;
}

.masonry-layout .gallery-item {
  display: inline-block;
  width: 100%;
  margin: 0 0 24px;
  animation: masonryItemEnter 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
  will-change: transform, opacity;
}

.masonry-layout .gallery-item:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.2),
    0 8px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.masonry-layout .gallery-item img,
.masonry-layout .gallery-item video {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center center;
}

.masonry-layout .gallery-item:hover img,
.masonry-layout .gallery-item:hover video {
  transform: scale(1.08);
}

/* Masonry animation delays for staggered effect */
.masonry-layout .gallery-item:nth-child(1) { animation-delay: 0.1s; }
.masonry-layout .gallery-item:nth-child(2) { animation-delay: 0.2s; }
.masonry-layout .gallery-item:nth-child(3) { animation-delay: 0.3s; }
.masonry-layout .gallery-item:nth-child(4) { animation-delay: 0.4s; }
.masonry-layout .gallery-item:nth-child(5) { animation-delay: 0.5s; }
.masonry-layout .gallery-item:nth-child(6) { animation-delay: 0.6s; }

/* ========== ENHANCED GALLERY LAYOUT ========== */
.gallery-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
  perspective: 1000px;
}

.gallery-layout .gallery-item {
  border-radius: 20px;
  animation: gridItemEnter 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
  transform: translateY(30px) rotate(2deg);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 4px 15px rgba(0, 0, 0, 0.06);
  will-change: transform, opacity;
}

.gallery-layout .gallery-item:hover {
  transform: translateY(-8px) rotate(0deg) scale(1.03);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 5;
}

.gallery-layout .gallery-item img,
.gallery-layout .gallery-item video {
  width: 100%;
  height: 260px;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gallery-layout .gallery-item:hover img,
.gallery-layout .gallery-item:hover video {
  transform: scale(1.1);
}

/* Grid animation delays */
.gallery-layout .gallery-item:nth-child(odd) {
  animation-delay: 0.1s;
}

.gallery-layout .gallery-item:nth-child(even) {
  animation-delay: 0.3s;
}

/* ========== ENHANCED POLAROID LAYOUT ========== */
.polaroid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 28px;
  padding: 30px;
  perspective: 1000px;
}

.polaroid-layout .gallery-item {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 18px 18px 42px 18px;
  transform: rotate(1deg);
  animation: polaroidItemEnter 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 5px 20px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 4px;
  position: relative;
  will-change: transform, opacity;
}

.polaroid-layout .gallery-item::before {
  content: '';
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(0, 0, 0, 0.1) 20%, 
    rgba(0, 0, 0, 0.1) 80%, 
    transparent 100%
  );
}

.polaroid-layout .gallery-item:nth-child(2n) {
  transform: rotate(-2deg);
  animation-delay: 0.2s;
}

.polaroid-layout .gallery-item:nth-child(3n) {
  transform: rotate(3deg);
  animation-delay: 0.4s;
}

.polaroid-layout .gallery-item:nth-child(4n) {
  transform: rotate(-1deg);
  animation-delay: 0.6s;
}

.polaroid-layout .gallery-item:hover {
  transform: rotate(0deg) translateY(-12px) scale(1.05);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.2),
    0 15px 35px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.polaroid-layout .gallery-item img,
.polaroid-layout .gallery-item video {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: sepia(0.1) brightness(0.98);
}

.polaroid-layout .gallery-item:hover img,
.polaroid-layout .gallery-item:hover video {
  transform: scale(1.05);
  filter: sepia(0) brightness(1.05);
}

/* ========== ANIMATION KEYFRAMES ========== */
@keyframes masonryItemEnter {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95) rotate(1deg);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02) rotate(-0.5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0);
  }
}

@keyframes gridItemEnter {
  0% {
    opacity: 0;
    transform: translateY(30px) rotate(3deg) scale(0.9);
  }
  60% {
    opacity: 0.9;
    transform: translateY(-3px) rotate(-1deg) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0) scale(1);
  }
}

@keyframes polaroidItemEnter {
  0% {
    opacity: 0;
    transform: translateY(50px) rotate(10deg) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-8px) rotate(-2deg) scale(1.03);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(var(--rotation, 2deg)) scale(1);
  }
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 768px) {
  .masonry-layout {
    columns: 2 180px;
    column-gap: 16px;
    padding: 16px;
  }
  
  .masonry-layout .gallery-item {
    margin: 0 0 16px;
  }
  
  .gallery-layout {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
  }
  
  .gallery-layout .gallery-item img,
  .gallery-layout .gallery-item video {
    height: 200px;
  }
  
  .polaroid-layout {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  
  .polaroid-layout .gallery-item {
    padding: 14px 14px 36px 14px;
  }
  
  .polaroid-layout .gallery-item img,
  .polaroid-layout .gallery-item video {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .masonry-layout {
    columns: 1 300px;
  }
  
  .gallery-layout {
    grid-template-columns: 1fr;
  }
  
  .polaroid-layout {
    grid-template-columns: 1fr;
  }
}

/* ========== REDUCED MOTION SUPPORT ========== */
@media (prefers-reduced-motion: reduce) {
  .masonry-layout .gallery-item,
  .gallery-layout .gallery-item,
  .polaroid-layout .gallery-item,
  .masonry-layout .gallery-item img,
  .masonry-layout .gallery-item video,
  .gallery-layout .gallery-item img,
  .gallery-layout .gallery-item video,
  .polaroid-layout .gallery-item img,
  .polaroid-layout .gallery-item video {
    animation: none;
    transition: none;
  }
  
  .masonry-layout .gallery-item,
  .gallery-layout .gallery-item,
  .polaroid-layout .gallery-item {
    opacity: 1;
    transform: none;
  }
  
  .masonry-layout .gallery-item:hover,
  .gallery-layout .gallery-item:hover,
  .polaroid-layout .gallery-item:hover {
    transform: none;
  }
}

/* ========== DARK MODE SUPPORT ========== */
@media (prefers-color-scheme: dark) {
  .polaroid-layout .gallery-item {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.3),
      0 5px 20px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .polaroid-layout .gallery-item:hover {
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 15px 35px rgba(0, 0, 0, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  }
  
  .polaroid-layout .gallery-item::before {
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.1) 20%, 
      rgba(255, 255, 255, 0.1) 80%, 
      transparent 100%
    );
  }
}

/* ========== PERFORMANCE OPTIMIZATION ========== */
.masonry-layout .gallery-item,
.gallery-layout .gallery-item,
.polaroid-layout .gallery-item {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* ========== SMOOTH SCROLLING ========== */
.masonry-layout,
.gallery-layout,
.polaroid-layout {
  scroll-behavior: smooth;
}



/* ---------- Hexagon ---------- */
.hexagon-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  padding: 28px 0;
}

.hexagon-layout .gallery-item {
  width: 200px;
  height: 170px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  overflow: hidden;
  position: relative;
  transform: scale(0.8) translateY(30px);
  opacity: 0;
  animation: hexagonEnter 0.8s ease forwards;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.hexagon-layout .gallery-item:hover {
  transform: scale(1.05) translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
}

.hexagon-layout .gallery-item img,
.hexagon-layout .gallery-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hexagon-layout .gallery-item:hover img,
.hexagon-layout .gallery-item:hover video {
  transform: scale(1.1);
}

@keyframes hexagonEnter {
  0% { opacity: 0; transform: scale(0.8) translateY(30px) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) translateY(0) rotate(0); }
}

/* ---------- Circular ---------- */
.circular-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 22px;
}

.circular-layout .gallery-item {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid #fff;
  box-shadow: var(--shadow, 0 8px 20px rgba(0,0,0,0.08));
  opacity: 0;
  transform: scale(0.7);
  animation: circleEnter 0.8s ease forwards;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.circular-layout .gallery-item:hover {
  transform: scale(1.1) translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.2);
}

.circular-layout .gallery-item img,
.circular-layout .gallery-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.circular-layout .gallery-item:hover img,
.circular-layout .gallery-item:hover video {
  transform: scale(1.15);
}

@keyframes circleEnter {
  0% { opacity: 0; transform: scale(0.7) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* ---------- Spiral ---------- */
.spiral-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 36px 0;
  gap: 16px;
}

.spiral-layout .gallery-item {
  width: 160px;
  height: 160px;
  transform: rotate(5deg) scale(0.8);
  overflow: hidden;
  opacity: 0;
  animation: spiralEnter 0.9s ease forwards;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 8px 18px rgba(0,0,0,0.08);
}

.spiral-layout .gallery-item:nth-child(2n) {
  transform: rotate(-6deg) scale(0.8);
}

.spiral-layout .gallery-item:hover {
  transform: rotate(0) scale(1.05) translateY(-6px);
  box-shadow: 0 18px 36px rgba(0,0,0,0.15);
}

.spiral-layout .gallery-item img,
.spiral-layout .gallery-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.spiral-layout .gallery-item:hover img,
.spiral-layout .gallery-item:hover video {
  transform: scale(1.12);
}

@keyframes spiralEnter {
  0% { opacity: 0; transform: rotate(8deg) scale(0.6) translateY(20px); }
  100% { opacity: 1; transform: rotate(0) scale(1) translateY(0); }
}

/* ---------- Wave ---------- */
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
  transform: translateY(20px);
  opacity: 0;
  animation: waveFloat 4s ease-in-out infinite, waveEnter 0.8s ease forwards;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
}

.wave-layout .media-item:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 14px 28px rgba(0,0,0,0.15);
}

.wave-layout .media-item img,
.wave-layout .media-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.wave-layout .media-item:hover img,
.wave-layout .media-item:hover video {
  transform: scale(1.08);
}

/* Wave float animation */
@keyframes waveFloat {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-10px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(10px); }
}

@keyframes waveEnter {
  0% { opacity: 0; transform: translateY(30px) scale(0.8); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* Staggered delays for wave effect */
.wave-layout .media-item:nth-child(1) { animation-delay: 0s, 0s; }
.wave-layout .media-item:nth-child(2) { animation-delay: 0.1s, 0.2s; }
.wave-layout .media-item:nth-child(3) { animation-delay: 0.2s, 0.4s; }
.wave-layout .media-item:nth-child(4) { animation-delay: 0.3s, 0.6s; }
.wave-layout .media-item:nth-child(5) { animation-delay: 0.4s, 0.8s; }
.wave-layout .media-item:nth-child(6) { animation-delay: 0.5s, 1s; }
.wave-layout .media-item:nth-child(7) { animation-delay: 0.6s, 1.2s; }
.wave-layout .media-item:nth-child(8) { animation-delay: 0.7s, 1.4s; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hexagon-layout .gallery-item,
  .circular-layout .gallery-item,
  .spiral-layout .gallery-item,
  .wave-layout .media-item {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}



/* ----------------------------- Lightbox -------------------------- */

.lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 20px;
  opacity: 0;
  animation: fadeIn 0.35s ease forwards;
}

.lightbox-panel {
  background: linear-gradient(145deg, #ffffff, #f7f7f7);
  border-radius: 20px;
  max-width: 1100px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform: scale(0.85) translateY(40px);
  opacity: 0;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  animation: slideUp 0.4s ease forwards;
}

/* Media Container */
.lightbox-media {
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
}

.lightbox-media img,
.lightbox-media video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.45);
  animation: mediaPop 0.5s ease;
}

/* Navigation Controls */
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2.2rem;
  color: white;
  background: rgba(0,0,0,0.4);
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
  z-index: 2000;
}

.lightbox-nav:hover {
  background: rgba(0,0,0,0.65);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-nav.prev { left: 20px; }
.lightbox-nav.next { right: 20px; }

/* Close Button */
.lightbox-close {
  position: absolute;
  top: 15px;
  right: 18px;
  font-size: 1.8rem;
  color: #fff;
  background: rgba(0,0,0,0.55);
  border-radius: 50%;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
  z-index: 2000;
}

.lightbox-close:hover {
  background: rgba(0,0,0,0.75);
  transform: scale(1.1);
}

/* ---------- Animations ---------- */
@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes slideUp {
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes mediaPop {
  from { transform: scale(0.9); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
}


/* ========== NEW CREATIVE LAYOUTS ========== */

/* ---------- Floating Layout ---------- */
.floating-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 40px 20px;
  min-height: 400px;
  position: relative;
  overflow: hidden;
}

.floating-layout .gallery-item {
  width: 180px;
  height: 180px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  opacity: 0;
  animation: floatingEnter 1s ease forwards, floatingMove 8s ease-in-out infinite;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.floating-layout .gallery-item:nth-child(odd) { animation-delay: 0.2s, 1s; }
.floating-layout .gallery-item:nth-child(even) { animation-delay: 0.4s, 2s; }

.floating-layout .gallery-item:hover {
  transform: translateY(-15px) scale(1.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

@keyframes floatingEnter {
  0% { opacity: 0; transform: translateY(50px) scale(0.8); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes floatingMove {
  0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
  25% { transform: translateX(15px) translateY(-10px) rotate(2deg); }
  50% { transform: translateX(-10px) translateY(15px) rotate(-1deg); }
  75% { transform: translateX(10px) translateY(-5px) rotate(1deg); }
}

/* ---------- Orbiting Layout ---------- */
.orbiting-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  position: relative;
  padding: 60px;
}

.orbiting-layout .gallery-item {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0;
  animation: orbitingEnter 1s ease forwards;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.orbiting-layout .gallery-item:nth-child(1) {
  animation: orbitingEnter 1s ease forwards, orbit1 12s linear infinite;
  animation-delay: 0.2s, 1s;
}
.orbiting-layout .gallery-item:nth-child(2) {
  animation: orbitingEnter 1s ease forwards, orbit2 15s linear infinite;
  animation-delay: 0.4s, 1.5s;
}
.orbiting-layout .gallery-item:nth-child(3) {
  animation: orbitingEnter 1s ease forwards, orbit3 18s linear infinite;
  animation-delay: 0.6s, 2s;
}

.orbiting-layout .gallery-item:hover {
  transform: scale(1.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

@keyframes orbitingEnter {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes orbit1 {
  0% { transform: rotate(0deg) translateX(150px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
}

@keyframes orbit2 {
  0% { transform: rotate(120deg) translateX(120px) rotate(-120deg); }
  100% { transform: rotate(480deg) translateX(120px) rotate(-480deg); }
}

@keyframes orbit3 {
  0% { transform: rotate(240deg) translateX(180px) rotate(-240deg); }
  100% { transform: rotate(600deg) translateX(180px) rotate(-600deg); }
}

/* ---------- Cascading Layout ---------- */
.cascading-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 30px;
  position: relative;
}

.cascading-layout .gallery-item {
  border-radius: 15px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(80px) scale(0.9);
  animation: cascadingEnter 0.8s ease forwards;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.cascading-layout .gallery-item:nth-child(1) { animation-delay: 0.1s; }
.cascading-layout .gallery-item:nth-child(2) { animation-delay: 0.3s; }
.cascading-layout .gallery-item:nth-child(3) { animation-delay: 0.5s; }
.cascading-layout .gallery-item:nth-child(4) { animation-delay: 0.7s; }

.cascading-layout .gallery-item:hover {
  transform: translateY(-12px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

@keyframes cascadingEnter {
  0% { opacity: 0; transform: translateY(80px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* ---------- Vortex Layout ---------- */
.vortex-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  position: relative;
  padding: 80px;
}

.vortex-layout .gallery-item {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 20px;
  overflow: hidden;
  opacity: 0;
  animation: vortexEnter 2s ease forwards, vortexSpin 20s linear infinite;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.vortex-layout .gallery-item:nth-child(1) { animation-delay: 0.2s, 2s; }
.vortex-layout .gallery-item:nth-child(2) { animation-delay: 0.6s, 2.5s; }
.vortex-layout .gallery-item:nth-child(3) { animation-delay: 1s, 3s; }

.vortex-layout .gallery-item:hover {
  animation-play-state: paused;
  transform: scale(1.15);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
  z-index: 10;
}

@keyframes vortexEnter {
  0% { opacity: 0; transform: scale(2) rotate(360deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes vortexSpin {
  0% { transform: rotate(0deg) translateX(200px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
}

/* ---------- Constellation Layout ---------- */
.constellation-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 50px;
  min-height: 500px;
  background: radial-gradient(circle, rgba(25,25,112,0.1) 0%, rgba(0,0,0,0.05) 100%);
  position: relative;
}

.constellation-layout .gallery-item {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0;
  position: relative;
  animation: constellationEnter 1.5s ease forwards, constellationTwinkle 3s ease-in-out infinite;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 10px 25px rgba(0, 0, 0, 0.1);
}

.constellation-layout .gallery-item::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(255,215,0,0.5), rgba(255,255,255,0.3));
  z-index: -1;
  animation: constellationGlow 2s ease-in-out infinite alternate;
}

.constellation-layout .gallery-item:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.6), 0 15px 35px rgba(0, 0, 0, 0.2);
}

@keyframes constellationEnter {
  0% { opacity: 0; transform: scale(0.3); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes constellationTwinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes constellationGlow {
  0% { opacity: 0.5; }
  100% { opacity: 0.9; }
}

/* ---------- Magnetic Layout ---------- */
.magnetic-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 40px;
  min-height: 450px;
}

.magnetic-layout .gallery-item {
  width: 170px;
  height: 170px;
  border-radius: 15px;
  overflow: hidden;
  opacity: 0;
  animation: magneticEnter 1s ease forwards, magneticPull 6s ease-in-out infinite;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.magnetic-layout .gallery-item:nth-child(odd) { animation-delay: 0.2s, 1s; }
.magnetic-layout .gallery-item:nth-child(even) { animation-delay: 0.5s, 2s; }

.magnetic-layout .gallery-item:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.2);
}

@keyframes magneticEnter {
  0% { opacity: 0; transform: translateX(-100px) scale(0.8); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes magneticPull {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(8px) translateY(-4px); }
  50% { transform: translateX(-6px) translateY(8px); }
  75% { transform: translateX(4px) translateY(-6px); }
}

/* ---------- Ripple Layout ---------- */
.ripple-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 25px;
  padding: 40px;
  min-height: 450px;
}

.ripple-layout .gallery-item {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0;
  position: relative;
  animation: rippleEnter 1s ease forwards, rippleEffect 4s ease-in-out infinite;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.ripple-layout .gallery-item::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.3);
  animation: rippleWave 3s ease-out infinite;
}

.ripple-layout .gallery-item:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

@keyframes rippleEnter {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes rippleEffect {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

@keyframes rippleWave {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* ---------- Kaleidoscope Layout ---------- */
.kaleidoscope-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  position: relative;
  padding: 80px;
}

.kaleidoscope-layout .gallery-item {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 20%;
  overflow: hidden;
  opacity: 0;
  animation: kaleidoscopeEnter 2s ease forwards, kaleidoscopeRotate 16s linear infinite;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.kaleidoscope-layout .gallery-item:nth-child(1) { 
  animation-delay: 0.2s, 1s;
  transform-origin: 200px 0;
}
.kaleidoscope-layout .gallery-item:nth-child(2) { 
  animation-delay: 0.6s, 1.5s;
  transform-origin: -100px 173px;
}
.kaleidoscope-layout .gallery-item:nth-child(3) { 
  animation-delay: 1s, 2s;
  transform-origin: -100px -173px;
}

.kaleidoscope-layout .gallery-item:hover {
  animation-play-state: paused;
  transform: scale(1.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

@keyframes kaleidoscopeEnter {
  0% { opacity: 0; transform: scale(0.3) rotate(180deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes kaleidoscopeRotate {
  0% { transform: rotate(0deg) translateX(180px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
}

/* ---------- Drifting Layout ---------- */
.drifting-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 35px;
  padding: 50px;
  min-height: 500px;
}

.drifting-layout .gallery-item {
  width: 180px;
  height: 180px;
  border-radius: 25px;
  overflow: hidden;
  opacity: 0;
  animation: driftingEnter 1.5s ease forwards, driftingFloat 10s ease-in-out infinite;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.drifting-layout .gallery-item:nth-child(1) { animation-delay: 0.2s, 1s; }
.drifting-layout .gallery-item:nth-child(2) { animation-delay: 0.5s, 3s; }
.drifting-layout .gallery-item:nth-child(3) { animation-delay: 0.8s, 5s; }

.drifting-layout .gallery-item:hover {
  animation-play-state: paused;
  transform: translateY(-15px) scale(1.08);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
}

@keyframes driftingEnter {
  0% { opacity: 0; transform: translateY(60px) rotate(10deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0deg); }
}

@keyframes driftingFloat {
  0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
  25% { transform: translateX(20px) translateY(-15px) rotate(3deg); }
  50% { transform: translateX(-15px) translateY(20px) rotate(-2deg); }
  75% { transform: translateX(10px) translateY(-10px) rotate(1deg); }
}

/* ---------- Pulsing Layout ---------- */
.pulsing-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 40px;
  min-height: 450px;
}

.pulsing-layout .gallery-item {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0;
  animation: pulsingEnter 1s ease forwards, pulsingBeat 3s ease-in-out infinite;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.pulsing-layout .gallery-item:nth-child(1) { animation-delay: 0.2s, 1s; }
.pulsing-layout .gallery-item:nth-child(2) { animation-delay: 0.4s, 1.5s; }
.pulsing-layout .gallery-item:nth-child(3) { animation-delay: 0.6s, 2s; }

.pulsing-layout .gallery-item:hover {
  animation-play-state: paused;
  transform: scale(1.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

@keyframes pulsingEnter {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes pulsingBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* Reduced motion support for new layouts */
@media (prefers-reduced-motion: reduce) {
  .floating-layout .gallery-item,
  .orbiting-layout .gallery-item,
  .cascading-layout .gallery-item,
  .vortex-layout .gallery-item,
  .constellation-layout .gallery-item,
  .magnetic-layout .gallery-item,
  .ripple-layout .gallery-item,
  .kaleidoscope-layout .gallery-item,
  .drifting-layout .gallery-item,
  .pulsing-layout .gallery-item {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1;
  }
}


`;

export const MediaGalleryStyles: React.FC = () => (
  <style dangerouslySetInnerHTML={{ __html: css }} />
);

export default MediaGalleryStyles;