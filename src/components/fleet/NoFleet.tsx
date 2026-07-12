import { Box, Typography } from '@mui/material'
import { MdDirectionsCar } from 'react-icons/md'

function NoFleet() {
  return (
    <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 350,
          backgroundColor: "#161616",
          border: "2px dashed rgba(255,255,255,0.1)",
          p: 4,
          textAlign: "center",
        }}
      >
        <MdDirectionsCar size={48}  />
        <Typography
          sx={{ color: "#fff", fontSize: 24, fontWeight: 600, mt: 2 }}
        >
          No Fleet at the Moment
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.48)",
            fontSize: 16,
            mt: 1,
            maxWidth: 400,
          }}
        >
          There are currently no vehicles registered in this fleet. Please check
          back later for updates.
        </Typography>
      </Box>
  )
}

export default NoFleet
