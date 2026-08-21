import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Driver } from "../../../types/auth";
import KycStatusChip from "../ChipBadge";

export default function DriverModalHeader({ driver }: { driver: Driver }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (!driver.email) return;
    await navigator.clipboard.writeText(driver.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex",flexWrap:"wrap", alignItems: "center", gap: 2 }}>
        <Avatar
          src={(driver as any).profile_picture_url}
          sx={{ width: 54, height: 54 }}
        />
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ color: "#ffb400", fontSize: 18 }} />
            <Typography sx={{ fontSize: 18, fontWeight: 700, mr: 0.5 }}>
              {parseFloat(driver.rating || "0").toFixed(1)}
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              {driver.full_name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
              {driver.email}
            </Typography>
            <Box className="flex items-center gap-2">
              <IconButton
                onClick={handleCopyEmail}
                sx={{ color: "#4d8eff", p: 0.5 }}
              >
                <ContentCopyIcon sx={{ fontSize: 14 }} />
              </IconButton>
              {copied && (
                <Typography sx={{ fontSize: 12, fontWeight: 500, mt: 0.5 }}>
                  Copied
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <KycStatusChip status={driver.kyc_status} />
    </Box>
  );
}