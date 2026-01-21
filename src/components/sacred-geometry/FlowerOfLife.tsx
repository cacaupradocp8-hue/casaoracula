import { motion } from 'framer-motion';

interface FlowerOfLifeProps {
  size?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
  className?: string;
}

export function FlowerOfLife({ 
  size = 400, 
  color = 'currentColor', 
  opacity = 0.15,
  animated = true,
  className = ''
}: FlowerOfLifeProps) {
  const r = size / 8; // radius of each circle
  const cx = size / 2;
  const cy = size / 2;
  
  // Calculate positions for the 19 circles of Flower of Life
  const circles = [];
  
  // Center circle
  circles.push({ cx, cy });
  
  // First ring - 6 circles around center
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * (Math.PI / 180);
    circles.push({
      cx: cx + r * Math.cos(angle),
      cy: cy + r * Math.sin(angle)
    });
  }
  
  // Second ring - 6 circles at double distance
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * (Math.PI / 180);
    circles.push({
      cx: cx + 2 * r * Math.cos(angle),
      cy: cy + 2 * r * Math.sin(angle)
    });
  }
  
  // Intermediate ring - 6 circles between first and second ring
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 + 30) * (Math.PI / 180);
    circles.push({
      cx: cx + r * Math.sqrt(3) * Math.cos(angle),
      cy: cy + r * Math.sqrt(3) * Math.sin(angle)
    });
  }

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <radialGradient id="flowerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Glow effect */}
      <circle cx={cx} cy={cy} r={size * 0.45} fill="url(#flowerGlow)" />
      
      {/* Flower of Life circles */}
      {circles.map((circle, index) => (
        <circle
          key={index}
          cx={circle.cx}
          cy={circle.cy}
          r={r}
          stroke={color}
          strokeWidth={1}
          fill="none"
          opacity={0.6 + (index === 0 ? 0.2 : 0)}
        />
      ))}
      
      {/* Outer containing circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r * 3}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        opacity={0.4}
      />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="animate-flower-pulse"
      >
        {svgContent}
      </motion.div>
    );
  }

  return svgContent;
}
