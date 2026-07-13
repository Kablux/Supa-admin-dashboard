import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Rating,
  IconButton,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Rider } from "../../types/auth";
import { FaPersonBiking } from "react-icons/fa6";

interface RidersTableProps {
  isLoading: boolean;
  ridersList: Rider[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onViewRider: (riderId: string) => void;
}

export default function RidersTable({
  isLoading,
  ridersList,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewRider,
}: RidersTableProps) {
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
      ) : ridersList.length === 0 ? (
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
            <FaPersonBiking size={20} />
          </Box>

          <Typography
            sx={{ fontSize: 18, fontWeight: 600, color: "#fff", mb: 1 }}
          >
            No Rider Found
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            No rider match this Profile by filter.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  "Name",
                  "Phone Number",
                  "Address",
                  "Completed Rides",
                  "Ratings",
                  "Actions",
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
              {ridersList.map((rider) => (
                <TableRow
                  key={rider.id}
                  onClick={() => onViewRider(rider.id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "var(--bg-card-hover)",
                    },
                    transition: "background 0.12s",
                  }}
                >
                  {/* Profile */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
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
                        src={rider.profile_image_url}
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: 12,
                          bgcolor: "var(--border)",
                        }}
                      >
                        {rider.full_name?.charAt(0)?.toUpperCase() || "?"}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: "var(--text-primary)",
                          }}
                          noWrap
                        >
                          {rider.full_name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "var(--text-secondary)",
                          }}
                          noWrap
                        >
                          {rider.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Phone */}
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
                      {rider.phone_number || "—"}
                    </Typography>
                  </TableCell>

                  {/* Address */}
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
                      {rider.address || "No Address Added"}
                    </Typography>
                  </TableCell>

                  {/* Completed Rides */}
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
                      {rider.completed_rides || 0}
                    </Typography>
                  </TableCell>

                  {/* Rating */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Rating
                      readOnly
                      value={parseFloat(rider.rating || "0")}
                      precision={0.5}
                      size="small"
                      sx={{
                        color: "var(--accent-gold)",
                        fontSize: 14,
                      }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderBottom: "1px solid var(--border-subtle)",
                      width: 50,
                    }}
                  >
                    <IconButton size="small" sx={{ color: "secondary.main" }}>
                      <MoreVertIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Server-Side Pagination Controller */}
      {!isLoading && ridersList.length > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage - 1} // Sync back down to base 0 for MUI view layer
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
