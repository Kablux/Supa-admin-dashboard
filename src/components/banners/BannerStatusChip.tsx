import Chip from "@mui/material/Chip";
import { Banner } from "../../types/common.types";
import { isExpired, isScheduled } from "../../utils/bannerHelpers";

interface BannerStatusChipProps {
  banner: Banner;
}

export default function BannerStatusChip({
  banner,
}: BannerStatusChipProps): React.ReactElement {
  const expired = isExpired(banner.ends_at);
  const scheduled = isScheduled(banner.starts_at);

  let label = "Inactive";
  let color = "#EF5350";
  let bg = "rgba(239,83,80,0.10)";

  if (banner.is_active) {
    if (expired) {
      label = "Expired";
      color = "#FF9800";
      bg = "rgba(255,152,0,0.10)";
    } else if (scheduled) {
      label = "Scheduled";
      color = "#42A5F5";
      bg = "rgba(66,165,245,0.10)";
    } else {
      label = "Active";
      color = "#4CAF50";
      bg = "rgba(76,175,80,0.10)";
    }
  }

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 22,
        fontSize: 10.5,
        fontWeight: 600,
        backgroundColor: bg,
        color,
        border: `1px solid ${color}35`,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}
