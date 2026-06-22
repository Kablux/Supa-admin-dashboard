import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppButton from "../components/common/AppButton";
import AdminTextField from "../components/common/TextInput";
import CreateIcon from "@mui/icons-material/Create";

export default function AddNewRider() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Rider Payload:", formData);
    // dispatch(addRider(formData));
    // navigate("/riders");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          mb: 8,
        }}
      >
        <Typography
          sx={{ fontSize: "18px", fontWeight: 500, color: "primary" }}
        >
          Add New Rider
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography
            sx={{
              color: "var(--accent-gold)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Manually
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Import CSV
          </Typography>

          <Button
            variant="outlined"
            sx={{
              color: "var(--primary)",
              borderColor: "var(--primary)",
              textTransform: "none",
              borderWidth: "1px",
              borderRadius: "8px",
              py: 1.2,
              px: 4,
              fontSize: "14px",
              fontWeight: 500,
              ml: 2,
              "&:hover": { borderColor: "rgba(255,255,255,0.3)" },
            }}
            onClick={() => navigate("/riders")}
          >
            Go Back
          </Button>
          <AppButton onClick={handleSubmit} sx={{ borderRadius: "8px", px: 3 }}>
            Add Rider
          </AppButton>
        </Box>
      </Box>

      {/* Form Container */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          borderColor: "var(--border)",
          borderWidth: "1px",
          borderRadius: "8px",
          p: 4,
          backgroundColor: "var(--bg-card)",
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "primary",
            mb: 3,
            // textAlign: "center",
          }}
        >
          Basic Details
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Name Field */}
          <AdminTextField
            label="Name of Rider"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Ade Peters"
            fullWidth
          />
          {/* Car Description */}
          <Box sx={{ position: "relative", width: "100%" }}>
            <AdminTextField
              label="Car Description"
              multiline
              rows={3}
              fullWidth
              placeholder="e.g. The Car is a Well-maintained Toyota in Silver color. Features a clean cloth interior, ice-cold air conditioning, Bluetooth audio streaming, and ample trunk space for luggage and airport trips."
              sx={{
                "& .MuiOutlinedInput-root": {
                  pb: 5,
                },
              }}
            />
            <Box
              component={"div"}
              sx={{
                position: "absolute",
                bottom: 12,
                right: 16,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <CreateIcon
                sx={{
                  fontSize: 16,
                  cursor: "pointer",
                  "&:hover": { color: "#fff" },
                }}
              />
            </Box>
          </Box>
          {/* Contact Layout Row */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <AdminTextField
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rider@example.com"
              fullWidth
            />
            <AdminTextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+234..."
              fullWidth
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <AdminTextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter home address"
              fullWidth
            />

            <AdminTextField
              select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              slotProps={{
                select: { native: true },
              }}
            >
              <option value="" disabled style={{ color: "#000" }}>
                Select Gender
              </option>
              <option value="male" style={{ color: "#000" }}>
                Male
              </option>
              <option value="female" style={{ color: "#000" }}>
                Female
              </option>
            </AdminTextField>
          </Box>
        </Box>

        {/* Bottom Actions */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 6 }}>
          <Button
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "var(--border)",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Save to draft
          </Button>
          <AppButton type="submit" sx={{ borderRadius: "8px", px: 4 }}>
            Add Rider
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
}
