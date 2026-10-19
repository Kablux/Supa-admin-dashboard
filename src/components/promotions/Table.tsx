import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Promotion } from "../../types/common.types";

const headerCellSx = {
  fontSize: 12,
  fontWeight: 500,
  color: "var(--text-secondary, #8A92A6)",
  borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
  py: 1.5,
  px: 2,
  whiteSpace: "nowrap",
} as const;

const bodyCellSx = {
  fontSize: 12,
  color: "var(--text-primary, #FFFFFF)",
  borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
  py: 1.5,
  px: 2,
} as const;

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
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          height: 5,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 10,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Table
        size="small"
        sx={{
          minWidth: 1000,
          width: "100%",
          tableLayout: "auto",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>Name &amp; Code</TableCell>
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
              <TableCell colSpan={6} align="center" sx={bodyCellSx}>
                <Box sx={{ py: 4 }}>
                  <CircularProgress
                    size={28}
                    sx={{ color: "var(--accent-gold, #FEB914)" }}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ) : promotions.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={bodyCellSx}>
                <Typography
                  sx={{
                    py: 4,
                    color: "var(--text-secondary, #8A92A6)",
                    fontSize: 14,
                  }}
                >
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
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
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
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--text-primary, #FFF)",
                      lineHeight: 1.3,
                    }}
                  >
                    {promo.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      fontFamily: "monospace",
                      color: promo.code
                        ? "var(--accent-gold, #FFD700)"
                        : "var(--text-muted, #8A92A6)",
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
                      : `₦${Number(promo.discount_value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} OFF`}
                  </Typography>
                </TableCell>

                {/* Validity Period */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{ fontSize: 12, color: "var(--text-secondary, #C1C7D0)" }}
                  >
                    {promo.start_date
                      ? `${new Date(promo.start_date).toLocaleDateString()} — ${
                          promo.end_date
                            ? new Date(promo.end_date).toLocaleDateString()
                            : "∞"
                        }`
                      : "Always Active"}
                  </Typography>
                </TableCell>

                {/* Redemptions */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-primary, #FFF)",
                    }}
                  >
                    {promo.redemption_count ?? 0} /{" "}
                    {promo.max_redemptions || "∞"}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell sx={bodyCellSx}>
                  <Chip
                    label={promo.status === "active" ? "Active" : "Expired"}
                    size="small"
                    sx={{
                      fontSize: 11,
                      fontWeight: 500,
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      color: promo.status === "active" ? "#10B981" : "#EF4444",
                      border:
                        "1px solid var(--border, rgba(255,255,255,0.08))",
                    }}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell align="right" sx={bodyCellSx}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 0.5,
                    }}
                  >
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
        page={Math.max(0, page)}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) =>
          onPageSizeChange(parseInt(e.target.value, 10))
        }
        sx={{
          color: "var(--text-secondary, #C1C7D0)",
          "& .MuiTablePagination-actions": { color: "var(--accent-gold)" },
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      />
    </TableContainer>
  );
}