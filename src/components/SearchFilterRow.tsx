import React, { useEffect, useState } from "react";
import { Box, InputAdornment, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
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
  placeholder = "Search for a trip...",
}: SearchFilterRowProps) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const emit = (v: string) => {
    onChange({
      target: { value: v },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSubmit = () => emit(text.trim());

  const handleClear = () => {
    setText("");
    emit(""); 
  };

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
      <AdminTextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder={placeholder}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "secondary.main", fontSize: 16 }} />
              </InputAdornment>
            ),
            endAdornment: text ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  size="small"
                  aria-label="clear search"
                  sx={{ color: "secondary.main" }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          flex: 1,
          maxWidth: { xs: "100%", sm: 540 },

          "& .MuiOutlinedInput-root": {
            height: 44,
            fontSize: 14,
            borderRadius: "10px",
            color: "primary",
          },
        }}
      />

      <Button
        onClick={handleSubmit}
        sx={{
          height: 42,
          px: 4,
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "10px",
          whiteSpace: "nowrap",
          backgroundColor: "var(--accent-gold, #FFD700)",
          color: "#000",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "var(--accent-gold-dim, #FFD700)",
            boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
}