import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { SavingMode } from "../../utils/useGlobalConfigForm";

interface Props {
  hydrating: boolean;
  isDirty: boolean;
  saving: SavingMode;
  onDiscard: () => void;
  onSave: (mode: "save" | "continue") => void;
}

export default function SettingsActionBar({
  hydrating,
  isDirty,
  saving,
  onDiscard,
  onSave,
}: Props) {
  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        mt: 3,
        mx: -0.5,
        px: 3,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        borderRadius: "14px",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {hydrating && (
          <CircularProgress size={14} sx={{ color: "var(--text-secondary)" }} />
        )}
        <Typography
          sx={{
            fontSize: 13,
            color:
              isDirty && !hydrating
                ? "var(--accent-gold, #FFD700)"
                : "var(--text-secondary)",
            fontWeight: isDirty && !hydrating ? 600 : 400,
          }}
        >
          {hydrating
            ? "Loading current config…"
            : isDirty
              ? "You have unsaved changes"
              : "All changes saved"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1.5 }}>
        {isDirty && (
          <Button
            onClick={onDiscard}
            disabled={!!saving}
            sx={{
              textTransform: "none",
              fontSize: 13.5,
              fontWeight: 600,
              borderRadius: "10px",
              px: 2,
              height: 42,
              color: "var(--text-secondary)",
              "&:hover": {
                color: "var(--text-primary)",
                backgroundColor: "rgba(255,255,255,0.03)",
              },
            }}
          >
            Discard
          </Button>
        )}
        <Button
          onClick={() => onSave("continue")}
          disabled={!isDirty || !!saving}
          sx={{
            textTransform: "none",
            fontSize: 13.5,
            fontWeight: 600,
            borderRadius: "10px",
            px: 2.5,
            height: 42,
            color: "var(--text-primary)",
            border: "1px solid var(--border, rgba(255,255,255,0.15))",
            "&:hover": {
              borderColor: "rgba(255,255,255,0.3)",
              backgroundColor: "rgba(255,255,255,0.03)",
            },
            "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
          }}
        >
          {saving === "continue" ? (
            <CircularProgress size={18} sx={{ color: "inherit" }} />
          ) : (
            "Save and continue"
          )}
        </Button>
        <Button
          onClick={() => onSave("save")}
          disabled={!isDirty || !!saving}
          sx={{
            textTransform: "none",
            fontSize: 13.5,
            fontWeight: 700,
            borderRadius: "10px",
            px: 3,
            height: 42,
            backgroundColor: "var(--accent-gold, #FFD700)",
            color: "#000",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "var(--accent-gold, #FFD700)",
              boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.4)",
            },
          }}
        >
          {saving === "save" ? (
            <CircularProgress size={18} sx={{ color: "#000" }} />
          ) : (
            "Save"
          )}
        </Button>
      </Box>
    </Box>
  );
}