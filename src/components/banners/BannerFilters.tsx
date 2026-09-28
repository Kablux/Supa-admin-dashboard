import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { BannerAudience } from "../../types/common.types";
import { selectSx } from "./bannerMeta";


interface BannerFiltersProps {
  audienceFilter: BannerAudience | "";
  activeFilter: boolean | "";
  onAudienceChange: (value: BannerAudience | "") => void;
  onActiveChange: (value: boolean | "") => void;
}

export default function BannerFilters({
  audienceFilter,
  activeFilter,
  onAudienceChange,
  onActiveChange,
}: BannerFiltersProps): React.ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "wrap",
      }}
    >

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={audienceFilter}
          displayEmpty
          onChange={(e) =>
            onAudienceChange(e.target.value as BannerAudience | "")
          }
          sx={selectSx}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>
            All audiences
          </MenuItem>
          <MenuItem value="all" sx={{ fontSize: 13 }}>
            🌐 All
          </MenuItem>
          <MenuItem value="rider" sx={{ fontSize: 13 }}>
            🧍 Riders
          </MenuItem>
          <MenuItem value="driver" sx={{ fontSize: 13 }}>
            🚗 Drivers
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={activeFilter === "" ? "" : String(activeFilter)}
          displayEmpty
          onChange={(e) => {
            const value = e.target.value;
            onActiveChange(value === "" ? "" : value === "true");
          }}
          sx={selectSx}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>
            All status
          </MenuItem>
          <MenuItem value="true" sx={{ fontSize: 13 }}>
            🟢 Active
          </MenuItem>
          <MenuItem value="false" sx={{ fontSize: 13 }}>
            🔴 Inactive
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
