import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  TablePagination,
} from "@mui/material";
import { Trip } from "../../types/auth";

interface TripsTableProps {
  isLoading: boolean;
  tripsList: Trip[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
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
}: TripsTableProps) {
  const gridTemplate = "1.2fr 1fr 1.5fr 1fr 0.8fr 40px";

  return (
    <Box sx={{ mt: 1, position: "relative" }}>
      {/* Table Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          pb: 1.5,
          px: 1,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {["Name", "Date", "Pick up", "Destination", "Status", "TripType"].map(
          (header, idx) => (
            <Typography
              key={idx}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "secondary.main",
              }}
            >
              {header}
            </Typography>
          ),
        )}
      </Box>

      {/* List Content States */}
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
        <Typography
          sx={{
            textAlign: "center",
            py: 6,
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          No trip found.
        </Typography>
      ) : (
        tripsList.map((trip) => (
          <Box
            key={trip.id}
            sx={{
              display: "grid",
              gridTemplateColumns: gridTemplate,
              alignItems: "center",
              py: 2,
              px: 1,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.01)",
              },
            }}
          >
            {/* trips */}
            <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: 12,
                  bgcolor: "var(--border)",
                }}
              >
                {trip.rider?.charAt(0)?.toUpperCase() || "R"}
              </Avatar>

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                {trip.rider || "Unknown Rider"}
              </Typography>
            </Box>

            {/* Date */}
            <Typography
              sx={{
                fontSize: 12,
                color: "secondary.main",
              }}
            >
              {trip.start_time
                ? new Date(trip.start_time).toLocaleDateString()
                : "N/A"}
            </Typography>

            {/* Pickup */}
            <Typography
              noWrap
              sx={{
                fontSize: 12,
                color: "secondary.main",
                pr: 2,
              }}
            >
              {trip.pickup_address}
            </Typography>

            {/* Destination */}
            <Typography
              noWrap
              sx={{
                fontSize: 12,
                color: "secondary.main",
                pr: 2,
              }}
            >
              {trip.dropoff_address}
            </Typography>

            {/* Status */}
            <Typography
              noWrap
              sx={{
                fontSize: 12,
                color: "secondary.main",
                pr: 2,
              }}
            >
              Staus not availablee
            </Typography>

            {/* Dummy Trip Type */}
            <Typography
              noWrap
              sx={{
                fontSize: 12,
                color: "secondary.main",
              }}
            >
              not available
            </Typography>
          </Box>
        ))
      )}

      {/* Server-Side Pagination Controller */}
      {!isLoading && tripsList.length > 0 && (
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
