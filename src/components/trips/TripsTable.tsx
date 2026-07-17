import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Trip } from "../../types/auth";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";

interface TripsTableProps {
  isLoading: boolean;
  tripsList: Trip[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onViewTrip: (tripId: string) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export default function TripsTable({
  isLoading,
  tripsList,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewTrip,
}: TripsTableProps) {
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
      ) : tripsList.length === 0 ? (
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
            <RouteOutlinedIcon
              sx={{ fontSize: 40, color: "var(--accent-gold, #FFC107)" }}
            />
          </Box>

          <Typography
            sx={{ fontSize: 18, fontWeight: 600, color: "#fff", mb: 1 }}
          >
            No Trips Found
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            There are currently no trips matching this status or filter
            criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Name",
                    "Date",
                    "Pick up",
                    "Destination",
                    "Status",
                    "TripType",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontSize: 14,
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
                {tripsList.map((trip) => (
                  <TableRow
                    key={trip.id}
                    onClick={() => onViewTrip(trip.id)}
                    sx={{
                      cursor: "pointer",
                      "&:last-child td": { borderBottom: "none" },
                      "&:hover": { backgroundColor: "var(--bg-card-hover)" },
                      transition: "background 0.12s",
                    }}
                  >
                    <TableCell
                      sx={{
                        p: 1.25,
                        borderBottom: "1px solid var(--border-subtle)",
                        maxWidth: 180,
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
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 12,
                            bgcolor: "var(--border)",
                          }}
                        >
                          {trip.rider?.charAt(0)?.toUpperCase() || "R"}
                        </Avatar>

                        <Typography
                          sx={{
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: "var(--text-primary)",
                          }}
                        >
                          {trip.rider}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Date */}
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
                        {trip.start_time
                          ? new Date(trip.start_time).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </TableCell>

                    {/* Pickup */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid var(--border-subtle)",
                        maxWidth: 180,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "var(--text-primary)",
                          whiteSpace: "normal",
                        }}
                      >
                        {trip.pickup_address}
                      </Typography>
                    </TableCell>

                    {/* Destination */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid var(--border-subtle)",
                        maxWidth: 180,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "var(--text-primary)",
                          whiteSpace: "normal",
                        }}
                      >
                        {trip.dropoff_address}
                      </Typography>
                    </TableCell>

                    {/* Status */}
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
                          color: "var(--text-secondary)",
                          whiteSpace: "normal",
                        }}
                      >
                        {trip.status}
                      </Typography>
                    </TableCell>

                    {/* Trip Type */}
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
                          color: "var(--text-secondary)",
                        }}
                      >
                        Standard
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalCount}
            page={currentPage - 1}
            onPageChange={onPageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) =>
              onPageSizeChange(parseInt(e.target.value, 10))
            }
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              color: "rgba(255,255,255,0.6)",
              "& .MuiTablePagination-actions": {
                color: "var(--accent-gold)",
              },
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          />
        </>
      )}
    </Box>
  );
}
