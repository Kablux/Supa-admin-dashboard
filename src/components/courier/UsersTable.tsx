import React from "react";
import {
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
} from "@mui/material";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_type: string;
  account_status: string;
  city: string | null;
  state: string | null;
  referral_code?: string;
  date_joined: string;
}

interface UsersTableProps {
  users: {
    data: User[];
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

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const renderStatusChip = (status: string) => {
    const isActive = status?.toUpperCase() === "ACTIVE";
    return (
      <Chip
        label={status || "UNKNOWN"}
        size="small"
        sx={{
          height: 24,
          fontSize: 10,
          fontWeight: 600,
          backgroundColor: isActive ? "rgba(16, 185, 129, 0.018)" : "rgba(239, 68, 68, 0.023)",
          color: isActive ? "#34d399cc" : "#f87171bd",
          border: `1px solid ${isActive ? "rgba(16, 185, 129, 0.096)" : "rgba(239, 68, 68, 0.068)"}`,
        }}
      />
    );
  };

  return (
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
            <TableCell sx={headerCellSx}>Name &amp; Email</TableCell>
            <TableCell sx={headerCellSx}>Phone</TableCell>
            <TableCell sx={headerCellSx}>User Type</TableCell>
            <TableCell sx={headerCellSx}>City / State</TableCell>
            <TableCell sx={headerCellSx}>Referral Code</TableCell>
            <TableCell sx={headerCellSx}>Account Status</TableCell>
            <TableCell sx={headerCellSx}>Date Joined</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={bodyCellSx}>
                <Box sx={{ py: 4 }}>
                  <CircularProgress size={28} sx={{ color: "var(--accent-gold, #FEB914)" }} />
                </Box>
              </TableCell>
            </TableRow>
          ) : users.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={bodyCellSx}>
                <Typography sx={{ py: 4, color: "var(--text-secondary, #8A92A6)", fontSize: 14 }}>
                  No users found matching query.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.data.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  transition: "background-color 0.15s ease",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.025)" },
                  "&:last-child td, &:last-child th": { borderBottom: 0 },
                }}
              >
                {/* Name & Email */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--text-primary, #FFF)",
                      lineHeight: 1.3,
                    }}
                  >
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      color: "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                      display: "block",
                    }}
                  >
                    {user.email}
                  </Typography>
                </TableCell>

                {/* Phone */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 12, color: "var(--text-secondary, #C1C7D0)" }}>
                    {user.phone_number || "N/A"}
                  </Typography>
                </TableCell>

                {/* User Type */}
                <TableCell sx={bodyCellSx}>
                  <Chip
                    label={user.user_type || "User"}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      borderRadius: "6px",
                      backgroundColor: "var(--bg-secondary, #161B26)",
                      color: "var(--text-secondary, #C1C7D0)",
                      border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
                      fontSize: 11,
                      fontWeight: 600,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </TableCell>

                {/* City / State */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 12, color: "var(--text-secondary, #C1C7D0)" }}>
                    {[user.city, user.state].filter(Boolean).join(", ") || "N/A"}
                  </Typography>
                </TableCell>

                {/* Referral Code */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "monospace",
                      color: user.referral_code
                        ? "var(--accent-gold, #FFD700)"
                        : "var(--text-muted, #8A92A6)",
                    }}
                  >
                    {user.referral_code || "No Ref Code"}
                  </Typography>
                </TableCell>

                {/* Account Status */}
                <TableCell sx={bodyCellSx}>
                  {renderStatusChip(user.account_status)}
                </TableCell>

                {/* Date Joined */}
                <TableCell sx={bodyCellSx}>
                  <Typography sx={{ fontSize: 12, color: "var(--text-secondary, #C1C7D0)" }}>
                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "—"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={users.count}
        page={Math.max(0, page)}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        sx={{
          color: "var(--text-secondary, #C1C7D0)",
          "& .MuiTablePagination-actions": { color: "var(--accent-gold)" },
          // borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      />
    </TableContainer>
  );
};

export default UsersTable;