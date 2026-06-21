import { Chip } from "@mui/material";

export function StatusChip({ status }: { status: string }): React.ReactElement {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active:               { label: 'Active',      color: '#4CAF50', bg: 'rgba(76,175,80,0.1)' },
    pending_verification: { label: 'Pending',      color: '#FF9800', bg: 'rgba(255,152,0,0.1)' },
    suspended:            { label: 'Suspended',    color: '#EF5350', bg: 'rgba(239,83,80,0.1)' },
    deactivated:          { label: 'Deactivated',  color: '#888',    bg: 'rgba(136,136,136,0.1)' },
  };
  const style = map[status] ?? { label: status, color: '#888', bg: 'rgba(136,136,136,0.1)' };
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        height: 22, fontSize: 11, fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.color}30`,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}
