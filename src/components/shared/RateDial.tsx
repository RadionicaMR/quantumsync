
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface RateDialProps {
  open: boolean;
  onClose: (value: number | null) => void;
  initialValue?: number;
}

const DIAL_SIZE = 280;
const CENTER = DIAL_SIZE / 2;
const RADIUS = 110;
const TICK_OUTER = RADIUS + 12;
const TICK_INNER_MAJOR = RADIUS - 8;
const TICK_INNER_MINOR = RADIUS - 4;
const LABEL_RADIUS = RADIUS + 28;

// Arc: 270° from 135° (bottom-left) to 405° (bottom-right)
const START_ANGLE = 135;
const END_ANGLE = 405;
const ARC_SPAN = END_ANGLE - START_ANGLE; // 270

function valueToAngle(value: number): number {
  return START_ANGLE + (value / 100) * ARC_SPAN;
}

function angleToValue(angleDeg: number): number {
  let a = angleDeg;
  // Normalize to [0, 360)
  while (a < 0) a += 360;
  while (a >= 360) a -= 360;

  // Map angle to value
  // The dead zone is from END_ANGLE(45°) to START_ANGLE(135°) — bottom area
  // Dead zone in normalized: 45° to 135°
  if (a >= 45 && a < 135) {
    // In dead zone — snap to nearest end
    return a < 90 ? 100 : 0;
  }

  // Convert angle to arc position
  let arcAngle = a - 135;
  if (arcAngle < 0) arcAngle += 360;

  const val = (arcAngle / ARC_SPAN) * 100;
  return Math.max(0, Math.min(100, val));
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

const RateDial: React.FC<RateDialProps> = ({ open, onClose, initialValue = 0 }) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      hasMovedRef.current = false;
    }
  }, [open, initialValue]);

  const getAngleFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }, []);

  const updateValue = useCallback((clientX: number, clientY: number) => {
    const angle = getAngleFromEvent(clientX, clientY);
    const v = angleToValue(angle);
    setValue(Math.round(v * 10) / 10);
  }, [getAngleFromEvent]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element)?.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    hasMovedRef.current = false;
    updateValue(e.clientX, e.clientY);
  }, [updateValue]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    hasMovedRef.current = true;
    updateValue(e.clientX, e.clientY);
  }, [isDragging, updateValue]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    // Close and send value directly as 0-100
    onClose(Math.round(value));
  }, [isDragging, value, onClose]);

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i <= 100; i += 1) {
    const angle = valueToAngle(i);
    const isMajor = i % 10 === 0;
    const isMid = i % 5 === 0 && !isMajor;
    const inner = isMajor ? TICK_INNER_MAJOR : isMid ? TICK_INNER_MINOR : RADIUS;
    const outer = TICK_OUTER;
    const p1 = polarToCartesian(CENTER, CENTER, inner, angle);
    const p2 = polarToCartesian(CENTER, CENTER, outer, angle);
    ticks.push(
      <line
        key={i}
        x1={p1.x} y1={p1.y}
        x2={p2.x} y2={p2.y}
        stroke={isMajor ? '#C0C0C0' : isMid ? '#888' : '#555'}
        strokeWidth={isMajor ? 2 : 1}
      />
    );
    if (isMajor) {
      const lp = polarToCartesian(CENTER, CENTER, LABEL_RADIUS, angle);
      ticks.push(
        <text
          key={`label-${i}`}
          x={lp.x} y={lp.y}
          fill="#C0C0C0"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ userSelect: 'none' }}
        >
          {i}
        </text>
      );
    }
  }

  // Indicator (needle)
  const needleAngle = valueToAngle(value);
  const needleTip = polarToCartesian(CENTER, CENTER, RADIUS - 2, needleAngle);
  const needleBase1 = polarToCartesian(CENTER, CENTER, 8, needleAngle - 90);
  const needleBase2 = polarToCartesian(CENTER, CENTER, 8, needleAngle + 90);

  // Arc path for the value track
  const arcStart = polarToCartesian(CENTER, CENTER, RADIUS, START_ANGLE);
  const arcEnd = polarToCartesian(CENTER, CENTER, RADIUS, needleAngle);
  const arcSweep = (needleAngle - START_ANGLE) > 180 ? 1 : 0;
  const valueArcPath = `M ${arcStart.x} ${arcStart.y} A ${RADIUS} ${RADIUS} 0 ${arcSweep} 1 ${arcEnd.x} ${arcEnd.y}`;

  // Background arc
  const bgArcEnd = polarToCartesian(CENTER, CENTER, RADIUS, END_ANGLE);
  const bgArcPath = `M ${arcStart.x} ${arcStart.y} A ${RADIUS} ${RADIUS} 0 1 1 ${bgArcEnd.x} ${bgArcEnd.y}`;
  const rateValue = Math.round(value);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(null); }}>
      <DialogContent className="sm:max-w-[340px] p-4 bg-black/95 border-zinc-700 flex flex-col items-center gap-2">
        <div className="text-center">
          <p className="text-zinc-400 text-sm mb-1">RATE</p>
          <p className="text-3xl font-mono font-bold text-white">{rateValue}</p>
        </div>
        <svg
          ref={svgRef}
          width={DIAL_SIZE}
          height={DIAL_SIZE}
          viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
          className="touch-none cursor-pointer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        >
          {/* Background circle */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 16} fill="#1a1a1a" />
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 14} fill="none" stroke="#444" strokeWidth="1" />

          {/* Background arc track */}
          <path d={bgArcPath} fill="none" stroke="#333" strokeWidth="6" strokeLinecap="round" />

          {/* Value arc */}
          {value > 0 && (
            <path d={valueArcPath} fill="none" stroke="url(#silverGradient)" strokeWidth="6" strokeLinecap="round" />
          )}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#888" />
              <stop offset="50%" stopColor="#e0e0e0" />
              <stop offset="100%" stopColor="#999" />
            </linearGradient>
            <radialGradient id="knobGradient" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#e8e8e8" />
              <stop offset="60%" stopColor="#aaa" />
              <stop offset="100%" stopColor="#666" />
            </radialGradient>
          </defs>

          {/* Tick marks */}
          {ticks}

          {/* Center knob */}
          <circle cx={CENTER} cy={CENTER} r={20} fill="url(#knobGradient)" />
          <circle cx={CENTER} cy={CENTER} r={18} fill="none" stroke="#555" strokeWidth="1" />

          {/* Needle */}
          <polygon
            points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
            fill="#e0e0e0"
            stroke="#aaa"
            strokeWidth="0.5"
          />
          <circle cx={CENTER} cy={CENTER} r={6} fill="#ccc" />
        </svg>
        <p className="text-zinc-500 text-xs text-center">
          Gira el dial y suelta para confirmar
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default RateDial;
