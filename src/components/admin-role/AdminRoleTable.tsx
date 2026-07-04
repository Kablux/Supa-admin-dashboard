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
import { AdminRole } from "../../types/common.types";
import { useState } from "react";

interface AdminRolesTableProps {
  roles: AdminRole[];
  isLoading: boolean;
  onViewRole?: (roleId: string) => void;
  onDeleteRole?: (roleId: string) => void;
  onTogglePermission?: (roleId: string, currentPermission: boolean) => void;
}

export default function AdminRolesTable({
  roles,
  isLoading,
  onViewRole,
}: AdminRolesTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    role: AdminRole,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };
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
                  px: 1.2,
                  py: 1.5,
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
              onClick={() => onViewRole?.(role.id)}
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    src={role.avatar || undefined}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 13,
                      fontWeight: 600,
                      backgroundColor: "var(--accent-gold, #FFC107)",
                      color: "#000",
                    }}
                  >
                    {role.full_name.charAt(0)}
                  </Avatar>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {role.full_name}
                  </Typography>
                </Box>
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
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, role)}
                >
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
