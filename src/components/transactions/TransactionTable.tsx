import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Transaction } from "../../types/common.types";
import { formatStatusLabel, isAwaitingApproval, statusColors } from "./withdrawalConfig";

interface TransactionsTableProps {
  isLoading: boolean;
  transactions: Transaction[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onRowClick?: (tx: Transaction) => void;
  title?: string;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function TransactionsTable({
  isLoading,
  transactions,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  title = "Transactions",
  emptyTitle = "No Transactions Found",
  emptyMessage = "There are no transactions matching your criteria.",
}: TransactionsTableProps) {
  return (
    <Box
      sx={{
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
          {title}
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} sx={{ color: "var(--accent-gold, #FEB914)" }} />
        </Box>
      ) : transactions.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
          <ReceiptLongIcon sx={{ fontSize: 48, color: "var(--text-secondary)", mb: 1, opacity: 0.5 }} />
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{emptyTitle}</Typography>
          <Typography sx={{ fontSize: 14, color: "var(--text-secondary)" }}>
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <TableContainer
         sx={{
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { height: 5 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 10,
            },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["User", "Reference ID", "Type", "Channel", "Amount", "Status", "Created Date", ""].map((h, i) => (
                  <TableCell
                    key={h || i}
                   sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
                      borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
                      p: 1.25,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {transactions.map((tx) => {
                const isCredit = tx.direction === "credit";
                const awaiting = isAwaitingApproval(tx);
                const { bg, fg } = statusColors(tx.status);
                const formattedAmount = `${isCredit ? "+" : "-"}₦${Math.abs(Number(tx.amount) || 0).toLocaleString()}`;

                return (
                  <TableRow
                    key={tx.id}
                    hover={!!onRowClick}
                    onClick={onRowClick ? () => onRowClick(tx) : undefined}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.02)" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        {tx.user_name || "Unknown User"}
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
                        {tx.user_email || "No email"}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Typography sx={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-secondary)" }}>
                        {tx.reference || tx.id.slice(0, 8)}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Chip
                        label={tx.type?.replace(/_/g, " ")}
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                          fontSize: 12,
                          height: 20,
                          backgroundColor: "rgba(255,255,255,0.05)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Typography sx={{ fontSize: 12,textTransform:"capitalize", color: "var(--text-secondary)" }}>
                        {tx.channel?.replace(/_/g, " ") || "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: isCredit ? "#34D399" : "#EF4444",
                        }}
                      >
                        {formattedAmount}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Chip
                        label={formatStatusLabel(tx.status)}
                        size="small"
                        sx={{
                          fontSize: 12,
                          height: 20,
                          fontWeight: 600,
                          textTransform: "capitalize",
                          backgroundColor: bg,
                          color: fg,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : "N/A"}
                      </Typography>
                      {tx.created_at && (
                        <Typography sx={{ fontSize: 11, color: "var(--text-secondary)", opacity: 0.7 }}>
                          {new Date(tx.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }} align="right">
                      {awaiting && onRowClick && (
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(tx);
                          }}
                          sx={{
                            textTransform: "none",
                            fontSize: 12,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            color: "var(--accent-gold, #FEB914)",
                            border: "1px solid var(--accent-gold, #FEB914)",
                            borderRadius: "6px",
                            px: 1.5,
                            py: 0.25,
                          }}
                        >
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!isLoading && transactions.length > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage - 1}
          onPageChange={onPageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            color: "var(--text-secondary)",
            "& .MuiTablePagination-actions": { color: "var(--accent-gold, #FEB914)" },
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        />
      )}
    </Box>
  );
}