"use client";

import { RESULT_COLORS, RESULT_LABELS } from "@/lib/constants";

interface HitDot {
  x: number;
  y: number;
  result: string;
  playerName?: string;
}

interface SprayChartDiamondProps {
  hits: HitDot[];
  interactive?: boolean;
  selectedLocation?: { x: number; y: number } | null;
  onLocationSelect?: (location: { x: number; y: number }) => void;
  size?: number;
}

export default function SprayChartDiamond({
  hits,
  interactive = false,
  selectedLocation,
  onLocationSelect,
  size = 300,
}: SprayChartDiamondProps) {
  const viewBox = "0 0 300 300";

  // Diamond points (home plate at bottom center)
  const homePlate = { x: 150, y: 270 };
  const firstBase = { x: 235, y: 185 };
  const secondBase = { x: 150, y: 100 };
  const thirdBase = { x: 65, y: 185 };

  // Outfield arc
  const outfieldRadius = 140;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onLocationSelect) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width);
    const y = ((e.clientY - rect.top) / rect.height);
    onLocationSelect({ x, y });
  };

  // Convert normalized coords to SVG coords
  const toSvg = (nx: number, ny: number) => ({
    x: nx * 300,
    y: ny * 300,
  });

  return (
    <div className="flex justify-center">
      <svg
        viewBox={viewBox}
        width={size}
        height={size}
        onClick={handleClick}
        className={`${interactive ? "cursor-crosshair" : ""}`}
      >
        {/* Grass */}
        <rect width="300" height="300" fill="#2d5a27" rx="8" />

        {/* Outfield arc */}
        <path
          d={`M 30 210 A ${outfieldRadius} ${outfieldRadius} 0 0 1 270 210`}
          fill="none"
          stroke="white"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Infield dirt */}
        <polygon
          points={`${homePlate.x},${homePlate.y} ${firstBase.x},${firstBase.y} ${secondBase.x},${secondBase.y} ${thirdBase.x},${thirdBase.y}`}
          fill="#c4956a"
          opacity="0.6"
        />

        {/* Baselines */}
        <line
          x1={homePlate.x} y1={homePlate.y}
          x2={firstBase.x} y2={firstBase.y}
          stroke="white" strokeWidth="1.5" opacity="0.7"
        />
        <line
          x1={firstBase.x} y1={firstBase.y}
          x2={secondBase.x} y2={secondBase.y}
          stroke="white" strokeWidth="1.5" opacity="0.7"
        />
        <line
          x1={secondBase.x} y1={secondBase.y}
          x2={thirdBase.x} y2={thirdBase.y}
          stroke="white" strokeWidth="1.5" opacity="0.7"
        />
        <line
          x1={thirdBase.x} y1={thirdBase.y}
          x2={homePlate.x} y2={homePlate.y}
          stroke="white" strokeWidth="1.5" opacity="0.7"
        />

        {/* Foul lines extending to outfield */}
        <line
          x1={homePlate.x} y1={homePlate.y}
          x2={30} y2={100}
          stroke="white" strokeWidth="1" opacity="0.4"
        />
        <line
          x1={homePlate.x} y1={homePlate.y}
          x2={270} y2={100}
          stroke="white" strokeWidth="1" opacity="0.4"
        />

        {/* Base markers */}
        {[firstBase, secondBase, thirdBase].map((base, i) => (
          <rect
            key={i}
            x={base.x - 5}
            y={base.y - 5}
            width="10"
            height="10"
            fill="white"
            transform={`rotate(45, ${base.x}, ${base.y})`}
          />
        ))}

        {/* Home plate */}
        <polygon
          points={`${homePlate.x},${homePlate.y + 6} ${homePlate.x - 5},${homePlate.y} ${homePlate.x - 5},${homePlate.y - 4} ${homePlate.x + 5},${homePlate.y - 4} ${homePlate.x + 5},${homePlate.y}`}
          fill="white"
        />

        {/* Hit dots */}
        {hits.map((hit, i) => {
          const pos = toSvg(hit.x, hit.y);
          return (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r="5"
              fill={RESULT_COLORS[hit.result] || "#6b7280"}
              stroke="white"
              strokeWidth="1"
              opacity="0.85"
            >
              <title>
                {hit.playerName ? `${hit.playerName}: ` : ""}
                {RESULT_LABELS[hit.result] || hit.result}
              </title>
            </circle>
          );
        })}

        {/* Selected location indicator */}
        {selectedLocation && (
          <circle
            cx={selectedLocation.x * 300}
            cy={selectedLocation.y * 300}
            r="7"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          >
            <animate
              attributeName="r"
              values="5;9;5"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>
    </div>
  );
}
