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
} from "@mui/material";
import { TbMapPinQuestion } from "react-icons/tb";
import { RideRequestList } from "../../types/common.types";

interface RideRequestTableProps {
  isLoading: boolean;
  rideRequestList: RideRequestList[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onViewRequest: (rideId: string) => void;
}

export default function RideRequestTable({
  isLoading,
  rideRequestList,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewRequest,
}: RideRequestTableProps) {
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
      ) : rideRequestList.length === 0 ? (
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
            <TbMapPinQuestion size={32} />
          </Box>

          <Typography
            sx={{ fontSize: 18, fontWeight: 600, mb: 1 }}
          >
            No Request Found
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "secondary.main",
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            No request match this Profile by filter.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  "Id",
                  "Rider",
                  "Status",
                  "Type",
                  "Payment Method",
                  "Created At",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      borderBottom: "1px solid var(--text-secondary)",
                      borderTop: "1px solid var(--text-secondary)",
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
              {rideRequestList.map((ride) => (
                <TableRow
                  key={ride.id}
                  onClick={() => onViewRequest(ride.id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "var(--bg-card-hover)",
                    },
                    transition: "background 0.12s",
                  }}
                >
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
                      maxWidth: 220,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      {ride.id}
                    </Typography>
                  </TableCell>

                  {/*Rider*/}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
                      maxWidth: 220,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "var(--text-primary)",
                      }}
                    >
                      {ride.rider}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
                      maxWidth: 220,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        whiteSpace: "normal",
                        lineHeight: 1.4,
                      }}
                    >
                      {ride.status}
                    </Typography>
                  </TableCell>

                  {/* Type */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {`${ride.type}`}
                    </Typography>
                  </TableCell>

                  {/* Payment */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "var(--text-primary)",
                      }}
                    >
                      {ride.payment_method}
                    </Typography>
                  </TableCell>

                  {/* Created */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
                      width: 50,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ride.created_at
                        ? new Date(ride.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Server-Side Pagination Controller */}
      {!isLoading && rideRequestList.length > 0 && (
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
            color: "rgba(255,255,255,0.6)",
            "& .MuiTablePagination-actions": { color: "var(--accent-gold)" },
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        />
      )}
    </Box>
  );
}
