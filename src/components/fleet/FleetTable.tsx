import {
  Avatar,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { PremiumTransaction } from "../../types/common.types";
import { FleetOwner } from "./../../types/common.types";

interface Props {
  data: FleetOwner[];
  isLoading: boolean;
}

export default function FleetTransactionsTable({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress size={28} sx={{ color: "var(--accent-gold)" }} />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
          px: 3,
          my: 4,
          maxWidth: 450,
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "rgba(255,193,7,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <ReceiptLongIcon
            sx={{
              fontSize: 40,
              color: "var(--accent-gold)",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--text-primary)",
            mb: 1,
          }}
        >
          No Transactions Found
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          Fleet transactions will appear here once activity is recorded.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {["Name", "Date", "Car Name", "Car Qty", "Earning", "Action"].map(
              (header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    borderBottom: "1px solid var(--text-secondary)",
                    borderTop: "1px solid var(--text-secondary)",
                    p: 1.25,
                    whiteSpace: "nowrap",
                  }}
                >
                  {header}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((transaction) => (
            <TableRow
              key={transaction.id}
              sx={{
                "&:last-child td": {
                  borderBottom: "none",
                },
                "&:hover": {
                  backgroundColor: "var(--bg-card-hover)",
                },
              }}
            >
              {/* Name */}
              <TableCell
                sx={{
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                  }}
                >
                  <Avatar
                    src={transaction.avatar}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "var(--border)",
                    }}
                  >
                    {transaction.name[0]}
                  </Avatar>

                  <Typography
                    sx={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {transaction.name}
                  </Typography>
                </Box>
              </TableCell>

              {/* Date */}
              <TableCell
                sx={{
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "var(--text-primary)",
                  }}
                >
                  {transaction.date}
                </Typography>
              </TableCell>

              {/* Pickup */}
              <TableCell
                sx={{
                  maxWidth: 180,
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    whiteSpace: "normal",
                  }}
                >
                  {transaction.car}
                </Typography>
              </TableCell>

              {/* Destination */}
              <TableCell
                sx={{
                  maxWidth: 180,
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    whiteSpace: "normal",
                  }}
                >
                  {transaction.quantity}
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    whiteSpace: "normal",
                  }}
                >
                  {transaction.earning}
                </Typography>
              </TableCell>

              {/* Action */}
              <TableCell
                sx={{
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
