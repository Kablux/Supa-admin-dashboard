import React from "react";
import { Box,  InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
