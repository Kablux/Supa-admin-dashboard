import { Box, Typography } from "@mui/material";
import { InspectedCar } from "../../types/common.types";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SpeedOutlinedIcon   from '@mui/icons-material/SpeedOutlined';

export function CarSpecRow({ car }: { car: InspectedCar }) {
  const items = [
    { icon: <SpeedOutlinedIcon sx={{ fontSize: 13 }} />, label: car.engineSize },
    { icon: <SettingsOutlinedIcon sx={{ fontSize: 13 }} />, label: car.transmission },
    { icon: <PeopleAltOutlinedIcon sx={{ fontSize: 13 }} />, label: `${car.seats} People` },
  ];
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      {items.map((item, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
          <Box sx={{ color: 'var(--text-muted)' }}>{item.icon}</Box>
          <Typography sx={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}
