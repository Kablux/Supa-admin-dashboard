import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { AdminRole } from "../../types/common.types";

interface AdminRolesTableProps {
  roles: AdminRole[];
  isLoading: boolean;
  onViewRole?: (roleId: string) => void;
}

export default function AdminRolesTable({
  roles,
  isLoading,
  onViewRole,
}: AdminRolesTableProps) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress size={28} sx={{ color: "var(--accent-gold)" }} />
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {["Name", "Date Created", "Role", "Action"].map((header) => (
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
          {roles.map((role) => (
            <TableRow
              key={role.id}
              sx={{
                "&:last-child td": { borderBottom: "none" },
                "&:hover": { backgroundColor: "var(--bg-card-hover)" },
                transition: "background 0.12s",
              }}
            >
              {/* Role Name */}
              <TableCell
                sx={{
                  p: 1.25,
                  borderBottom: "1px solid var(--border-subtle)",
                  maxWidth: 180,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  {role.full_name || "No name assigned"}
                </Typography>
              </TableCell>

              {/* Users Assigned */}
              <TableCell
                sx={{
                  p: 1.25,
                  borderBottom: "1px solid var(--border-subtle)",
                  // maxWidth: 180,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "var(--text-primary)",
                  }}
                >
                  {role.created_at
                    ? new Date(role.created_at).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </TableCell>

              {/* Description */}
              <TableCell
                sx={{
                  p: 1.25,
                  borderBottom: "1px solid var(--border-subtle)",
                  // maxWidth: 180,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "var(--text-primary)",
                  }}
                >
                  {role.role}
                </Typography>
              </TableCell>

              {/* Action */}
              <TableCell
                // align=""
                sx={{
                  p: 1.25,
                  borderBottom: "1px solid var(--border-subtle)",
                  // maxWidth: 180,
                }}
              >
                <IconButton size="small" onClick={() => onViewRole?.(role.id)}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
