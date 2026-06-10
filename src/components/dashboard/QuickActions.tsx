import React from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { quickActions } from "../../data/mockData.js";

export default function QuickActions() {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        p: 2.25,
        height: "100%",
        transition: "background-color 0.25s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.25,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 14.5,
            color: "var(--text-primary)",
          }}
        >
          Quick Actions
        </Typography>
        <IconButton
          size="small"
          sx={{
            color: "var(--text-muted)",
            backgroundColor: "var(--border)",
            width: 24,
            height: 24,
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
        </IconButton>
      </Box>
      <Typography sx={{ fontSize: 11, color: "var(--text-muted)", mb: 1.75 }}>
        quick links
      </Typography>

      <List dense disablePadding>
        {quickActions.map((action, i) => (
          <ListItem
            key={i}
            disablePadding
            sx={{
              py: 0.55,
              px: 0.5,
              cursor: "pointer",
              borderRadius: "8px",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: "var(--accent-gold-glow)",
                "& .action-text": { color: "var(--accent-gold) !important" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 18 }}>
              <FiberManualRecordIcon
                sx={{ fontSize: 5, color: "var(--text-muted)" }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  className="action-text"
                  sx={{
                    fontSize: 12.5,
                    color: "var(--text-secondary)",
                    transition: "color 0.15s ease",
                  }}
                >
                  {action.label}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
