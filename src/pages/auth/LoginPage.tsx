import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { loginAdmin } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearAuthError } from "../../redux/slices/Auth";
// import { useThemeMode } from "../../theme/ThemeContext";
import { LoginCredentials, LoginFormErrors } from "../../types/auth";
import { validateLoginForm } from "../../utils/hook";
import AdminTextField from "../../components/common/TextInput";
import { toast } from "react-toastify";

const initialValues: LoginCredentials = {
  email: "",
  password: "",
  role: "business_admin",
};

export default function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  // const location = useLocation();
  const dispatch = useAppDispatch();
  // const { mode } = useThemeMode();

  const { status, error } = useAppSelector((state) => state.auth);

  const [values, setValues] = useState<LoginCredentials>(initialValues);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isSubmitting = status === "loading";

  // const from =
  //   (location.state as { from?: { pathname: string } } | null)?.from
  //     ?.pathname ?? "/";

  // if (isAuthenticated) {
  //   return <Navigate to={from} replace />;
  // }

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleChange =
    (field: keyof LoginCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
      if (error) dispatch(clearAuthError());
    };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateLoginForm(values);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];

      if (firstError) {
        toast.error(firstError, {
          toastId: "validation-error",
        });
      }

      return;
    }

    const result = await dispatch(
      loginAdmin({
        email: values.email,
        password: values.password,
        role: values.role,
      }),
    );

    if (loginAdmin.fulfilled.match(result)) {
      toast.success("Welcome, Administrator");
      navigate("/", {
        replace: true,
      });
    }
  };

  return (
    <Box
      className="min-h-screen w-full flex items-center justify-center p-8"
      sx={{
        p: 2,
        background: `
    radial-gradient(
      circle at top,
      rgba(245,197,24,.08),
      transparent 40%
    ),
    var(--bg-primary)
  `,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: "24px",
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg-card)",
          p: { xs: 4, sm: 5 },
          boxShadow: "0 20px 60px rgba(0,0,0,.35)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Box className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 relative z-10">
          {/* Brand Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 5,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                backgroundColor: "var(--accent-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#000",
                }}
              >
                K
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Kablux
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "var(--text-muted)",
                mt: 1,
                textAlign: "center",
              }}
            >
              Business Administration Portal
            </Typography>

            <Typography
              className="text-center"
              sx={{ fontSize: 14, color: "var(--text-muted)" }}
            >
              Sign in to access the super administrator dashboard.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <AdminTextField
              label="Administrative Email"
              type="email"
              placeholder="admin@kabliz.com"
              value={values.email}
              onChange={handleChange("email")}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={isSubmitting}
              fullWidth
              autoComplete="off"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon
                        sx={{ fontSize: 18, color: "var(--text-muted)" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <AdminTextField
              label="Secure Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange("password")}
              error={Boolean(errors.password)}
              helperText={errors.password}
              disabled={isSubmitting}
              fullWidth
              autoComplete="off"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ fontSize: 18, color: "var(--text-muted)" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        sx={{ color: "var(--text-muted)" }}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              disabled={isSubmitting}
              sx={{
                mt: 1,
                height: 52,
                borderRadius: "14px",
                backgroundColor: "var(--accent-gold)",
                color: "#000",
                fontSize: 14,
                fontWeight: 500,
                textTransform: "none",
                transition: "all .2s ease",
                "&:hover": {
                  backgroundColor: "#f5c518",
                  transform: "translateY(-1px)",
                  boxShadow: "0 10px 25px rgba(245,197,24,.25)",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={20} sx={{ color: "#000" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
