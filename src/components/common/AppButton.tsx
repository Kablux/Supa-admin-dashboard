import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export default function AppButton({
  children,
  loading = false,
  disabled,
  sx,
  ...props
}: AppButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      sx={[
        {
          py: 1,
          px: 2.5,
          borderRadius: "8px",
          backgroundColor: "var(--accent-gold)",
          color: "#000",
          fontSize: 14,
          fontWeight: 500,
          textTransform: "none",
          transition: "all .2s ease",
          border: "1px solid var(--accent-gold-dim)",
          "&:hover": {
            backgroundColor: "var(--accent-gold-hover)", 
            transform: "translateY(-1px)",
            boxShadow: "0 8px 20px var(--accent-gold-glow)",
          },
          
          "&:active": {
            backgroundColor: "var(--accent-gold-dimmer)",
            transform: "translateY(0)",
            boxShadow: "none",
            transition: "all .1s ease",
          },

          "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.35)",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx ? sx : {}]),
      ]}
      {...props}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: "inherit" }} />
      ) : (
        children
      )}
    </Button>
  );
}