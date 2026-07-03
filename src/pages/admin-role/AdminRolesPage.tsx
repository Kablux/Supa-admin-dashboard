import { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import OverviewCards, { OverviewItem } from "../../components/OverviewCard";

import { fetchAdminRoles } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { FiUsers } from "react-icons/fi";
import AdminRolesTable from "../../components/admin-role/AdminRoleTable";
import AdminRoleEmptyState from "../../components/admin-role/EmptyRole";

export default function AdminRolePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { roles, summary, isLoading } = useAppSelector(
    (state) => state.adminRole,
  );

  useEffect(() => {
    dispatch(fetchAdminRoles());
  }, [dispatch]);

  const roleStats: OverviewItem[] = summary.map((item) => ({
    title: item.role,
    value: item.count,
    icon: <FiUsers />,
  }));

  return (
    <Box
      className="fade-in"
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3.5,
      }}
    >
      {/* Top Action Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => navigate("/admin-role/create")}
          sx={{
            bgcolor: "var(--accent-gold)",
            color: "#000",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              bgcolor: "var(--accent-gold)",
            },
          }}
        >
          Add New
        </Button>
      </Box>

      {/* Overview Cards */}
      <OverviewCards items={roleStats} maxWidth="100%" loading={isLoading} />

      {/* Header */}
      <Box sx={{ mt: 4 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: "16", sm: 18 },
            color: "var(--text-primary)",
          }}
        >
          Admin
        </Typography>
      </Box>
      {/* Table / Empty State */}
      {!isLoading && roles.length === 0 ? (
        <AdminRoleEmptyState />
      ) : (
        <AdminRolesTable
          roles={roles}
          isLoading={isLoading}
          onViewRole={(roleId) => {
            console.log("View Role", roleId);
          }}
        />
      )}
    </Box>
  );
}
