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
  Box,
} from "@mui/material";

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
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (rider: Rider) => void;
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

const RidersTable: React.FC<RidersTableProps> = ({
  riders,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
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
            <TableCell sx={headerCellSx}>Name &amp; Contact</TableCell>
            <TableCell sx={headerCellSx}>Phone No</TableCell>
            <TableCell sx={headerCellSx}>Location</TableCell>
            <TableCell sx={headerCellSx}>Vehicle Info</TableCell>
            <TableCell sx={headerCellSx}>KYC Status</TableCell>
            <TableCell sx={headerCellSx}>Rating</TableCell>
            <TableCell sx={headerCellSx}>Date Joined</TableCell>
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
            riders.data.map((rider) => (
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

                {/* Date Joined */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 12, color: "var(--text-secondary, #C1C7D0)" }}>
                    {rider.date_joined ? new Date(rider.date_joined).toLocaleDateString() : "N/A"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
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
        }}
      />
    </TableContainer>
  );
};

export default RidersTable;