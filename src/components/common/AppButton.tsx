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
      disabled={disabled}
      sx={[
        {
          py: 1.2,
          px: 4,
          borderRadius: "14px",
          backgroundColor: "var(--accent-gold)",
          color: "#000",
          fontSize: 14,
          fontWeight: 500,
          textTransform: "none",
          transition: "all .2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 10px 25px rgba(245, 197, 24, 0.114)",
          },

          "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.35)",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
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
