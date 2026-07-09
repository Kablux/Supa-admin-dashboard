import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { BALANCES } from "../../data/transactionMockData";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StarIcon from "@mui/icons-material/Star";

const BALANCE_ICONS: Record<string, React.ReactElement> = {
  AccountBalanceWallet: <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />,
  LocalShipping: <LocalShippingIcon sx={{ fontSize: 20 }} />,
  Star: <StarIcon sx={{ fontSize: 20 }} />,
};

const BALANCE_ACCENT: Record<string, string> = {
  corporate: "#F5C518",
  fleet: "#42A5F5",
  luxury: "#4CAF50",
};

export function BalanceSection() {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 2.5, py: 1.75, borderBottom: "1px solid var(--border)" }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 15,
            color: "var(--text-primary)",
          }}
        >
          Balance
        </Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {BALANCES.map((b, i) => {
          const accent = BALANCE_ACCENT[b.id];
          return (
            <Box
              key={b.id}
              sx={{
                p: 2.25,
                borderRight:
                  i < BALANCES.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 1.75,
                "&:hover": { backgroundColor: "var(--bg-card-hover)" },
                transition: "background 0.15s",
                cursor: "default",
              }}
            >
              {/* Donut icon */}
              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: 46,
                  height: 46,
                }}
              >
                <svg width="46" height="46" viewBox="0 0 46 46">
                  <circle
                    cx="23"
                    cy="23"
                    r="20"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="23"
                    cy="23"
                    r="20"
                    fill="none"
                    stroke={accent}
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 20 * 0.7} ${2 * Math.PI * 20 * 0.3}`}
                    strokeLinecap="round"
                    transform="rotate(-90 23 23)"
                    opacity={0.9}
                  />
                </svg>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accent,
                  }}
                >
                  {BALANCE_ICONS[b.icon]}
                </Box>
              </Box>

              <Box>
                <Typography
                  sx={{ fontSize: 11.5, color: "var(--text-muted)", mb: 0.25 }}
                >
                  {b.label}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.25px",
                  }}
                >
                  {b.delta !== undefined && b.delta > 0 ? "+" : ""}N
                  {b.amount.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
