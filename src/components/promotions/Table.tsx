import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Promotion } from "../../types/common.types";

interface PromotionsTableProps {
  promotions: {
    data: Promotion[];
    count: number;
    loading: boolean;
  };
  page: number;
  pageSize: number;
  deletingId?: string | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (promo: Promotion) => void;
  onEdit: (promo: Promotion) => void;
  onDelete: (id: string) => void;
}

const headerCellSx = {
  fontSize: 12,
  fontWeight: 500,
  // letterSpacing: "0.5px",
  color: "var(--text-secondary, #8A92A6)",
  // backgroundColor: "var(--bg-secondary)",
  borderColor: "var(--border)",
  py: 1.5,
  px: 2,
  whiteSpace: "nowrap",
} as const;

const bodyCellSx = {
  fontSize: 12,
  color: "var(--text-primary, #FFFFFF)",
  borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
  py: 1,
  px: 2,
} as const;

export default function PromotionsTable({
  promotions,
  page,
  pageSize,
  deletingId,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onEdit,
  onDelete,
}: PromotionsTableProps) {
  return (
    <TableContainer
      // component={Paper}
      // elevation={0}
      sx={{
        // backgroundColor: "var(--bg-card)",
        // border: "1px solid var(--border)",
        overflow: "hidden",
        // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>Name & Code</TableCell>
            <TableCell sx={headerCellSx}>Discount</TableCell>
            <TableCell sx={headerCellSx}>Validity Period</TableCell>
            <TableCell sx={headerCellSx}>Redemptions</TableCell>
            <TableCell sx={headerCellSx}>Status</TableCell>
            <TableCell align="right" sx={headerCellSx}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {promotions.loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ ...bodyCellSx }}>
                <CircularProgress size={28} sx={{ color: "var(--accent-gold, #FFD700)" }} />
              </TableCell>
            </TableRow>
          ) : promotions.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ ...bodyCellSx }}>
                <Typography sx={{ color: "var(--text-secondary, #8A92A6)" }}>
                  No promotions found matching query.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            promotions.data.map((promo) => (
              <TableRow
                key={promo.id}
                onClick={() => onRowClick(promo)}
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.035)",
                  },
                  "&:last-child td, &:last-child th": {
                    borderBottom: 0,
                  },
                }}
              >
                {/* Name & Code */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize:12,
                      fontWeight: 500,
                      color: "var(--text-primary, #FFF)",
                      lineHeight: 1.3,
                    }}
                  >
                    {promo.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: promo.code ? "var(--accent-gold, #FFD700)" : "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                      display: "block",
                    }}
                  >
                    {promo.code || "Automatic (No Code)"}
                  </Typography>
                </TableCell>

                {/* Discount */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                    {promo.discount_type === "PERCENTAGE"
                      ? `${Number(promo.discount_value)}% OFF`
                      : `$${Number(promo.discount_value).toFixed(2)} OFF`}
                  </Typography>
                </TableCell>

                {/* Validity Period */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 12, color: "var(--text-secondary, #C1C7D0)" }}>
                    {promo.start_date
                      ? `${new Date(promo.start_date).toLocaleDateString()} — ${promo.end_date ? new Date(promo.end_date).toLocaleDateString() : "∞"}`
                      : "Always Active"}
                  </Typography>
                </TableCell>

                {/* Redemptions */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary, #FFF)" }}>
                    {promo.redemption_count ?? 0} / {promo.max_redemptions || "∞"}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell sx={bodyCellSx}>
                  <Chip
                    label={promo.status === "active" ? "Active" : " Expired"}
                    size="small"
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      color: promo.status === "active" ? "#10B981" : "#EF4444",
                      border: "1px solid var(--border, rgba(255,255,255,0.08))",
                    }}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell align="right" sx={bodyCellSx}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(promo);
                      }}
                      sx={{ color: "var(--text-secondary, #8A92A6)" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      disabled={deletingId === promo.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(promo.id);
                      }}
                      sx={{ color: "#EF4444" }}
                    >
                      {deletingId === promo.id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={promotions.count}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        sx={{
          color: "var(--text-secondary, #C1C7D0)",
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
            fontSize: 14,
            fontWeight: 500,
          },
          ".MuiTablePagination-select": {
            fontSize: 14,
          },
          ".MuiTablePagination-actions button": {
            color: "var(--text-secondary, #C1C7D0)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          },
        }}
      />
    </TableContainer>
  );
}