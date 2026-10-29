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
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Transaction } from "../../types/common.types";

interface TransactionsTableProps {
  isLoading: boolean;
  transactions: Transaction[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export default function TransactionsTable({
  isLoading,
  transactions,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TransactionsTableProps) {
  return (
    <Box
      sx={{
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2.5, borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
         Transactions
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} sx={{ color: "var(--accent-gold, #FEB914)" }} />
        </Box>
      ) : transactions.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
          <ReceiptLongIcon sx={{ fontSize: 48, color: "var(--text-secondary)", mb: 1, opacity: 0.5 }} />
          <Typography sx={{  fontWeight: 600, mb: 0.5 }}>No Transactions Found</Typography>
          <Typography sx={{ fontSize: 14, color: "var(--text-secondary)" }}>
            There are no transactions matching your criteria.
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
                {[" User", "Reference ID", "Type", "Channel", "Amount", "Status", "Created Date"].map((h) => (
                  <TableCell
                    key={h}
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
                const formattedAmount = `${isCredit ? "+" : "-"}₦${Math.abs(Number(tx.amount) || 0).toLocaleString()}`;

                return (
                  <TableRow
                    key={tx.id}
                    sx={{
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
                        label={tx.type}
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
                        {tx.channel || "N/A"}
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
                        label={tx.status}
                        size="small"
                        sx={{
                          fontSize: 12,
                          height: 20,
                          fontWeight: 600,
                          backgroundColor:
                            tx.status === "success" || tx.status === "completed"
                              ? "rgba(52, 211, 153, 0.1)"
                              : tx.status === "pending"
                              ? "rgba(254, 185, 20, 0.1)"
                              : "rgba(239, 68, 68, 0.1)",
                          color:
                            tx.status === "success" || tx.status === "completed"
                              ? "#34D399"
                              : tx.status === "pending"
                              ? "#FEB914"
                              : "#EF4444",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ py: 1.5, px: 2, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : "N/A"}
                      </Typography>
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