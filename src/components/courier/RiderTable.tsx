import React from "react";
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
  Button,
  Box,
} from "@mui/material";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import KycStatusChip from "./KycStatusChip";
import { Rider } from "../../types/common.types";

interface RidersTableProps {
  riders: {
    data: Rider[];
    count: number;
    loading: boolean;
  };
  page: number;
  pageSize: number;
  kycApprovingId?: string | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onApproveKyc: (userId: string) => void;
  onRowClick: (rider: Rider) => void; // Added row click handler
}

const headerCellSx = {
  fontSize: 12,
  fontWeight: 500,
  // letterSpacing: "0.5px",
  color: "var(--text-secondary, #8A92A6)",
  borderColor: "var(--border)",
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

const RidersTable: React.FC<RidersTableProps> = ({
  riders,
  page,
  pageSize,
  kycApprovingId,
  onPageChange,
  onPageSizeChange,
  onApproveKyc,
  onRowClick,
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
            <TableCell sx={headerCellSx}>Name &amp; Contact</TableCell>
            <TableCell sx={headerCellSx}>Phone No</TableCell>
            <TableCell sx={headerCellSx}>Location</TableCell>
            <TableCell sx={headerCellSx}>Vehicle Info</TableCell>
            <TableCell sx={headerCellSx}>KYC Status</TableCell>
            <TableCell sx={headerCellSx}>Rating</TableCell>
            <TableCell align="right" sx={headerCellSx}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {riders.loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={bodyCellSx}>
                <Box sx={{ py: 4 }}>
                  <CircularProgress size={28} sx={{ color: "var(--accent-gold, #FEB914)" }} />
                </Box>
              </TableCell>
            </TableRow>
          ) : riders.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={bodyCellSx}>
                <Typography sx={{ py: 4, color: "var(--text-secondary, #8A92A6)", fontSize: 14 }}>
                  No riders found matching query.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            riders.data.map((rider) => {
              const isVerified = rider.kyc_status === "VERIFIED";
              const isEligibleForApproval = !isVerified;

              return (
                <TableRow
                  key={rider.id}
                  onClick={() => onRowClick(rider)}
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.025)" },
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                  }}
                >
                  {/* Name & Contact */}
                  <TableCell sx={bodyCellSx}>
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "var(--text-primary, #FFF)",
                        lineHeight: 1.3,
                      }}
                    >
                      {rider.first_name} {rider.last_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: "var(--text-muted, #8A92A6)",
                        mt: 0.25,
                        display: "block",
                      }}
                    >
                      {rider.email}
                    </Typography>
                  </TableCell>

                  {/* Phone */}
                  <TableCell sx={bodyCellSx}>
                    <Typography sx={{ fontSize: 12, color: "var(--text-secondary, #C1C7D0)" }}>
                      {rider.phone_number || "N/A"}
                    </Typography>
                  </TableCell>

                  {/* Location */}
                  <TableCell sx={bodyCellSx}>
                    <Typography sx={{ fontSize: 12, color: "var(--text-secondary, #C1C7D0)" }}>
                      {rider.city || "N/A"}
                    </Typography>
                  </TableCell>

                  {/* Vehicle Info */}
                  <TableCell sx={bodyCellSx}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--text-primary, #FFF)",
                        textTransform: "capitalize",
                      }}
                    >
                      {rider.vehicle_type ? rider.vehicle_type.toLowerCase() : "—"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: "var(--text-muted, #8A92A6)",
                        mt: 0.25,
                      }}
                    >
                      {rider.vehicle_registration_number || "No plate number"}
                    </Typography>
                  </TableCell>

                  {/* KYC Status */}
                  <TableCell sx={bodyCellSx}>
                    <KycStatusChip status={rider.kyc_status} />
                  </TableCell>

                  {/* Rating */}
                  <TableCell sx={bodyCellSx}>
                    <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                      {rider.rating ? `⭐ ${rider.rating.toFixed(1)}` : "N/A"}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right" sx={bodyCellSx}>
                    <Button
                      size="small"
                      disabled={!isEligibleForApproval || kycApprovingId === rider.id}
                      startIcon={
                        kycApprovingId === rider.id ? (
                          <CircularProgress size={12} color="inherit" />
                        ) : (
                          <VerifiedUserIcon sx={{ fontSize: 13 }} />
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation(); 
                        if (isEligibleForApproval) onApproveKyc(rider.id);
                      }}
                      sx={{
                        minWidth: 112,
                        height: 30,
                        px: 1.5,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "none",
                        letterSpacing: "0.1px",
                        borderRadius: "7px",
                        backgroundColor: isVerified
                          ? "rgba(52, 211, 153, 0.10)"
                          : "#FFBE18",
                        color: isVerified ? "#34D399" : "#17130A",
                        border: isVerified
                          ? "1px solid rgba(52, 211, 153, 0.22)"
                          : "1px solid rgba(255, 190, 24, 0.35)",
                        boxShadow: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          backgroundColor: isVerified
                            ? "rgba(52, 211, 153, 0.15)"
                            : "#F4B400",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: isVerified
                            ? "rgba(52, 211, 153, 0.10)"
                            : "rgba(255, 255, 255, 0.045)",
                          color: isVerified ? "#34D399" : "#778196",
                        },
                      }}
                    >
                      {kycApprovingId === rider.id
                        ? "Approving..."
                        : isVerified
                        ? "Verified"
                        : "Approve KYC"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={riders.count}
        page={Math.max(0, page)}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
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

export default RidersTable;