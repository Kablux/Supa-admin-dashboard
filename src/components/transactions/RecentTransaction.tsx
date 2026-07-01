import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
} from "@mui/material";
import { RECENT_TRANSACTIONS } from "../../data/transactionMockData";

export function RecentTransactions() {

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "background-color 0.25s",
      }}
    >
      <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid var(--border)" }}>
        <Typography
          sx={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}
        >
          Recent Transactions
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Rider/Ride", "Type", "Price", "Distance", "Date & Time"].map(
                (h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      borderBottom: "1px solid var(--border)",
                      backgroundColor: "var(--bg-secondary)",
                      py: 1.25,
                      px: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {RECENT_TRANSACTIONS.map((tx) => (
              <TableRow
                key={tx.id}
                sx={{
                  "&:last-child td": { borderBottom: "none" },
                  "&:hover": { backgroundColor: "var(--bg-card-hover)" },
                  transition: "background 0.12s",
                }}
              >
                <TableCell
                  sx={{
                    py: 1.25,
                    px: 2,
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                  >
                    <Avatar
                      src={tx.rider.avatar ?? undefined}
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: 11,
                        bgcolor: "var(--border)",
                        border: "1.5px solid var(--accent-gold)",
                      }}
                    >
                      {tx.rider.name.charAt(0)}
                    </Avatar>
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {tx.rider.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.25,
                    px: 2,
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "var(--text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {tx.type}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.25,
                    px: 2,
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "var(--text-primary)",
                      fontWeight: 600,
                    }}
                  >
                    N {tx.price.toLocaleString()}.00
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.25,
                    px: 2,
                    borderBottom: "1px solid var(--border-subtle)",
                    maxWidth: 150,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      whiteSpace: "normal",
                      lineHeight: 1.4,
                    }}
                  >
                    {tx.distance}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.25,
                    px: 2,
                    borderBottom: "1px solid var(--border-subtle)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 11.5, color: "var(--text-primary)" }}
                  >
                    {tx.dateTime}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
