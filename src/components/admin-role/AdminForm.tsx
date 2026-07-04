import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
  Divider,
  useTheme,
  Avatar,
} from "@mui/material";

import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { MdOutlinePersonOutline } from "react-icons/md";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useAppDispatch } from "../../redux/hooks";
import { createAdminRoleThunk } from "../../api/xhrHelper";
import { useNavigate } from "react-router-dom";
import { AdminRoleType } from "../../types/common.types";
import AppButton from "../common/AppButton";

interface Props {
  onSuccess?: () => void;
}

const ROLE_OPTIONS: AdminRoleType[] = [
  "Support Agent",
  "Operations Officer",
  "Finance Officer",
  "Fleet Manager",
  "Corporate Manager",
  "Compliance Officer",
  "Driver Officer",
  "Rider Officer",
  "Engineering Officer",
];

export default function AdminRoleForm({ onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  //   const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState<AdminRoleType>("Support Agent");
  const [permission, setPermission] = useState(true);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Add this handler function
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create a temporary URL so we can show a preview immediately
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      id: crypto.randomUUID(),
      full_name: fullName,
      email,
      avatar: avatarPreview || null,
      role,
      permission,
      created_at: new Date().toISOString(),
    };

    await dispatch(createAdminRoleThunk(payload));
    onSuccess?.();
    navigate("/admin-role");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: "20px",
        backgroundColor: isDark ? "#111111" : "#FFFFFF",
        border: isDark
          ? "1px solid rgba(255,255,255,0.04)"
          : "1px solid rgba(0,0,0,0.06)",
        // boxShadow: isDark
        //   ? "0px 10px 40px rgba(0,0,0,0.2)"
        //   : "0px 10px 40px rgba(0,0,0,0.03)",
        transition: "all 0.3s ease",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* ── Section 1: User Details ── */}
        <Box>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            User Information
          </Typography>
          <Typography
            sx={{ fontSize: 13, color: "var(--text-muted)", mb: 2.5 }}
          >
            Enter the personal details of the staff member being assigned.
          </Typography>

          {/* ── Avatar Upload Section ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
            {/* Preview Circle */}
            <Avatar
              src={avatarPreview}
              sx={{
                width: 72,
                height: 72,
                backgroundColor: "var(--border)", // Fallback color
                border: "2px dashed var(--text-muted)",
                color: "var(--text-muted)",
              }}
            >
              {!avatarPreview && <MdOutlinePersonOutline size="24px" />}
            </Avatar>

            {/* Upload Controls */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadOutlinedIcon />}
                sx={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border)",
                  textTransform: "none",
                  fontWeight: 500,
                  width: "fit-content",
                  "&:hover": {
                    borderColor: "var(--text-muted)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Upload Photo
                {/* Hidden file input */}
                <input
                  type="file"
                  hidden
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                />
              </Button>

              <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
                {avatarFile
                  ? avatarFile.name
                  : "SVG, PNG, JPG or GIF (max. 2MB)"}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <TextField
              label="Full Name"
              placeholder="e.g. David Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Email Address"
              type="email"
              placeholder="e.g. david.smith@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              //   required
              fullWidth
            />
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          }}
        />

        {/* ── Section 2: Role & Scope ── */}
        <Box>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AdminPanelSettingsOutlinedIcon
              sx={{ fontSize: 18, color: "var(--accent-gold, #FFC107)" }}
            />
            Role & Scope
          </Typography>
          <Typography
            sx={{ fontSize: 13, color: "var(--text-muted)", mb: 2.5 }}
          >
            Select the operational role and define system access permissions.
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Assigned Role</InputLabel>
            <Select
              value={role}
              label="Assigned Role"
              onChange={(e) => setRole(e.target.value as AdminRoleType)}
              sx={{
                borderRadius: "10px",
              }}
            >
              {ROLE_OPTIONS.map((item) => (
                <MenuItem key={item} value={item} sx={{ py: 1.25 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "var(--accent-gold, #FFC107)",
                      }}
                    />
                    {item}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Styled Friendly Permission Card */}
          <Box
            onClick={() => setPermission(!permission)}
            sx={{
              mt: 2.5,
              p: 2.5,
              borderRadius: "12px",
              backgroundColor: isDark
                ? permission
                  ? "rgba(245,197,24,0.06)"
                  : "rgba(255,255,255,0.02)"
                : permission
                  ? "rgba(245,197,24,0.08)"
                  : "rgba(0,0,0,0.02)",
              border: `1px solid ${
                permission
                  ? "rgba(245,197,24,0.3)"
                  : isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.06)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  backgroundColor: permission
                    ? "var(--accent-gold, #FFC107)"
                    : isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  color: permission ? "#000" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <SecurityOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  Grant Access Permission
                </Typography>
                <Typography
                  sx={{ fontSize: 12.5, color: "var(--text-muted)", mt: 0.25 }}
                >
                  {permission
                    ? "Active: User will have immediate access to their role dashboard upon creation."
                    : "Suspended: User is created but will be blocked from logging in until enabled."}
                </Typography>
              </Box>
            </Box>

            <Switch
              checked={permission}
              onChange={(e) => setPermission(e.target.checked)}
              onClick={(e) => e.stopPropagation()} // Prevent double trigger from parent box
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--accent-gold, #FFC107)",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "var(--accent-gold, #FFC107)",
                },
              }}
            />
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          }}
        />

        {/* ── Section 3: Action Buttons ── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            pt: 1,
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate("/admin-role")}
            sx={{
              color: "var(--text-muted)",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              py: 1.2,
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
                color: "var(--text-primary)",
              },
            }}
          >
            Cancel
          </Button>

          <AppButton
            type="submit"
            sx={{
              px: 4,
              py: 1.2,
            }}
          >
            Create Assignment
          </AppButton>
        </Box>
      </Box>
    </Paper>
  );
}
