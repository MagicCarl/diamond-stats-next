"use client";

interface PitchDot {
  x: number;
  y: number;
  result: string;
  pitchNumber?: number;
}

interface StrikeZoneProps {
  pitches: PitchDot[];
  interactive?: boolean;
  selectedLocation?: { x: number; y: number } | null;
  onLocationSelect?: (location: { x: number; y: number }) => void;
  size?: number;
}

const PITCH_RESULT_COLORS: Record<string, string> = {
  called_strike: "#ef4444",
  swinging_strike: "#dc2626",
  foul: "#f97316",
  ball: "#3b82f6",
  in_play: "#22c55e",
  hit_by_pitch: "#a855f7",
};

export default function StrikeZone({
  pitches,
  interactive = false,
  selectedLocation,
  onLocationSelect,
  size = 250,
}: StrikeZoneProps) {
  const viewBox = "0 0 200 260";

  // Strike zone box (centered, proportional to real zone)
  const zone = {
    left: 55,
    right: 145,
    top: 60,
    bottom: 180,
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onLocationSelect) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onLocationSelect({ x, y });
  };

  const toSvg = (nx: number, ny: number) => ({
    x: nx * 200,
    y: ny * 260,
  });

  return (
    <div className="flex justify-center">
      <svg
        viewBox={viewBox}
        width={size}
        height={size * 1.3}
        onClick={handleClick}
        className={`${interactive ? "cursor-crosshair" : ""}`}
      >
        {/* Background */}
        <rect width="200" height="260" fill="#1a1a2e" rx="8" />

        {/* Strike zone box */}
        <rect
          x={zone.left}
          y={zone.top}
          width={zone.right - zone.left}
          height={zone.bottom - zone.top}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Zone grid lines (3x3 grid) */}
        {[1, 2].map((i) => (
          <line
            key={`v${i}`}
            x1={zone.left + ((zone.right - zone.left) / 3) * i}
            y1={zone.top}
            x2={zone.left + ((zone.right - zone.left) / 3) * i}
            y2={zone.bottom}
            stroke="white"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}
        {[1, 2].map((i) => (
          <line
            key={`h${i}`}
            x1={zone.left}
            y1={zone.top + ((zone.bottom - zone.top) / 3) * i}
            x2={zone.right}
            y2={zone.top + ((zone.bottom - zone.top) / 3) * i}
            stroke="white"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}

        {/* Home plate */}
        <polygon
          points="85,230 100,240 115,230 112,224 88,224"
          fill="white"
          opacity="0.8"
        />

        {/* Batter box outlines */}
        <rect
          x={25}
          y={210}
          width={30}
          height={45}
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          opacity="0.2"
        />
        <rect
          x={145}
          y={210}
          width={30}
          height={45}
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          opacity="0.2"
        />

        {/* Zone labels */}
        <text x="100" y="52" textAnchor="middle" fill="white" fontSize="8" opacity="0.4">
          STRIKE ZONE
        </text>

        {/* Pitch dots */}
        {pitches.map((pitch, i) => {
          const pos = toSvg(pitch.x, pitch.y);
          return (
            <g key={i}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill={PITCH_RESULT_COLORS[pitch.result] || "#6b7280"}
                stroke="white"
                strokeWidth="0.8"
                opacity="0.85"
              >
                <title>
                  #{pitch.pitchNumber ?? i + 1}: {pitch.result.replace(/_/g, " ")}
                </title>
              </circle>
              {pitch.pitchNumber && (
                <text
                  x={pos.x}
                  y={pos.y + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="7"
                  fontWeight="bold"
                >
                  {pitch.pitchNumber}
                </text>
              )}
            </g>
          );
        })}

        {/* Selected location indicator */}
        {selectedLocation && (
          <circle
            cx={selectedLocation.x * 200}
            cy={selectedLocation.y * 260}
            r="8"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          >
            <animate
              attributeName="r"
              values="6;10;6"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>
    </div>
  );
}
