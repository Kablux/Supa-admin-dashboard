import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Rating,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
} from "@mui/material";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import { Driver } from "../../types/auth";

interface DriversTableProps {
  isLoading: boolean;
  driversList: Driver[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onViewDriver: (driverId: string) => void;
  selectedDriverIds?: string[];
  onSelectDriver?: (driverId: string) => void;
  onSelectAll?: (driverIds: string[]) => void;
}

const getKycChipStyles = (status?: string) => {
  const normalized = status?.toUpperCase() || "PENDING";

  switch (normalized) {
    case "APPROVED":
      return {
        label: "Approved",
        backgroundColor: "rgba(16, 185, 129, 0.07)",
        color: "#34d399c4",
        border: "1px solid rgba(16, 185, 129, 0.25)",
      };
    case "IN_REVIEW":
    case "UNDER_REVIEW":
      return {
        label: "In Review",
        backgroundColor: "rgba(59, 131, 246, 0.082)",
        color: "#60a5fac8",
        border: "1px solid rgba(59, 131, 246, 0.13)",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        backgroundColor: "rgba(239, 68, 68, 0.12)",
        color: "#f87171c0",
        border: "1px solid rgba(239, 68, 68, 0.049)",
      };
    case "PENDING":
    default:
      return {
        label: "Pending",
        backgroundColor: "rgba(245, 158, 11, 0.12)",
        color: "#fbbe24ce",
        border: "1px solid rgba(245, 159, 11, 0.111)",
      };
  }
};

export default function DriversTable({
  isLoading,
  driversList,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDriver,
  selectedDriverIds = [],
  onSelectDriver,
  onSelectAll,
}: DriversTableProps) {
  const isAllSelected =
    driversList.length > 0 &&
    driversList.every((d) => selectedDriverIds.includes(d.id));

  const isSomeSelected =
    driversList.some((d) => selectedDriverIds.includes(d.id)) && !isAllSelected;

  const handleHeaderCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!onSelectAll) return;
    if (event.target.checked) {
      const allIdsOnPage = driversList.map((d) => d.id);
      onSelectAll(allIdsOnPage);
    } else {
      onSelectAll([]);
    }
  };

  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress size={28} sx={{ color: "var(--accent-gold)" }} />
        </Box>
      ) : driversList.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            px: 3,
            my: 4,
            mx: "auto",
            maxWidth: 450,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 193, 7, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <DriveEtaIcon />
          </Box>

          <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 1 }}>
            No Driver Found
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "secondary.main",
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            No driver profiles match your current filter
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
          }}
        >
          <Table size="small" sx={{ minWidth: 1000, width: "100%", tableLayout: "auto" }}>
            <TableHead>
              <TableRow>
                {/* Select All Checkbox */}
                <TableCell
                  padding="checkbox"
                  sx={{
                    borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
                    borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
                    p: 1.25,
                  }}
                >
                  <Checkbox
                    size="small"
                    indeterminate={isSomeSelected}
                    checked={isAllSelected}
                    onChange={handleHeaderCheckboxChange}
                    sx={{
                      color: "var(--text-secondary)",
                      "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                        color: "var(--accent-gold)",
                      },
                    }}
                  />
                </TableCell>

                {[
                  "Name",
                  "Phone Number",
                  "Address",
                  "KYC Status",
                  "Completed Rides",
                  "Ratings",
                ].map((header) => (
                  <TableCell
                    key={header}
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
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {driversList.map((driver) => {
                const isSelected = selectedDriverIds.includes(driver.id);
                const kycStyle = getKycChipStyles(driver.kyc_status);

                return (
                  <TableRow
                    key={driver.id}
                    onClick={() => onViewDriver(driver.id)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: isSelected
                        ? "rgba(254, 185, 20, 0.04)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isSelected
                          ? "rgba(254, 185, 20, 0.08)"
                          : "rgba(255, 255, 255, 0.025)",
                      },
                      transition: "background 0.12s",
                    }}
                  >
                    {/* Checkbox Cell */}
                    <TableCell
                      padding="checkbox"
                      onClick={(e) => e.stopPropagation()}
                      sx={{ borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.055))", p: 1.25 }}
                    >
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => onSelectDriver?.(driver.id)}
                        sx={{
                          color: "var(--text-secondary)",
                          "&.Mui-checked": {
                            color: "var(--accent-gold)",
                          },
                        }}
                      />
                    </TableCell>

                    {/* Profile */}
                    <TableCell
                      sx={{
                        p: 1.25,
                        borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.055))",
                        maxWidth: 220,
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
                          src={(driver as any).profile_picture_url || (driver as any).profile_picture}
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 12,
                            bgcolor: "var(--border)",
                          }}
                        >
                          {driver.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 12.5,
                              fontWeight: 600,
                              color: "var(--text-primary, #FFF)",
                            }}
                            noWrap
                          >
                            {driver.full_name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "var(--text-secondary, #8A92A6)",
                            }}
                            noWrap
                          >
                            {driver.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Phone */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.055))",
                        maxWidth: 220,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "var(--text-primary, #FFF)",
                        }}
                      >
                        {driver.phone_number || "N/A"}
                      </Typography>
                    </TableCell>

                    {/* Address */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.055))",
                        maxWidth: 220,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "var(--text-secondary, #C1C7D0)",
                          whiteSpace: "normal",
                          lineHeight: 1.4,
                        }}
                      >
                        {driver.address || "No Address Added"}
                      </Typography>
                    </TableCell>

                    {/* KYC Status */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.055))",
                      }}
                    >
                      <Chip
                        label={kycStyle.label}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius:"4px",
                          backgroundColor: kycStyle.backgroundColor,
                          color: kycStyle.color,
                          border: kycStyle.border,
                        }}
                      />
                    </TableCell>

                    {/* Completed Rides */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.055))",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--text-primary, #FFF)",
                        }}
                      >
                        {driver.completed_rides || 0}
                      </Typography>
                    </TableCell>

                    {/* Rating */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.055))",
                      }}
                    >
                      <Rating
                        readOnly
                        value={parseFloat(driver.rating || "0")}
                        precision={0.5}
                        size="small"
                        sx={{
                          color: "var(--accent-gold, #FEB914)",
                          fontSize: 14,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Server-Side Pagination Controller */}
      {!isLoading && driversList.length > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage - 1}
          onPageChange={onPageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            onPageSizeChange(parseInt(e.target.value, 10));
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            color: "var(--text-secondary, #C1C7D0)",
            "& .MuiTablePagination-actions": { color: "var(--accent-gold)" },
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        />
      )}
    </Box>
  );
}