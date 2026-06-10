import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  InputBase,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const DATE_FILTERS = ["Today", "This Week", "This Month", "This Year"];

export default function FilterBar() {
  const [activeDate, setActiveDate] = useState("Today");
  const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);

  const handleDateMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateSelect = (filter: string) => {
    setActiveDate(filter);
    setDateAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 2.5,
        flexWrap: "wrap",
      }}
    >
      {/* Left Side: Search + Add Filter */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box>
          <Button
            onClick={handleDateMenuOpen}
            startIcon={<TuneIcon sx={{ fontSize: 14 }} />}
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
            sx={{
              backgroundColor: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: 12,
              py: 0.5,
              px: 1.5,
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "var(--bg-card-hover)",
                borderColor: "var(--accent-gold)",
              },
            }}
          >
            {activeDate}
          </Button>

          {/* The Dropdown Menu */}
          <Menu
            anchorEl={dateAnchorEl}
            open={Boolean(dateAnchorEl)}
            onClose={() => setDateAnchorEl(null)}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                minWidth: 140,
                mt: 1,
                borderRadius: 2,
                boxShadow: "0 10px 30px -5px rgba(0,0,0,.8)",
              },
            }}
          >
            {DATE_FILTERS.map((filter) => {
              const isActive = activeDate === filter;
              return (
                <MenuItem
                  key={filter}
                  onClick={() => handleDateSelect(filter)}
                  sx={{
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? "var(--accent-gold)"
                      : "var(--text-secondary)",
                    backgroundColor: isActive
                      ? "rgba(255, 193, 7, 0.05)"
                      : "transparent",
                    py: 1,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "var(--bg-card-hover)",
                      color: "var(--accent-gold)",
                    },
                  }}
                >
                  {filter}
                </MenuItem>
              );
            })}
          </Menu>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            px: 1.5,
            py: 0.7,
            minWidth: 240,
            transition: "border-color 0.2s",
            "&:focus-within": { borderColor: "var(--accent-gold)" },
          }}
        >
          <SearchIcon sx={{ fontSize: 14, color: "var(--text-muted)" }} />
          <InputBase
            placeholder="Search by name or email"
            sx={{
              flex: 1,
              fontSize: 12.5,
              color: "var(--text-secondary)",
              "& input::placeholder": {
                color: "var(--text-muted)",
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
