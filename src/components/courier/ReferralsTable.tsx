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
  color: "var(--text-secondary, #8A92A6)",
  backgroundColor: "var(--bg-secondary, #161B26)",
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

const ReferralsTable: React.FC<ReferralsTableProps> = ({
  referrals,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
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
             <Table size="small" 
             sx={{
             minWidth: 1000,
             width: "100%",
             tableLayout: "auto",
           }}>
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
                      backgroundColor: "rgba(255, 255, 255, 0.035)",
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
                    {ref.referrer?.first_name }{" "}
                    {ref.referrer?.last_name || "N/A"}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                      display: "block",
                    }}
                  >
                    {ref.referrer?.email || "N/A"}
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
                    {ref.referred?.first_name }{" "}
                    {ref.referred?.last_name || "N/A"}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                      display: "block",
                    }}
                  >
                    {ref.referred?.email || "N/A"}
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
                    {ref.referrer?.referral_code || "N/A"}
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
                      : "N/A"}
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
          width: "100%",
          color: "var(--text-secondary, #C1C7D0)",
          "& .MuiTablePagination-actions": { color: "var(--accent-gold)" },
          // borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      />
    </TableContainer>
  );
};

export default ReferralsTable;