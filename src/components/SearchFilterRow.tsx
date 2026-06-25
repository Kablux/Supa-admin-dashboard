import React from "react";
import { Box, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AdminTextField from "./common/TextInput";

interface SearchFilterRowProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  filterButtonText?: string;
}

export default function SearchFilterRow({
  value,
  onChange,
  placeholder = "Search...",
  onFilterClick,
  filterButtonText = "Add filter",
}: SearchFilterRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1.5,
        alignItems: { xs: "stretch", sm: "center" },
        width: "100%",
      }}
    >
      {/* Dynamic Filter Action Button */}
      <Button
        onClick={onFilterClick}
        startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
        sx={{
          backgroundColor: "var(--bg-card, #181818)",
          border: "1px solid var(--border, #222)",
          color: "var(--text-primary,)",
          borderRadius: "10px",
          textTransform: "none",
          height: 44,
          px: 2,
          whiteSpace: "nowrap",
          "&:hover": {
            backgroundColor: "var(--border, #222)",
          },
        }}
      >
        {filterButtonText}
      </Button>

      <AdminTextField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "secondary.main", fontSize: 16 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          flex: 1,
          maxWidth: { xs: "100%", sm: 540 },
          // Safely overriding AdminTextField structural sizes for a search context
          "& .MuiOutlinedInput-root": {
            height: 44,
            fontSize: 14,
            borderRadius: "10px",
            color: "primary",
          },
        }}
      />
    </Box>
  );
}
