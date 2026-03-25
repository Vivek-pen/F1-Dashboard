import { useEffect, useRef, useState } from "react";

export default function CarMarker({ driverNumber, targetX, targetY, teamColor }) {
  const [pos, setPos] = useState({ x: targetX, y: targetY });
  const prev = useRef({ x: targetX, y: targetY });

  // Smooth interpolation between updates
  useEffect(() => {
    const start = performance.now();
    const duration = 900;

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);

      const x = prev.current.x + (targetX - prev.current.x) * progress;
      const y = prev.current.y + (targetY - prev.current.y) * progress;

      setPos({ x, y });

      if (progress < 1) requestAnimationFrame(animate);
      else prev.current = { x: targetX, y: targetY };
    };

    requestAnimationFrame(animate);
  }, [targetX, targetY]);

  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      
      {/* Car dot */}
      <circle
        r="10"
        fill={teamColor}
        stroke="#000"
        strokeWidth="2"
      />

      {/* Driver number */}
      <text
        y="4"
        textAnchor="middle"
        fontSize="8"
        fill="white"
        fontWeight="bold"
      >
        {driverNumber}
      </text>

    </g>
  );
}