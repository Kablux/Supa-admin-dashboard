// components/RidersTable.tsx
import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Rating,
  IconButton,
  TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Rider } from "../../types/auth";


interface RidersTableProps {
  isLoading: boolean;
  ridersList: Rider[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export default function RidersTable({
  isLoading,
  ridersList,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: RidersTableProps) {
  // Reusable column layout for both header and rows
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
        {["Name", "Phone number", "Address", "Completed Rides", "Ratings", ""].map(
          (header, idx) => (
            <Typography
              key={idx}
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {header}
            </Typography>
          )
        )}
      </Box>

      {/* List Content States */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress size={28} sx={{ color: "var(--accent-gold)" }} />
        </Box>
      ) : ridersList.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            py: 6,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          No rider match profiles located.
        </Typography>
      ) : (
        ridersList.map((rider) => (
          <Box
            key={rider.id}
            sx={{
              display: "grid",
              gridTemplateColumns: gridTemplate,
              alignItems: "center",
              py: 2,
              px: 1,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.01)" },
            }}
          >
            {/* Profile Identity */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Avatar
                src={rider.profile_image_url}
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: 11,
                  bgcolor: "var(--border)",
                }}
              >
                {rider.full_name ? rider.full_name[0].toUpperCase() : "?"}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}
                  noWrap
                >
                  {rider.full_name}
                </Typography>
                <Typography
                  sx={{ fontSize: 10, color: "var(--text-muted)" }}
                  noWrap
                >
                  {rider.email}
                </Typography>
              </Box>
            </Box>

            {/* Contacts */}
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              {rider.phone_number || "—"}
            </Typography>

            {/* Address */}
            <Typography
              sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)", pr: 2 }}
              noWrap
            >
              {rider.address || "No Address Added"}
            </Typography>

            {/* Ride Metrics */}
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              {rider.completed_rides || "0"} rides
            </Typography>

            {/* Ratings Component */}
            <Rating
              readOnly
              value={parseFloat(rider.rating || "0")}
              precision={0.5}
              size="small"
              sx={{ color: "var(--accent-gold)", fontSize: 12 }}
            />

            {/* Options Action Menu Pop trigger */}
            <IconButton size="small" sx={{ color: "rgba(255,255,255,0.4)" }}>
              <MoreVertIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ))
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