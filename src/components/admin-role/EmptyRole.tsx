import { Box, Typography, Button } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";

export default function AdminRoleEmptyState() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 10,
        textAlign: "center",
        border: "1px dashed var(--border)",
        borderRadius: "16px",
      }}
    >
      <AdminPanelSettingsIcon
        sx={{
          fontSize: 72,
          color: "var(--text-secondary)",
          mb: 2,
        }}
      />

      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        No Roles Assigned
      </Typography>

      <Typography
        sx={{
          color: "var(--text-muted)",
          mt: 1,
        }}
      >
        Create your first admin role to start
        managing permissions.
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() =>
          navigate("/admin-role/create")
        }
      >
        Add New Role
      </Button>
    </Box>
  );
}