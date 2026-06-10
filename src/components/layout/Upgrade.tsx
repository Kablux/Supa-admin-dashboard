import { Box, Typography, Button } from "@mui/material";

const UpgradeBox = () => {
  return (
    <Box
      sx={{
        mx: 1.5,
        mb: 2.5,
        p: 2,
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 13,
          color: "var(--text-primary)",
          mb: 0.5,
        }}
      >
        Upgrade to Pro
      </Typography>
      <Typography
        sx={{
          fontSize: 11,
          // color: "var(--text-muted)",
          mb: 1.5,
          lineHeight: 1.5,
        }}
      >
        Unlock advanced analytics, priority support & more.
      </Typography>
      <Button
        variant="contained"
        fullWidth
        size="small"
        sx={{
          py: 0.75,
          fontWeight: 600,
          fontSize: 12,
          color: "#fff",
          backgroundColor: "var(--danger)",
          "&:hover": { backgroundColor: "var(--danger-hover)" },
        }}
      >
        Upgrade
      </Button>
    </Box>
  );
};

export default UpgradeBox;
