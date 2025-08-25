import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GreetingFormData, EventType } from '@/types/greeting';
import { BorderSettings, BorderElement, makeCompatibleForLegacy } from '@/types/background';
import { motion } from 'framer-motion';

interface Props {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  children: React.ReactNode;
}

const BorderContainer: React.FC<Props> = ({ greetingData, selectedEvent, children }) => {
  const borderRef = useRef<HTMLDivElement | null>(null);
  const rawBorder = greetingData?.borderSettings || ({} as Partial<BorderSettings>);
  const borderSettings = useMemo(() => makeCompatibleForLegacy(rawBorder), [rawBorder]);

  const [borderSize, setBorderSize] = useState({ width: 300, height: 200 });
  
  useEffect(() => {
    const el = borderRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setBorderSize({ width: Math.round(r.width), height: Math.round(r.height) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute perimeter position
  const computePerimeterPos = (posPercent: number, elSize: number, borderWidth: number) => {
    const inset = borderWidth / 2;
    const innerX = inset;
    const innerY = inset;
    const innerW = Math.max(0, borderSize.width - inset * 2);
    const innerH = Math.max(0, borderSize.height - inset * 2);
    const perim = 2 * (innerW + innerH);
    const normalized = ((posPercent % 100) + 100) % 100;
    const dist = (normalized / 100) * perim;

    let x = innerX, y = innerY;
    if (dist <= innerW) x = innerX + dist;
    else if (dist <= innerW + innerH) { x = innerX + innerW; y = innerY + (dist - innerW); }
    else if (dist <= innerW + innerH + innerW) { x = innerX + innerW - (dist - innerW - innerH); y = innerY + innerH; }
    else { x = innerX; y = innerY + innerH - (dist - innerW - innerH - innerW); }

    return { left: Math.round(x - elSize / 2), top: Math.round(y - elSize / 2) };
  };

  // Revolve animation
  const [revolvePositions, setRevolvePositions] = useState<Record<string, { left: number; top: number }>>({});
  
  useEffect(() => {
    let rafId = 0;
    let start = performance.now();

    const revolveEls: BorderElement[] = (borderSettings.decorativeElements || []).filter(e => e.animation === 'revolve');
    if (revolveEls.length === 0) return;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const newPos: Record<string, { left: number; top: number }> = {};
      revolveEls.forEach(el => {
        const duration = el.rotateSpeed && el.rotateSpeed > 0 ? el.rotateSpeed : 6;
        const startOffset = ((el.position ?? 0) % 100) / 100;
        const progress = (startOffset + (elapsed / duration)) % 1;
        const percent = progress * 100;
        newPos[el.id] = computePerimeterPos(percent, el.size || 24, borderSettings.width || 1);
      });
      setRevolvePositions(prev => ({ ...prev, ...newPos }));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [borderSettings.decorativeElements, borderSize, borderSettings.width]);

  // Static positions
  const nonRevolvePositions = useMemo(() => {
    const out: Record<string, { left: number; top: number }> = {};
    (borderSettings.decorativeElements || []).forEach(el => {
      if (el.animation === 'revolve') return;
      out[el.id] = computePerimeterPos(el.position ?? 0, el.size || 24, borderSettings.width || 1);
    });
    return out;
  }, [borderSettings.decorativeElements, borderSize, borderSettings.width]);

  const hasGradient = !!(
    borderSettings.secondaryColor && 
    borderSettings.primaryColor && 
    borderSettings.primaryColor !== borderSettings.secondaryColor
  );

  const borderWidth = borderSettings.width || 0;
  const borderRadius = borderSettings.radius || 0;
  const borderStyle = borderSettings.style || 'solid';

  // Helper for stroke dash patterns
  const getStrokeDasharray = (style: string, width: number) => {
    switch (style) {
      case 'dashed': return `${Math.max(4, width * 3)} ${Math.max(2, width * 1.5)}`;
      case 'dotted': return `${Math.max(1, width)} ${Math.max(4, width)}`;
      default: return undefined;
    }
  };

  return (
    <motion.div
      ref={borderRef}
      className="shadow-2xl relative overflow-hidden"
      style={{
        border: !borderSettings.enabled ? 'none' : hasGradient ? 'none' : undefined,
        borderWidth: !hasGradient && borderSettings.enabled ? `${borderWidth}px` : undefined,
        borderStyle: !hasGradient && borderSettings.enabled ? borderStyle : undefined,
        borderColor: !hasGradient && borderSettings.enabled ? borderSettings.primaryColor : undefined,
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        position: 'relative'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient Border SVG */}
      {borderSettings.enabled && hasGradient && (
        <svg 
          width="100%" 
          height="100%" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            pointerEvents: 'none',
            zIndex: 1
          }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={borderSettings.primaryColor} />
              <stop offset="100%" stopColor={borderSettings.secondaryColor} />
            </linearGradient>
          </defs>
          
          {borderStyle === 'double' ? (
            <>
              {/* Outer stroke */}
              <rect
                x={borderWidth / 2}
                y={borderWidth / 2}
                width={borderSize.width - borderWidth}
                height={borderSize.height - borderWidth}
                rx={Math.max(0, borderRadius - borderWidth / 2)}
                ry={Math.max(0, borderRadius - borderWidth / 2)}
                fill="none"
                stroke="url(#border-gradient)"
                strokeWidth={borderWidth * 0.6}
                strokeDasharray={getStrokeDasharray('solid', borderWidth)}
              />
              {/* Inner stroke */}
              <rect
                x={borderWidth * 1.6}  // Increased gap (was 1.2)
      y={borderWidth * 1.6}  // Increased gap (was 1.2)
      width={borderSize.width - borderWidth * 3.2}
      height={borderSize.height - borderWidth * 3.2}
      rx={Math.max(0, borderRadius - borderWidth * 1.6)}
      ry={Math.max(0, borderRadius - borderWidth * 1.6)}
      fill="none"
      stroke="url(#border-gradient)"
      strokeWidth={borderWidth * 0.3}
      strokeDasharray={getStrokeDasharray('solid', borderWidth)}
              />
            </>
          ) : (
            <rect
              x={borderWidth / 2}
              y={borderWidth / 2}
              width={borderSize.width - borderWidth}
              height={borderSize.height - borderWidth}
              rx={Math.max(0, borderRadius - borderWidth / 2)}
              ry={Math.max(0, borderRadius - borderWidth / 2)}
              fill="none"
              stroke="url(#border-gradient)"
              strokeWidth={borderWidth}
              strokeDasharray={getStrokeDasharray(borderStyle, borderWidth)}
            />
          )}
        </svg>
      )}

      {/* Content */}
      <div className="p-6 md:p-10 relative z-2">{children}</div>

      {/* Decorative Elements */}
      {borderSettings.enabled && borderSettings.decorativeElements?.map(el => {
        const isRevolve = el.animation === 'revolve';
        const pos = isRevolve ? revolvePositions[el.id] : nonRevolvePositions[el.id];
        
        if (!pos) return null;

        const style: React.CSSProperties = {
          position: 'absolute',
          left: pos.left,
          top: pos.top,
          width: el.size || 24,
          height: el.size || 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          fontSize: (el.size || 24) * 0.6,
          zIndex: 3
        };

        return (
          <div key={el.id} style={style}>
            {el.type === 'emoji' ? (
              <span>{el.content}</span>
            ) : (
              <img 
                src={el.content} 
                alt="decor" 
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

export default BorderContainer;