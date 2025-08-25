// src/components/BorderPreview.tsx
import React from 'react';
import { BorderSettings, BorderElement } from '@/types/background';

interface PreviewProps {
  settings: BorderSettings;
  width?: string | number;
  height?: string | number;
  compact?: boolean;
}

const BorderPreview: React.FC<PreviewProps> = ({ settings, width = '100%', height = 120, compact = false }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = React.useState({ width: 300, height: 120 });

  // revolve computed positions map
  const [revolvePositions, setRevolvePositions] = React.useState<Record<string, { left: number; top: number }>>({});

  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      setContainerSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const primary = settings.primaryColor || (settings as any).color || '#2b2b2b';
  const secondary = settings.secondaryColor || null;
  const hasGradient = !!(secondary && primary && primary !== secondary);
  const borderWidth = Math.max(0, (settings.width ?? 4));
  const borderRadius = Math.max(0, (settings.radius ?? 8));
  const borderStyleCss = settings.style && settings.style !== 'none' ? settings.style : 'solid';

  // compute pixel position along the perimeter centerline of the visible border stroke
  const computePerimeterPos = (posPercent: number, elSize: number) => {
    // centerline inset = half stroke
    const inset = borderWidth / 2;
    const innerX = inset;
    const innerY = inset;
    const innerW = Math.max(0, containerSize.width - inset * 2);
    const innerH = Math.max(0, containerSize.height - inset * 2);
    const perim = 2 * (innerW + innerH);
    const normalized = ((posPercent % 100) + 100) % 100;
    const dist = (normalized / 100) * perim;

    let x = innerX;
    let y = innerY;

    if (dist <= innerW) {
      // top edge left->right
      x = innerX + dist;
      y = innerY;
    } else if (dist <= innerW + innerH) {
      // right edge top->bottom
      const d = dist - innerW;
      x = innerX + innerW;
      y = innerY + d;
    } else if (dist <= innerW + innerH + innerW) {
      // bottom edge right->left
      const d = dist - (innerW + innerH);
      x = innerX + innerW - d;
      y = innerY + innerH;
    } else {
      // left edge bottom->top
      const d = dist - (innerW + innerH + innerW);
      x = innerX;
      y = innerY + innerH - d;
    }

    // center element over the centerline
    return { left: Math.round(x - elSize / 2), top: Math.round(y - elSize / 2) };
  };

  // RAF loop for revolve elements (frame-accurate & matches visible SVG border)
  React.useEffect(() => {
    let rafId = 0;
    let start = performance.now();

    const revolveElements: BorderElement[] = (settings.decorativeElements || []).filter(el => el.animation === 'revolve');

    if (revolveElements.length === 0) {
      setRevolvePositions({});
      return;
    }

    const update = (now: number) => {
      const newPos: Record<string, { left: number; top: number }> = {};
      const elapsed = (now - start) / 1000;
      revolveElements.forEach(el => {
        const duration = (el.rotateSpeed && el.rotateSpeed > 0) ? el.rotateSpeed : 6;
        const startOffset = ((el.position ?? 0) % 100) / 100;
        const progress = (startOffset + (elapsed / duration)) % 1;
        const percent = progress * 100;
        const p = computePerimeterPos(percent, el.size || 24);
        newPos[el.id] = p;
      });
      setRevolvePositions(prev => ({ ...prev, ...newPos }));
      rafId = requestAnimationFrame(update);
    };

    start = performance.now();
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.decorativeElements, containerSize.width, containerSize.height, borderWidth]);

  // positions for non-revolve elements (static)
  const nonRevolvePositions = React.useMemo(() => {
    const out: Record<string, { left: number; top: number }> = {};
    (settings.decorativeElements || []).forEach(el => {
      if (el.animation === 'revolve') return;
      out[el.id] = computePerimeterPos(el.position ?? 0, el.size || 24);
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.decorativeElements, containerSize.width, containerSize.height, borderWidth]);

  // SVG stroke helpers
  const svgWidth = Math.max(1, containerSize.width);
  const svgHeight = Math.max(1, containerSize.height);
  const rectX = borderWidth / 2;
  const rectY = borderWidth / 2;
  const rectW = Math.max(0, svgWidth - borderWidth);
  const rectH = Math.max(0, svgHeight - borderWidth);
  const rx = Math.max(0, borderRadius - borderWidth / 2); // adjust radius to stroke centerline

  // build stroke dasharray for style
  const dashForStyle = (style: string, w: number) => {
    switch (style) {
      case 'dashed': return `${Math.max(4, w * 3)} ${Math.max(2, w * 1.5)}`;
      case 'dotted': return `${Math.max(1, w)} ${Math.max(4, w)}`;
      default: return ''; // solid (no dasharray)
    }
  };

  // create unique gradient id to avoid collisions
  const gradId = React.useMemo(() => `bgrad-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <div style={{ padding: 6 }}>
      <div
        ref={containerRef}
        style={{
          width,
          height: compact ? 80 : height,
          position: 'relative',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,250,250,0.95))'
        }}
        className="border-preview"
      >
        <div style={{ pointerEvents: 'none', textAlign: 'center', padding: 6 }}>
          <div style={{ fontSize: 12, color: '#333' }}>Preview</div>
        </div>

        {/* SVG overlay for the border stroke (supports gradient + dashed/dotted/double + radius) */}
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 2 }}
          preserveAspectRatio="none"
        >
          <defs>
            {hasGradient ? (
              <linearGradient id={gradId} x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor={primary} />
                <stop offset="100%" stopColor={secondary!} />
              </linearGradient>
            ) : null}
          </defs>

          {/* For 'double' style draw two strokes */}
          {borderStyleCss === 'double' ? (
            <>
              {/* outer stroke */}
              <rect
                x={rectX}
                y={rectY}
                width={rectW}
                height={rectH}
                rx={rx}
                ry={rx}
                fill="none"
                stroke={hasGradient ? `url(#${gradId})` : primary}
                strokeWidth={Math.max(1, borderWidth * 0.55)}
                strokeLinecap="butt"
                strokeDasharray={dashForStyle('solid', borderWidth) || undefined}
              />
              {/* inner stroke (offset shrink) */}
              <rect
                x={rectX + borderWidth * 0.6}
                y={rectY + borderWidth * 0.6}
                width={Math.max(0, rectW - borderWidth * 1.2)}
                height={Math.max(0, rectH - borderWidth * 1.2)}
                rx={Math.max(0, rx - borderWidth * 0.6)}
                ry={Math.max(0, rx - borderWidth * 0.6)}
                fill="none"
                stroke={hasGradient ? `url(#${gradId})` : primary}
                strokeWidth={Math.max(1, borderWidth * 0.35)}
                strokeLinecap="butt"
                strokeDasharray={dashForStyle('solid', borderWidth) || undefined}
              />
            </>
          ) : (
            <rect
              x={rectX}
              y={rectY}
              width={rectW}
              height={rectH}
              rx={rx}
              ry={rx}
              fill="none"
              stroke={hasGradient ? `url(#${gradId})` : primary}
              strokeWidth={borderWidth}
              strokeLinecap="butt"
              strokeDasharray={dashForStyle(borderStyleCss, borderWidth) || undefined}
            />
          )}
        </svg>

        {/* render decorative elements (absolute positioned) */}
        {settings.decorativeElements?.map((el: BorderElement) => {
          const elSize = el.size || 24;
          const isRevolve = el.animation === 'revolve';
          const pos = isRevolve
            ? (revolvePositions[el.id] ?? computePerimeterPos(el.position ?? 0, elSize))
            : (nonRevolvePositions[el.id] || computePerimeterPos(el.position ?? 0, elSize));

          // non-revolve animations (rotate/float/etc)
          let animationCss = '';
          if (!isRevolve) {
            switch (el.animation) {
              case 'rotate-cw':
                animationCss = `rotateCW ${el.rotateSpeed || 6}s linear infinite`;
                break;
              case 'rotate-ccw':
                animationCss = `rotateCCW ${el.rotateSpeed || 6}s linear infinite`;
                break;
              case 'float':
                animationCss = `floatY ${el.rotateSpeed || 3}s ease-in-out infinite`;
                break;
              case 'blink':
                animationCss = `blink ${Math.max(1, el.rotateSpeed || 2)}s ease-in-out infinite`;
                break;
              case 'pop':
                animationCss = `pop ${Math.max(0.8, el.rotateSpeed || 1.2)}s ease-in-out infinite`;
                break;
              case 'bounce':
                animationCss = `bounce ${el.rotateSpeed || 2}s ease-in-out infinite`;
                break;
              case 'shake':
                animationCss = `shake ${el.rotateSpeed || 0.5}s ease-in-out infinite`;
                break;
              case 'pulse':
                animationCss = `pulse ${el.rotateSpeed || 1.5}s ease-in-out infinite`;
                break;
              default:
                animationCss = '';
            }
          }

          const style: React.CSSProperties = {
            position: 'absolute',
            width: elSize,
            height: elSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.max(10, elSize * 0.6),
            left: `${pos.left}px`,
            top: `${pos.top}px`,
            transform: 'translate(0,0)',
            animation: animationCss,
            willChange: 'transform, left, top, opacity',
            zIndex: 3,
            pointerEvents: 'none'
          };

          return (
            <div key={el.id} style={style}>
              {el.type === 'emoji' ? (
                <span style={{ userSelect: 'none' }}>{el.content}</span>
              ) : (
                <img
                  src={el.content}
                  alt="decor"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                />
              )}
            </div>
          );
        })}

        {/* keyframes */}
        <style>{`
          @keyframes rotateCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes rotateCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } }
          @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }
          @keyframes pop { 0% { transform: scale(0.6); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
          @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } 100% { transform: translateX(0); } }
          @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        `}</style>
      </div>
    </div>
  );
};

export default BorderPreview;
