import React from "react";
import {
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_type: string;
  city: string;
  state: string;
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

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
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
            <TableCell sx={headerCellSx}>Name & Email</TableCell>
            <TableCell sx={headerCellSx}>Phone</TableCell>
            <TableCell sx={headerCellSx}>User Type</TableCell>
            <TableCell sx={headerCellSx}>City/State</TableCell>
            <TableCell sx={headerCellSx}>Referral Code</TableCell>
            <TableCell sx={headerCellSx}>Date Joined</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ ...bodyCellSx }}>
                <CircularProgress
                  size={28}
                  sx={{ color: "var(--accent-gold, #FFD700)" }}
                />
              </TableCell>
            </TableRow>
          ) : users.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ ...bodyCellSx }}>
                <Typography sx={{ color: "var(--text-secondary, #8A92A6)" }}>
                  No users found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.data.map((user) => (
              <TableRow
                key={user.id}
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
                {/* Name & Email */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-primary, #FFF)",
                      lineHeight: 1.3,
                    }}
                  >
                    {user.first_name} {user.last_name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
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
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-secondary, #C1C7D0)",
                    }}
                  >
                    {user.phone_number || "—"}
                  </Typography>
                </TableCell>

                {/* User Type */}
                <TableCell sx={bodyCellSx}>
                  <Chip
                    label={user.user_type || "User"}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      textTransform: "capitalize",
                      borderColor: "var(--border, rgba(255, 255, 255, 0.15))",
                      color: "var(--text-secondary, #C1C7D0)",
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                    }}
                  />
                </TableCell>

                {/* City/State */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-secondary, #C1C7D0)",
                    }}
                  >
                    {user.city || "—"}
                    {user.state ? `, ${user.state}` : ""}
                  </Typography>
                </TableCell>

                {/* Referral Code */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontFamily: "monospace",
                      color: user.referral_code
                        ? "var(--accent-gold, #FFD700)"
                        : "var(--text-muted, #8A92A6)",
                    }}
                  >
                    {user.referral_code || "—"}
                  </Typography>
                </TableCell>

                {/* Date Joined */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "var(--text-secondary, #C1C7D0)",
                    }}
                  >
                    {user.date_joined
                      ? new Date(user.date_joined).toLocaleDateString()
                      : "—"}
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
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) =>
          onPageSizeChange(parseInt(e.target.value, 10))
        }
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

export default UsersTable;