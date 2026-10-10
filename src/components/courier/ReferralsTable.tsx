import React from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

interface ReferralPerson {
  first_name?: string;
  last_name?: string;
  email?: string;
  referral_code?: string;
}

interface Referral {
  id: string;
  referrer?: ReferralPerson;
  referred?: ReferralPerson;
  created_at: string;
}

interface ReferralsTableProps {
  referrals: {
    data: Referral[];
    count: number;
    loading: boolean;
  };

  page: number;
  pageSize: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const headerCellSx = {
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.5px",
  color: "var(--text-secondary, #8A92A6)",
  backgroundColor: "var(--bg-secondary, #161B26)",
  borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
  py: 1.5,
  px: 2,
  whiteSpace: "nowrap",
} as const;

const bodyCellSx = {
  fontSize: 14,
  color: "var(--text-primary, #FFFFFF)",
  borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
  py: 4,
  px: 2,
} as const;

const ReferralsTable: React.FC<ReferralsTableProps> = ({
  referrals,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        backgroundColor: "var(--bg-card, #11141D)",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>Referrer</TableCell>
            <TableCell sx={headerCellSx}>Referred User</TableCell>
            <TableCell sx={headerCellSx}>Referrer Code</TableCell>
            <TableCell sx={headerCellSx}>Created Date</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {referrals.loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ ...bodyCellSx }}>
                <CircularProgress
                  size={28}
                  sx={{ color: "var(--accent-gold, #FFD700)" }}
                />
              </TableCell>
            </TableRow>
          ) : referrals.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ ...bodyCellSx }}>
                <Typography sx={{ color: "var(--text-secondary, #8A92A6)" }}>
                  No referral links found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            referrals.data.map((ref) => (
              <TableRow
                key={ref.id}
                sx={{
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
                  },
                  "&:last-child td, &:last-child th": {
                    borderBottom: 0,
                  },
                }}
              >
                {/* Referrer */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-primary, #FFF)",
                      lineHeight: 1.3,
                    }}
                  >
                    {ref.referrer?.first_name || "—"}{" "}
                    {ref.referrer?.last_name || ""}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                      display: "block",
                    }}
                  >
                    {ref.referrer?.email || "—"}
                  </Typography>
                </TableCell>

                {/* Referred User */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-primary, #FFF)",
                      lineHeight: 1.3,
                    }}
                  >
                    {ref.referred?.first_name || "—"}{" "}
                    {ref.referred?.last_name || ""}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                      display: "block",
                    }}
                  >
                    {ref.referred?.email || "—"}
                  </Typography>
                </TableCell>

                {/* Referrer Code */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontFamily: "monospace",
                      color: ref.referrer?.referral_code
                        ? "var(--accent-gold, #FFD700)"
                        : "var(--text-muted, #8A92A6)",
                    }}
                  >
                    {ref.referrer?.referral_code || "—"}
                  </Typography>
                </TableCell>

                {/* Created Date */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-secondary, #C1C7D0)",
                    }}
                  >
                    {ref.created_at
                      ? new Date(ref.created_at).toLocaleDateString()
                      : "—"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={referrals.count}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) =>
          onPageSizeChange(parseInt(e.target.value, 10))
        }
        sx={{
          color: "var(--text-secondary, #C1C7D0)",
          borderTop: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
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
};

export default ReferralsTable;