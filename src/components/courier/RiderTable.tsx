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
  Button,
  Box,
} from "@mui/material";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import KycStatusChip from "./KycStatusChip";

interface Rider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
  state: string;
  vehicle_type: string;
  vehicle_registration_number: string;
  kyc_status: string;
  is_approved: boolean;
  rating?: number;
}

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

const RidersTable: React.FC<RidersTableProps> = ({
  riders,
  page,
  pageSize,
  kycApprovingId,
  onPageChange,
  onPageSizeChange,
  onApproveKyc,
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
            <TableCell sx={headerCellSx}>Name & Contact</TableCell>
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
              <TableCell colSpan={6} align="center" sx={{ ...bodyCellSx }}>
                <CircularProgress size={28} sx={{ color: "var(--accent-gold, #FFD700)" }} />
              </TableCell>
            </TableRow>
          ) : riders.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ ...bodyCellSx }}>
                <Typography sx={{ color: "var(--text-secondary, #8A92A6)" }}>
                  No riders found matching query.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            riders.data.map((rider) => (
              <TableRow
                key={rider.id}
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
                {/* Name & Contact */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-primary, #FFF)",
                      lineHeight: 1.3,
                    }}
                  >
                    {rider.first_name} {rider.last_name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                      display: "block",
                    }}
                  >
                    {rider.email} {rider.phone_number ? `• ${rider.phone_number}` : ""}
                  </Typography>
                </TableCell>

                {/* Location */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 14, color: "var(--text-secondary, #C1C7D0)" }}>
                    {rider.city || "—"}{rider.state ? `, ${rider.state}` : ""}
                  </Typography>
                </TableCell>

                {/* Vehicle Info */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-primary, #FFF)",
                      textTransform: "capitalize",
                    }}
                  >
                    {rider.vehicle_type ? rider.vehicle_type.toLowerCase() : "—"}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                    }}
                  >
                    {rider.vehicle_registration_number || "No plate number"}
                  </Typography>
                </TableCell>

                {/* KYC Status */}
                <TableCell sx={bodyCellSx}>
                  <KycStatusChip
                    status={rider.kyc_status}
                    isApproved={rider.is_approved}
                  />
                </TableCell>

                {/* Rating */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                    {rider.rating ? `⭐ ${rider.rating.toFixed(1)}` : "N/A"}
                  </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell align="right" sx={bodyCellSx}>
                  {!rider.is_approved &&
                    (rider.kyc_status === "UNDER_REVIEW" ||
                      rider.kyc_status === "NEEDS_RESUBMISSION") && (
                      <Button
                        size="small"
                        disabled={kycApprovingId === rider.id}
                        startIcon={
                          kycApprovingId === rider.id ? (
                            <CircularProgress size={12} color="inherit" />
                          ) : (
                            <VerifiedUserIcon sx={{ fontSize: 14 }} />
                          )
                        }
                        onClick={() => onApproveKyc(rider.id)}
                        sx={{
                          height: 30,
                          px: 1.5,
                          fontSize: 14,
                          fontWeight: 500,
                          textTransform: "none",
                          borderRadius: "6px",
                          backgroundColor: "#10B981",
                          color: "#FFF",
                          boxShadow: "none",
                          whiteSpace: "nowrap",
                          "&:hover": {
                            backgroundColor: "#059669",
                            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                          },
                          "&.Mui-disabled": {
                            backgroundColor: "rgba(16, 185, 129, 0.3)",
                            color: "rgba(255,255,255,0.5)",
                          },
                        }}
                      >
                        {kycApprovingId === rider.id ? "Approving..." : "Approve KYC"}
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={riders.count}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
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

export default RidersTable;