import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface MapSearchBarProps {
  onSelect: (coords: [number, number]) => void;
  countryCode?: string;
}

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 400;

export default function MapSearchBar({
  onSelect,
  countryCode = "ng",
}: MapSearchBarProps) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setOptions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // We added &countrycodes=${countryCode} to the end of the URL
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query,
          )}&limit=5&countrycodes=${countryCode}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error(`Geocoding request failed: ${res.status}`);
        const data: GeocodeResult[] = await res.json();
        setOptions(data ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Geocoding search failed:", err);
        }
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, countryCode]);

  return (
    <Box sx={{ width: { xs: 200, sm: 260 } }}>
      <Autocomplete
        size="small"
        options={options}
        loading={isSearching}
        filterOptions={(x) => x}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.display_name
        }
        isOptionEqualToValue={(option, value) =>
          option.lat === value.lat && option.lon === value.lon
        }
        noOptionsText={
          query.trim().length < MIN_QUERY_LENGTH
            ? "Keep typing to search…"
            : "No matching locations"
        }
        onInputChange={(_, newValue) => setQuery(newValue)}
        onChange={(_, value) => {
          if (value && typeof value !== "string") {
            onSelect([parseFloat(value.lat), parseFloat(value.lon)]);
          }
        }}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={`${option.lat}-${option.lon}`}
            sx={{
              fontSize: "12px",
              py: 1,
              px: 1,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {option.display_name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search location…"
            variant="outlined"
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps?.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              bgcolor: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(8px)",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                fontSize: "12px",
                color: "#fff",
                px: 1.5,
                py: 0.2,
                "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--accent-gold, #e0a96d)",
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
}
