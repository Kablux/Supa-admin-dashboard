import React from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function MapWidget() {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        overflow: "hidden",
        height: 268,
        position: "relative",
        transition: "background-color 0.25s ease",
      }}
    >
      {/* Topbar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          background:
            "linear-gradient(to bottom, rgba(10,10,16,0.92) 50%, transparent)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#f0f0f0",
            }}
          >
            map
          </Typography>
          <Chip
            size="small"
            label="LIVE"
            icon={
              <Box
                className="pulse"
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  backgroundColor: "#EF5350",
                  ml: "6px !important",
                }}
              />
            }
            sx={{
              height: 18,
              fontSize: 9,
              fontWeight: 700,
              backgroundColor: "rgba(239,83,80,0.14)",
              color: "#EF5350",
              border: "1px solid rgba(239,83,80,0.28)",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        </Box>
        <IconButton size="small" sx={{ color: "rgba(255,255,255,0.4)" }}>
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Map SVG */}
      <Box sx={{ width: "100%", height: "100%", backgroundColor: "#191e2d" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 900 268"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Block fills */}
          <rect x="0" y="0" width="900" height="268" fill="#191e2d" />
          <rect x="60" y="0" width="100" height="80" fill="#1e243a" rx="2" />
          <rect x="200" y="0" width="80" height="60" fill="#1e243a" rx="2" />
          <rect x="320" y="20" width="100" height="60" fill="#1e243a" rx="2" />
          <rect x="460" y="0" width="120" height="80" fill="#1e243a" rx="2" />
          <rect x="630" y="10" width="80" height="70" fill="#1e243a" rx="2" />
          <rect x="750" y="0" width="90" height="90" fill="#1e243a" rx="2" />
          <rect x="0" y="100" width="60" height="80" fill="#1e243a" rx="2" />
          <rect x="100" y="110" width="90" height="60" fill="#1e243a" rx="2" />
          <rect x="230" y="100" width="110" height="70" fill="#1e243a" rx="2" />
          <rect x="390" y="95" width="80" height="75" fill="#1e243a" rx="2" />
          <rect x="520" y="100" width="100" height="65" fill="#1e243a" rx="2" />
          <rect x="670" y="95" width="90" height="80" fill="#1e243a" rx="2" />
          <rect x="810" y="100" width="90" height="70" fill="#1e243a" rx="2" />
          <rect x="30" y="200" width="120" height="68" fill="#1e243a" rx="2" />
          <rect x="200" y="195" width="100" height="73" fill="#1e243a" rx="2" />
          <rect x="350" y="200" width="130" height="68" fill="#1e243a" rx="2" />
          <rect x="530" y="195" width="90" height="73" fill="#1e243a" rx="2" />
          <rect x="680" y="200" width="110" height="68" fill="#1e243a" rx="2" />
          <rect x="820" y="185" width="80" height="83" fill="#1e243a" rx="2" />

          {/* Road grid */}
          <g stroke="#242b3f" strokeWidth="14" fill="none">
            <line x1="0" y1="90" x2="900" y2="90" />
            <line x1="0" y1="185" x2="900" y2="185" />
            <line x1="170" y1="0" x2="170" y2="268" />
            <line x1="340" y1="0" x2="340" y2="268" />
            <line x1="510" y1="0" x2="510" y2="268" />
            <line x1="680" y1="0" x2="680" y2="268" />
            <line x1="820" y1="0" x2="820" y2="268" />
          </g>
          <g stroke="#1c2233" strokeWidth="6" fill="none">
            <line x1="0" y1="40" x2="900" y2="40" />
            <line x1="0" y1="140" x2="900" y2="140" />
            <line x1="0" y1="230" x2="900" y2="230" />
            <line x1="80" y1="0" x2="80" y2="268" />
            <line x1="255" y1="0" x2="255" y2="268" />
            <line x1="430" y1="0" x2="430" y2="268" />
            <line x1="600" y1="0" x2="600" y2="268" />
            <line x1="750" y1="0" x2="750" y2="268" />
          </g>

          {/* Route path */}
          <path
            d="M 200 195 L 280 140 L 390 130 L 480 155 L 590 130 L 670 155"
            stroke="#F5C518"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="7 4"
            opacity="0.85"
          />
          {/* Route glow */}
          <path
            d="M 200 195 L 280 140 L 390 130 L 480 155 L 590 130 L 670 155"
            stroke="#F5C518"
            strokeWidth="6"
            fill="none"
            opacity="0.1"
          />

          {/* Origin pin */}
          <g transform="translate(200,193)">
            <circle cx="0" cy="0" r="18" fill="rgba(245,197,24,0.1)" />
            <circle cx="0" cy="0" r="11" fill="#F5C518" />
            <path d="M0,-7 L6,4 L-6,4 Z" fill="#000" />
          </g>

          {/* Car 1 */}
          <g transform="translate(370,122) rotate(-12)">
            <rect x="-15" y="-8" width="30" height="16" rx="5" fill="#F5C518" />
            <rect
              x="-11"
              y="-13"
              width="22"
              height="10"
              rx="3"
              fill="#F5C518"
              opacity="0.75"
            />
            <circle cx="-9" cy="8" r="3.5" fill="#1a1a1a" />
            <circle cx="9" cy="8" r="3.5" fill="#1a1a1a" />
          </g>

          {/* Car 2 */}
          <g transform="translate(590,122) rotate(-8)">
            <rect
              x="-15"
              y="-8"
              width="30"
              height="16"
              rx="5"
              fill="#F5C518"
              opacity="0.65"
            />
            <rect
              x="-11"
              y="-13"
              width="22"
              height="10"
              rx="3"
              fill="#F5C518"
              opacity="0.5"
            />
            <circle cx="-9" cy="8" r="3.5" fill="#1a1a1a" />
            <circle cx="9" cy="8" r="3.5" fill="#1a1a1a" />
          </g>

          {/* GPS compass widget */}
          <g transform="translate(108,118)">
            <rect
              x="-20"
              y="-20"
              width="40"
              height="40"
              rx="10"
              fill="#1e243a"
              stroke="#F5C518"
              strokeWidth="1.5"
              opacity="0.9"
            />
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="none"
              stroke="#F5C518"
              strokeWidth="1.5"
              opacity="0.8"
            />
            <circle cx="0" cy="0" r="2.5" fill="#F5C518" />
            <line
              x1="0"
              y1="-13"
              x2="0"
              y2="-10"
              stroke="#F5C518"
              strokeWidth="1.5"
            />
            <line
              x1="0"
              y1="10"
              x2="0"
              y2="13"
              stroke="#F5C518"
              strokeWidth="1.5"
            />
            <line
              x1="-13"
              y1="0"
              x2="-10"
              y2="0"
              stroke="#F5C518"
              strokeWidth="1.5"
            />
            <line
              x1="10"
              y1="0"
              x2="13"
              y2="0"
              stroke="#F5C518"
              strokeWidth="1.5"
            />
          </g>

          {/* Destination ripple */}
          <g transform="translate(668,152)">
            <circle
              cx="0"
              cy="0"
              r="26"
              fill="rgba(245,197,24,0.05)"
              stroke="rgba(245,197,24,0.15)"
              strokeWidth="1"
            />
            <circle cx="0" cy="0" r="16" fill="rgba(245,197,24,0.1)" />
            <circle cx="0" cy="0" r="8" fill="rgba(245,197,24,0.25)" />
          </g>
        </svg>
      </Box>

      {/* Play/pause control */}
      <Box
        sx={{
          position: "absolute",
          right: 64,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <IconButton
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "rgba(20,20,28,0.85)",
            border: "1px solid rgba(245,197,24,0.25)",
            color: "var(--accent-gold)",
            backdropFilter: "blur(4px)",
            "&:hover": { backgroundColor: "rgba(245,197,24,0.12)" },
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Fullscreen */}
      <Box sx={{ position: "absolute", bottom: 12, right: 12, zIndex: 10 }}>
        <IconButton
          size="small"
          sx={{
            color: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(20,20,28,0.7)",
            "&:hover": { color: "#fff" },
          }}
        >
          <FullscreenIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
